import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

interface Animal {
    id: number;
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
    photoPath: string;
    arrivalDate: string;
    description: string;
    status: string;
    location: Location;
}

const EditAnimalPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [admin, setAdmin] = useState<Admin | null>(null);
    const navigate = useNavigate();
    const [form, setForm] = useState<Omit<Animal, 'photoPath' | 'location'> & { photo: File | null; locationId: number }>({
        id: 0,
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
        if (!token || !id) {
            navigate("/login");
            return;
        }

        let payload: any;
        try {
            payload = JSON.parse(atob(token.split(".")[1]));
        } catch {
            toast.error("Invalid token");
            navigate("/login");
            return;
        }

        const fetchAdmin = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/employees/${payload.sub}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to load employee");
                const data: Admin = await res.json();
                setAdmin(data);
            } catch (e: any) {
                toast.error(e.message);
                navigate("/");
            }
        };

        const fetchAnimal = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/animals/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch animal");
                const animal: Animal = await res.json();

                setForm({
                    id: animal.id,
                    name: animal.name,
                    birthDate: animal.birthDate,
                    species: animal.species,
                    breed: animal.breed,
                    sex: animal.sex,
                    size: animal.size,
                    weight: animal.weight,
                    coatType: animal.coatType,
                    temperament: animal.temperament,
                    goodWithKids: animal.goodWithKids,
                    goodWithAnimals: animal.goodWithAnimals,
                    specialNeeds: animal.specialNeeds,
                    photo: null,
                    arrivalDate: animal.arrivalDate,
                    description: animal.description,
                    status: animal.status,
                    locationId: animal.location.id,
                });
            } catch (err: any) {
                toast.error(err.message);
                navigate("/manage-animals");
            }
        };

        fetchAdmin().then(fetchAnimal);
    }, [id, navigate]);

    const handleChange = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token || !id) return;

        const animalData = {
            ...form,
            location: { id: admin?.location.id}
        };
        delete (animalData as any).photo;
        delete (animalData as any).locationId;

        const formData = new FormData();
        formData.append("animal", new Blob([JSON.stringify(animalData)], { type: "application/json" }));
        if (form.photo) {
            formData.append("image", form.photo);
        }

        try {
            const res = await fetch(`http://localhost:8080/api/animals/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Update failed");
            }

            toast.success("Animal updated successfully");
            navigate("/manage-animals");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <>
            <Header />
            <div className="add-animal-page">
                <h2>Edit Animal</h2>
                <form className="animal-form-container" onSubmit={handleSubmit}>
                    <div className="animal-form-group">
                        <label>Name</label>
                        <input type="text" required value={form.name}
                               onChange={e => handleChange("name", e.target.value)}/>
                    </div>
                    <div className="animal-form-group">
                        <label>Birth Date</label>
                        <input type="date" value={form.birthDate}
                               onChange={e => handleChange("birthDate", e.target.value)}/>
                    </div>
                    <div className="animal-form-group">
                        <label>Species</label>
                        <input type="text" value={form.species}
                               onChange={e => handleChange("species", e.target.value)}/>
                    </div>
                    <div className="animal-form-group">
                        <label>Breed</label>
                        <input type="text" value={form.breed} onChange={e => handleChange("breed", e.target.value)}/>
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
                        <input type="number" value={form.weight}
                               onChange={e => handleChange("weight", parseFloat(e.target.value))}/>
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
                        <input type="checkbox" checked={form.goodWithKids}
                               onChange={e => handleChange("goodWithKids", e.target.checked)}/>
                    </div>
                    <div className="animal-form-group">
                        <label>Good with Other Animals</label>
                        <input type="checkbox" checked={form.goodWithAnimals}
                               onChange={e => handleChange("goodWithAnimals", e.target.checked)}/>
                    </div>
                    <div className="animal-form-group">
                        <label>Special Needs</label>
                        <textarea value={form.specialNeeds}
                                  onChange={e => handleChange("specialNeeds", e.target.value)}/>
                    </div>
                    <div className="animal-form-group">
                        <label>Arrival Date</label>
                        <input type="date" value={form.arrivalDate}
                               onChange={e => handleChange("arrivalDate", e.target.value)}/>
                    </div>
                    <div className="animal-form-group">
                        <label>Description</label>
                        <textarea value={form.description} onChange={e => handleChange("description", e.target.value)}/>
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
                        <input type="file" accept="image/*"
                               onChange={e => handleChange("photo", e.target.files ? e.target.files[0] : null)}/>
                    </div>
                    <button type="submit" className="animal-submit-btn">Save Changes</button>
                </form>
            </div>
        </>
    );
};

export default EditAnimalPage;
