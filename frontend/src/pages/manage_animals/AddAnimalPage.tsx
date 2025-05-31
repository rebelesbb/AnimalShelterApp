import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import "../../styles/manage_animals/AddAnimalPage.css";

interface Location {
    id: number;
    city: string;
    address: string;
}

interface Admin {
    username: string;
    role: string;
    location: Location;
}

interface AnimalDto {
    name: string;
    birthDate: string;
    species: string;
    breed: string;
    sex: string;
    size: string;
    weight: number;
    coatType: string;
    temperament: string;
    goodWithKids: boolean;
    goodWithAnimals: boolean;
    specialNeeds: string;
    photo: File | null;
    arrivalDate: string;
    description: string;
    status: string;
    locationId: number;
}

const AddAnimalPage: React.FC = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [form, setForm] = useState<AnimalDto>({
        name: "",
        birthDate: "",
        species: "",
        breed: "",
        sex: "",
        size: "",
        weight: 0,
        coatType: "",
        temperament: "",
        goodWithKids: false,
        goodWithAnimals: false,
        specialNeeds: "",
        photo: null,
        arrivalDate: "",
        description: "",
        status: "AVAILABLE",
        locationId: 0,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        let payload: any;
        try {
            payload = JSON.parse(atob(token.split(".")[1]));
        } catch {
            toast.error("Token invalid");
            navigate("/login");
            return;
        }

        if (payload.role !== "ADMIN" && payload.role !== "EMPLOYEE") {
            toast.error("Access denied");
            navigate("/");
            return;
        }

        const loadAdmin = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/employees/${payload.sub}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to load employee");
                const data: Admin = await res.json();
                setAdmin(data);
                setForm((f) => ({ ...f, locationId: data.location.id }));
            } catch (e: any) {
                toast.error(e.message);
                navigate("/");
            }
        };

        loadAdmin();
    }, [navigate]);

    const handleChange = <K extends keyof AnimalDto>(key: K, value: AnimalDto[K]) => {
        setForm((f: AnimalDto) => ({ ...f, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token || !form.photo) {
            toast.error("Missing token or photo");
            return;
        }

        const formData = new FormData();
        const animalData = {
            ...form,
            location: { id: admin?.location.id }
        };
        delete (animalData as any).photo; // eliminăm fișierul din obiectul JSON

        formData.append("animal", new Blob([JSON.stringify(animalData)], { type: "application/json" }));
        formData.append("image", form.photo);

        try {
            const res = await fetch("http://localhost:8080/api/animals", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                    // NU adăuga "Content-Type", fetch îl setează automat pentru multipart/form-data
                },
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Add failed");
            }

            toast.success("Animal added successfully");
            navigate("/animals/manage");
        } catch (err: any) {
            toast.error(err.message || "Error occurred");
        }
    };

    if (!admin) {
        return (
            <>
                <Header />
                <p className="animal-loading-text">Loading admin...</p>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="add-animal-page">
                <h2>Add Animal at {admin.location.city}</h2>
                <form className="animal-form-container" onSubmit={handleSubmit}>
                    <div className="animal-form-group">
                        <label>Name</label>
                        <input type="text" required value={form.name} onChange={e => handleChange("name", e.target.value)} />
                    </div>
                    <div className="animal-form-group">
                        <label>Birth Date</label>
                        <input type="date" value={form.birthDate} onChange={e => handleChange("birthDate", e.target.value)} />
                    </div>
                    <div className="animal-form-group">
                        <label>Species</label>
                        <input type="text" value={form.species} onChange={e => handleChange("species", e.target.value)} />
                    </div>
                    <div className="animal-form-group">
                        <label>Breed</label>
                        <input type="text" value={form.breed} onChange={e => handleChange("breed", e.target.value)} />
                    </div>
                    <div className="animal-form-group">
                        <label>Sex</label>
                        <select value={form.sex} onChange={e => handleChange("sex", e.target.value)}>
                            <option value="">Select</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                    </div>
                    <div className="animal-form-group">
                        <label>Size</label>
                        <select value={form.size} onChange={e => handleChange("size", e.target.value)}>
                            <option value="">Select</option>
                            <option value="SMALL">Small</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LARGE">Large</option>
                        </select>
                    </div>
                    <div className="animal-form-group">
                        <label>Weight (kg)</label>
                        <input type="number" value={form.weight} onChange={e => handleChange("weight", parseFloat(e.target.value))} />
                    </div>
                    <div className="animal-form-group">
                        <label>Coat Type</label>
                        <select value={form.coatType} onChange={e => handleChange("coatType", e.target.value)}>
                            <option value="">Select</option>
                            <option value="HAIRLESS">Hairless</option>
                            <option value="SHORT">Short</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LONG">Long</option>
                        </select>
                    </div>
                    <div className="animal-form-group">
                        <label>Temperament</label>
                        <select value={form.temperament} onChange={e => handleChange("temperament", e.target.value)}>
                            <option value="">Select</option>
                            <option value="FRIENDLY">Friendly</option>
                            <option value="SHY">Shy</option>
                            <option value="ENERGETIC">Energetic</option>
                            <option value="CALM">Calm</option>
                            <option value="AGGRESSIVE">Aggressive</option>
                        </select>
                    </div>
                    <div className="animal-form-group">
                        <label>Good with Kids</label>
                        <input type="checkbox" checked={form.goodWithKids} onChange={e => handleChange("goodWithKids", e.target.checked)} />
                    </div>
                    <div className="animal-form-group">
                        <label>Good with Other Animals</label>
                        <input type="checkbox" checked={form.goodWithAnimals} onChange={e => handleChange("goodWithAnimals", e.target.checked)} />
                    </div>
                    <div className="animal-form-group">
                        <label>Special Needs</label>
                        <textarea value={form.specialNeeds} onChange={e => handleChange("specialNeeds", e.target.value)} />
                    </div>
                    <div className="animal-form-group">
                        <label>Arrival Date</label>
                        <input type="date" value={form.arrivalDate} onChange={e => handleChange("arrivalDate", e.target.value)} />
                    </div>
                    <div className="animal-form-group">
                        <label>Description</label>
                        <textarea value={form.description} onChange={e => handleChange("description", e.target.value)} />
                    </div>
                    <div className="animal-form-group">
                        <label>Status</label>
                        <select value={form.status} onChange={e => handleChange("status", e.target.value)}>
                            <option value="AVAILABLE">Available</option>
                            <option value="PENDING_ADOPTION">Pending Adoption</option>
                            <option value="UNAVAILABLE">Unavailable</option>
                        </select>
                    </div>
                    <div className="animal-form-group">
                        <label>Photo</label>
                        <input type="file" accept="image/*" onChange={e => handleChange("photo", e.target.files ? e.target.files[0] : null)} />
                    </div>
                    <button type="submit" className="animal-submit-btn">Add Animal</button>
                </form>
            </div>
        </>
    );
};

export default AddAnimalPage;
