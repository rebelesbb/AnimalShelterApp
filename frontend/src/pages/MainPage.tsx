import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // import nou
import "../styles/MainPage.css";
import "../styles/Navbar.css"; // Importăm și Navbarul pentru stil

type Animal = {
    id: number;
    name: string;
    photoPath: string;
};

type Location = {
    id: number;
    city: string;
};

const MainPage: React.FC = () => {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [speciesList, setSpeciesList] = useState<String[]>([]);
    const [breedsList, setBreedsList] = useState<String[]>([]);

    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [selectedSpecies, setSelectedSpecies] = useState<string>("");
    const [selectedBreed, setSelectedBreed] = useState<string>("");

    const navigate = useNavigate();

    const allEmpty = selectedLocation === "" && selectedBreed === "" && selectedSpecies === "";

    const handleAnimalClick = (id: number) => {
        navigate(`/animals/${id}`);
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/locations")
            .then((res) => res.json())
            .then((data) => setLocations(data))
            .catch((err) => console.error("Failed to fetch locations", err));

        fetch("http://localhost:8080/api/animals/species")
            .then((res) => res.json())
            .then((data) => setSpeciesList(data))
            .catch((err) => console.error(err));

        fetch("http://localhost:8080/api/animals/breeds")
            .then((res) => res.json())
            .then((data) => setBreedsList(data))
            .catch((err) => console.error(err));

        if (allEmpty) {
            fetch("http://localhost:8080/api/animals")
                .then((res) => res.json())
                .then((data) => setAnimals(data))
                .catch((err) => console.error("Failed to fetch animals", err));
        } else {
            const queryParams = new URLSearchParams();
            if (selectedLocation) queryParams.append("locationId", selectedLocation);
            if (selectedSpecies) queryParams.append("species", selectedSpecies);
            if (selectedBreed) queryParams.append("breed", selectedBreed);

            fetch(`http://localhost:8080/api/animals/filter?${queryParams.toString()}`)
                .then((res) => {
                    if (res.status === 204) {
                        setAnimals([]);
                        return [];
                    }
                    return res.json();
                })
                .then((data) => {
                    if (Array.isArray(data)) {
                        setAnimals(data);
                    } else {
                        console.warn("Bad response format:", data);
                        setAnimals([]);
                    }
                })
                .catch((err) => console.error("Failed to filter animals", err));
        }
    }, [selectedLocation, selectedSpecies, selectedBreed]);

    return (
        <div className="main-container">
            {/* Header-ul mutat aici */}
            <Header />

            {/* Filtre */}
            <div className="filters-container">
                <select
                    className="filter-dropdown"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                >
                    <option value="">Location</option>
                    {locations.map((loc, idx) => (
                        <option key={idx} value={loc.id}>{loc.city}</option>
                    ))}
                </select>

                <select
                    className="filter-dropdown"
                    value={selectedSpecies}
                    onChange={(e) => setSelectedSpecies(e.target.value)}
                >
                    <option value="">Species</option>
                    {speciesList.map((species, idx) => (
                        <option key={idx} value={species as string}>{species}</option>
                    ))}
                </select>

                <select
                    className="filter-dropdown"
                    value={selectedBreed}
                    onChange={(e) => setSelectedBreed(e.target.value)}
                >
                    <option value="">Breed</option>
                    {breedsList.map((breed, idx) => (
                        <option key={idx} value={breed as string}>{breed}</option>
                    ))}
                </select>
            </div>

            {/* Grid cu animale */}
            <div className="card-grid">
                {animals.map((animal) => (
                    <div
                        key={animal.id}
                        className="animal-card"
                        onClick={() => handleAnimalClick(animal.id)}
                    >
                        <img src={`http://localhost:8080${animal.photoPath}`} alt={animal.name} />
                        <div className="card-info">
                            <strong>{animal.name}</strong>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainPage;
