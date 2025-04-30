import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

    useEffect(() => {
        fetch(`http://localhost:8080/api/animals/${id}`)
            .then((res) => res.json())
            .then((data) => setAnimal(data))
            .catch((err) => console.error("Failed to fetch animal details", err));
    }, [id]);

    if (!animal) return <div>Loading...</div>;

    return (
        <>
            <Header/>

            <div className="details-container">
                <div className="details-card">
                    <div className="left-section">
                        <img src={`http://localhost:8080${animal.photoPath}`} alt={animal.name} />
                        <h2>{animal.name}</h2>
                        <button className="adopt-button">Adopt</button>
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
