import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import "../../styles/manage_adoptions/MyAdoptionsPage.css";
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

const MyAdoptionsPage: React.FC = () => {
    const [adoptions, setAdoptions] = useState<Adoption[]>([]);
    const [editedDate, setEditedDate] = useState<{ [id: number]: string }>({});
    const [userId, setUserId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [adoptionToCancel, setAdoptionToCancel] = useState<Adoption | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));
        const extractedUserId = payload.id;
        setUserId(extractedUserId);

        fetch(`http://localhost:8080/api/adoptions/user?userId=${extractedUserId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setAdoptions)
            .catch((err) => {
                console.error("Failed to fetch adoptions", err);
                toast.error("Could not load adoptions.");
            });
    }, []);

    const handleUpdate = (id: number) => {
        const token = localStorage.getItem("token");
        if (!token || !editedDate[id] || userId === null) return;

        fetch(`http://localhost:8080/api/adoptions/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                pickupDate: editedDate[id],
                userId: userId,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Update failed");
                return res.json();
            })
            .then((updated) => {
                setAdoptions((prev) =>
                    prev.map((a) => (a.id === id ? updated : a))
                );
                setEditedDate((prev) => ({ ...prev, [id]: "" }));
                toast.success("Pickup date updated");
            })
            .catch(() => toast.error("Failed to update pickup date"));
    };

    const requestCancel = (adoption: Adoption) => {
        setAdoptionToCancel(adoption);
        setModalOpen(true);
    };

    const confirmCancel = async () => {
        if (!adoptionToCancel || userId === null) return;

        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/adoptions/${adoptionToCancel.id}?userId=${userId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            setAdoptions((prev) => prev.filter((a) => a.id !== adoptionToCancel.id));
            toast.success("Adoption cancelled");
        } else {
            toast.error("Failed to cancel adoption");
        }

        setModalOpen(false);
        setAdoptionToCancel(null);
    };

    const cancelModal = () => {
        setModalOpen(false);
        setAdoptionToCancel(null);
    };

    return (
        <>
            <Header />
            <div className="adoptions-container">
                <h2>Your Adoptions</h2>
                {adoptions.length === 0 ? (
                    <p className="loading-text">No adoptions found.</p>
                ) : (
                    <ul className="adoptions-list">
                        {adoptions.map((adoption) => (
                            <li key={adoption.id} className="adoption-item">
                                <div className="adoption-content">
                                    <div><strong>Adoption ID:</strong> {adoption.id}</div>
                                    <div><strong>Status:</strong> {adoption.status}</div>
                                    <div><strong>Animal:</strong> {adoption.animal.name} (ID: {adoption.animal.id})</div>
                                    <div><strong>Pickup Date:</strong> {adoption.pickupDate || "Not set"}</div>
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
                                    />
                                </div>
                                <div className="adoption-actions">
                                    <button
                                        className="update-btn"
                                        onClick={() => handleUpdate(adoption.id)}
                                        disabled={adoption.status === "FINISHED"}
                                    >
                                        Update Date
                                    </button>
                                    <button
                                        className="cancel-btn"
                                        onClick={() => requestCancel(adoption)}
                                        disabled={adoption.status === "FINISHED"}
                                    >
                                        Cancel Adoption
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ReactModal
                isOpen={modalOpen}
                onRequestClose={cancelModal}
                contentLabel="Confirm Cancellation"
                className="confirm-modal"
                overlayClassName="confirm-modal-overlay"
            >
                <h3>Confirm Cancellation</h3>
                <p>Are you sure you want to cancel the adoption of <strong>{adoptionToCancel?.animal.name}</strong>?</p>
                <div className="modal-buttons">
                    <button onClick={confirmCancel} className="confirm-btn">Yes</button>
                    <button onClick={cancelModal} className="cancel-btn">Cancel</button>
                </div>
            </ReactModal>
        </>
    );
};

export default MyAdoptionsPage;
