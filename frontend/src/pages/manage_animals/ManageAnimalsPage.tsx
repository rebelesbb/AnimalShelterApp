import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import "../../styles/ModalStyle.css"
import "../../styles/MainPage.css";
import "../../styles/manage_animals/ManageAnimalsPage.css";

type Location = { id: number; city: string };
type Admin = { username: string; role: string; location: Location };
type Animal = { id: number; name: string; photoPath: string };

const ManageAnimalsPage: React.FC = () => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        let payload: any;
        try {
            payload = JSON.parse(atob(token.split(".")[1]));
        } catch {
            toast.error("Invalid token");
            navigate("/login");
            return;
        }
        if (payload.role !== "ADMIN") {
            toast.error("Access denied");
            navigate("/");
            return;
        }
        const load = async () => {
            try {
                const admRes = await fetch(
                    `http://localhost:8080/api/employees/${payload.sub}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!admRes.ok) throw new Error();
                const admData: Admin = await admRes.json();
                setAdmin(admData);

                const res = await fetch(
                    `http://localhost:8080/api/animals/filter?locationId=${admData.location.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.status === 204) {
                    setAnimals([]);
                } else if (res.ok) {
                    setAnimals(await res.json());
                } else {
                    throw new Error();
                }
            } catch (e: any) {
                toast.error("Failed to load");
            }
        };
        load();
    }, [navigate]);

    const handleAdd = () => navigate("/animals/manage/add");
    const handleModify = (id: number) => navigate(`/animals/manage/edit/${id}`);

    const requestDelete = (animal: Animal) => {
        setAnimalToDelete(animal);
        setModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!animalToDelete) return;
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/animals/${animalToDelete.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            setAnimals(a => a.filter(x => x.id !== animalToDelete.id));
            toast.success("Deleted");
        } else {
            toast.error("Delete failed");
        }
        setModalOpen(false);
        setAnimalToDelete(null);
    };

    const cancelDelete = () => {
        setModalOpen(false);
        setAnimalToDelete(null);
    };

    if (!admin) {
        return (
            <>
                <Header />
                <p className="loading-text">Loading…</p>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="manage-animals-container">
                <div className="header-row">
                    <h2>Manage Animals @ {admin.location.city}</h2>
                    <button className="add-btn" onClick={handleAdd}>
                        + Add Animal
                    </button>
                </div>
                <div className="manage-animals-grid">
                    {animals.map(animal => (
                        <div key={animal.id} className="manage-animal-card">
                            <img
                                src={`http://localhost:8080${animal.photoPath}`}
                                alt={animal.name}
                            />
                            <div className="manage-card-info">
                                <strong>{animal.name}</strong>
                            </div>
                            <div className="manage-actions">
                                <button
                                    className="modify-btn"
                                    onClick={() => handleModify(animal.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => requestDelete(animal)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ReactModal
                isOpen={modalOpen}
                onRequestClose={cancelDelete}
                contentLabel="Confirm Deletion"
                className="confirm-modal"
                overlayClassName="confirm-modal-overlay"
            >
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete <strong>{animalToDelete?.name}</strong>?</p>
                <div className="modal-buttons">
                    <button onClick={confirmDelete} className="confirm-btn">Yes</button>
                    <button onClick={cancelDelete} className="cancel-btn">Cancel</button>
                </div>
            </ReactModal>
        </>
    );
};

export default ManageAnimalsPage;
