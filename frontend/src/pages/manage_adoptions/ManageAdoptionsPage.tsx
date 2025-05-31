import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import "../../styles/manage_adoptions/ManageAdoptionsPage.css";
import "../../styles/ModalStyle.css";

type Adoption = {
    id: number;
    startDate: string;
    endDate: string;
    pickupDate: string;
    details: string;
    status: string;
    animal: {
        id: number;
        name: string;
    };
    adopter: {
        id: number;
        name: string;
        phoneNumber: string;
    };
};

type Activity = {
    id: number;
    actionType: string;
    actionDate: string;
    employee: {
        id: number;
        username: string;
    };
};

type Employee = {
    id: number;
    name: string;
    username: string;
    location: { id: number; city: string };
};

const ManageAdoptionsPage: React.FC = () => {
    const [adoptions, setAdoptions] = useState<Adoption[]>([]);
    const [editedDate, setEditedDate] = useState<{ [id: number]: string }>({});
    const [employee, setEmployee] = useState<Employee | null>(null);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [activityList, setActivityList] = useState<Activity[]>([]);
    const [selectedAdoptionId, setSelectedAdoptionId] = useState<number | null>(null);

    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [adoptionToCancel, setAdoptionToCancel] = useState<Adoption | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));
        const username = payload.sub;

        fetch(`http://localhost:8080/api/employees/${username}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((emp: Employee) => {
                setEmployee(emp);
                return fetch(`http://localhost:8080/api/adoptions/location?locationId=${emp.location.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            })
            .then((res) => res.json())
            .then(setAdoptions)
            .catch((err) => {
                console.error("Failed to load data", err);
                toast.error("Could not load adoptions.");
            });
    }, []);

    const handleUpdate = (adoptionId: number, userId: number) => {
        const token = localStorage.getItem("token");
        if (!token || !employee || !editedDate[adoptionId]) return;

        fetch(`http://localhost:8080/api/adoptions/employee/${adoptionId}?employeeId=${employee.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                pickupDate: editedDate[adoptionId],
                userId: userId,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Update failed");
                return res.json();
            })
            .then((updated) => {
                setAdoptions((prev) =>
                    prev.map((a) => (a.id === adoptionId ? updated : a))
                );
                setEditedDate((prev) => ({ ...prev, [adoptionId]: "" }));
                toast.success("Pickup date updated.");
            })
            .catch(() => toast.error("Failed to update pickup date."));
    };

    const handleFinish = (adoptionId: number) => {
        const token = localStorage.getItem("token");
        if (!token || !employee) return;

        fetch(`http://localhost:8080/api/adoptions/${adoptionId}/finish?employeeId=${employee.id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((updated) => {
                setAdoptions((prev) =>
                    prev.map((a) => (a.id === adoptionId ? updated : a))
                );
                toast.success("Adoption marked as finished.");
            })
            .catch(() => toast.error("Failed to finish adoption."));
    };

    const openActivityModal = (adoptionId: number) => {
        setSelectedAdoptionId(adoptionId);

        fetch(`http://localhost:8080/api/adoptions/${adoptionId}/activities`)
            .then((res) => res.json())
            .then((data) => {
                setActivityList(data);
                setModalOpen(true);
            })
            .catch(() => toast.error("Failed to load activities."));
    };

    const closeModal = () => {
        setModalOpen(false);
        setActivityList([]);
        setSelectedAdoptionId(null);
    };

    const requestCancel = (adoption: Adoption) => {
        setAdoptionToCancel(adoption);
        setCancelModalOpen(true);
    };

    const confirmCancel = () => {
        if (!adoptionToCancel || !employee) return;

        const token = localStorage.getItem("token");
        fetch(`http://localhost:8080/api/adoptions/${adoptionToCancel.id}?employeeId=${employee.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error();
                setAdoptions((prev) => prev.filter((a) => a.id !== adoptionToCancel.id));
                toast.success("Adoption cancelled.");
            })
            .catch(() => toast.error("Failed to cancel adoption."))
            .finally(() => {
                setCancelModalOpen(false);
                setAdoptionToCancel(null);
            });
    };

    const cancelModal = () => {
        setCancelModalOpen(false);
        setAdoptionToCancel(null);
    };

    return (
        <>
            <Header />
            <div className="adoptions-container">
                <h2>Manage Adoptions @ {employee?.location.city}</h2>
                {adoptions.length === 0 ? (
                    <p className="loading-text">No adoptions found.</p>
                ) : (
                    <ul className="adoptions-list">
                        {adoptions.map((adoption) => (
                            <li key={adoption.id} className="adoption-item">
                                <div className="adoption-content">
                                    <div><strong>Adoption ID:</strong> {adoption.id}</div>
                                    <div><strong>Animal:</strong> {adoption.animal.name} (ID: {adoption.animal.id})</div>
                                    <div><strong>Pickup Date:</strong> {adoption.pickupDate || "Not set"}</div>
                                    <div><strong>Status:</strong> {adoption.status}</div>
                                    <div><strong>Adopter:</strong> {adoption.adopter.name}</div>
                                    <div><strong>Phone:</strong> {adoption.adopter.phoneNumber}</div>

                                    <input
                                        type="date"
                                        className="date-input"
                                        value={editedDate[adoption.id] || ""}
                                        onChange={(e) =>
                                            setEditedDate({
                                                ...editedDate,
                                                [adoption.id]: e.target.value,
                                            })
                                        }
                                        disabled={adoption.status === "FINISHED"}
                                    />

                                    <div className="adoption-actions">
                                        <button
                                            className="update-btn"
                                            onClick={() => handleUpdate(adoption.id, adoption.adopter.id)}
                                            disabled={adoption.status === "FINISHED"}
                                        >
                                            Update Pickup Date
                                        </button>
                                        <button
                                            className="finish-btn"
                                            onClick={() => handleFinish(adoption.id)}
                                            disabled={adoption.status === "FINISHED"}
                                        >
                                            Finish Adoption
                                        </button>
                                        <button
                                            className="cancel-btn"
                                            onClick={() => requestCancel(adoption)}
                                            disabled={adoption.status === "FINISHED"}
                                        >
                                            Cancel Adoption
                                        </button>
                                        <button
                                            className="view-btn"
                                            onClick={() => openActivityModal(adoption.id)}
                                        >
                                            View Adoption Activity
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ReactModal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                contentLabel="Adoption Activity"
                className="confirm-modal"
                overlayClassName="confirm-modal-overlay"
            >
                <h3>Adoption Activity Log</h3>
                {activityList.length === 0 ? (
                    <p>No activity recorded.</p>
                ) : (
                    <ul>
                        {activityList.map((activity) => (
                            <li key={activity.id}>
                                <strong>{activity.actionType}</strong> by <em>{activity.employee.username}</em> at {new Date(activity.actionDate).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                )}
                <div className="modal-buttons">
                    <button onClick={closeModal} className="cancel-btn">Close</button>
                </div>
            </ReactModal>

            <ReactModal
                isOpen={cancelModalOpen}
                onRequestClose={cancelModal}
                contentLabel="Confirm Cancellation"
                className="confirm-modal"
                overlayClassName="confirm-modal-overlay"
            >
                <h3>Confirm Cancellation</h3>
                <p>
                    Are you sure you want to cancel the adoption of <strong>{adoptionToCancel?.animal.name}</strong>?
                </p>
                <div className="modal-buttons">
                    <button onClick={confirmCancel} className="confirm-btn">Yes</button>
                    <button onClick={cancelModal} className="cancel-btn">Cancel</button>
                </div>
            </ReactModal>
        </>
    );
};

export default ManageAdoptionsPage;
