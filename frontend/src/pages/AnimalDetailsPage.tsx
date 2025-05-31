import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactModal from "react-modal";
import "../styles/ModalStyle.css"
import "../styles/AnimalDetailsPage.css";
import Header from "../components/Header";

type Animal = {
    id: number;
    name: string;
    photoPath: string;
    species: string;
    breed: string;
    birthDate: string;
    sex: string;
    size: string;
    weight: number;
    coatType: string;
    temperament: string;
    specialNeeds: string | null;
    goodWithKids: boolean;
    goodWithAnimals: boolean;
    arrivalDate: string;
    description: string;
};

const AnimalDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [animal, setAnimal] = useState<Animal | null>(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8080/api/animals/${id}`)
            .then((res) => res.json())
            .then((data) => setAnimal(data))
            .catch((err) => console.error("Failed to fetch animal details", err));
    }, [id]);

    const handleAdoptClick = () => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate(`/animals/adopt/${id}`);
        } else {
            setShowModal(true);
        }
    };

    const confirmAdoptWithoutLogin = () => {
        setShowModal(false);
        navigate(`/animals/adopt/${id}`);
    };

    if (!animal) return <div>Loading...</div>;

    return (
        <>
            <Header />

            <div className="details-container">
                <div className="details-card">
                    <div className="left-section">
                        <img src={`http://localhost:8080${animal.photoPath}`} alt={animal.name} />
                        <h2>{animal.name}</h2>
                        <button className="adopt-button" onClick={handleAdoptClick}>Adopt</button>
                    </div>
                    <div className="right-section">
                        <ul>
                            <li><strong>Species:</strong> {animal.species}</li>
                            <li><strong>Breed:</strong> {animal.breed}</li>
                            <li><strong>Age:</strong> {calculateAge(animal.birthDate)}</li>
                            <li><strong>Sex:</strong> {animal.sex}</li>
                            <li><strong>Size:</strong> {animal.size}</li>
                            <li><strong>Weight:</strong> {animal.weight} kg</li>
                            <li><strong>Coat Type:</strong> {animal.coatType}</li>
                            <li><strong>Temperament:</strong> {animal.temperament}</li>
                            <li><strong>Special Needs:</strong> {animal.specialNeeds || "None"}</li>
                            <li><strong>Good With Kids:</strong> {animal.goodWithKids ? "Yes" : "No"}</li>
                            <li><strong>Good With Animals:</strong> {animal.goodWithAnimals ? "Yes" : "No"}</li>
                            <li><strong>Arrival Date:</strong> {animal.arrivalDate}</li>
                        </ul>
                        <div className="description">
                            <h3>Description</h3>
                            <p>{animal.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            <ReactModal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                contentLabel="Continue Without Account"
                className="confirm-modal"
                overlayClassName="confirm-modal-overlay"
            >
                <h3>Do you have an account or want to create one?</h3>
                <p>You can log in or continue without an account.</p>
                <div className="modal-buttons">
                    <button className="confirm-btn" onClick={() => navigate(`/login?redirect=/animals/adopt/${id}`)}>Yes</button>
                    <button className="cancel-btn" onClick={() => {
                        setShowModal(false);
                        navigate(`/animals/adopt/${id}`);
                    }}>
                        Continue without account
                    </button>
                </div>
            </ReactModal>
        </>
    );
};

const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const now = new Date();
    const age = now.getFullYear() - birth.getFullYear();
    return age === 0 ? "<1 year" : `${age} year${age > 1 ? "s" : ""}`;
};

export default AnimalDetailsPage;
