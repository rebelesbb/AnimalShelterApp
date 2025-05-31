import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import "../../styles/manage_adoptions/AdoptAnimalPage.css";
import ReactModal from "react-modal";
import { toast } from "react-toastify";

type Animal = {
    id: number;
    name: string;
    photoPath: string;
};

type Person = {
    id: number;
    name: string;
    phoneNumber: string;
};

const AdoptAnimalPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [animal, setAnimal] = useState<Animal | null>(null);
    const [person, setPerson] = useState<Person | null>(null);
    const [details, setDetails] = useState("");
    const [pickupDate, setPickupDate] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8080/api/animals/${id}`)
            .then(res => res.json())
            .then(setAnimal);

        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const personId = payload.id;
                fetch(`http://localhost:8080/api/contacts/${personId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .then(res => res.ok ? res.json() : null)
                    .then(setPerson)
                    .catch(() => {});
            } catch {
                // fallback
            }
        }
    }, [id]);

    useEffect(() => {
        if (person) {
            setName(person.name);
            setPhone(person.phoneNumber);
        }
    }, [person]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!details.trim()) {
            toast.error("Please provide adoption details.");
            return;
        }

        if (!pickupDate) {
            toast.error("Please select a pickup date.");
            return;
        }

        const token = localStorage.getItem("token");

        const body: any = {
            animalId: id,
            details,
            pickupDate,
            person: person || { id: -1, name: name, phoneNumber: phone }
        };

        const res = await fetch("http://localhost:8080/api/adoptions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            setShowSuccessModal(true);
        } else {
            const errorText = await res.text();
            toast.error(errorText || "Adoption failed.");
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate("/");
    };

    if (!animal) return <p>Loading...</p>;

    return (
        <>
            <Header />
            <div className="adopt-container">
                <div className="adopt-animal-info">
                    <img src={`http://localhost:8080${animal.photoPath}`} alt={animal.name} />
                    <h2>{animal.name}</h2>
                </div>

                <form className="adopt-form" onSubmit={handleSubmit}>
                    {!person && (
                        <>
                            <label>Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} required />

                            <label>Phone Number</label>
                            <input value={phone} onChange={e => setPhone(e.target.value)} required />
                        </>
                    )}

                    <label>Pickup Date</label>
                    <input
                        type="date"
                        value={pickupDate}
                        onChange={e => setPickupDate(e.target.value)}
                        required
                    />

                    <label>Details</label>
                    <textarea value={details} onChange={e => setDetails(e.target.value)} required />

                    <button type="submit" className="adopt-submit-btn">Send Request</button>
                </form>
            </div>

            <ReactModal
                isOpen={showSuccessModal}
                onRequestClose={handleModalClose}
                className="confirm-modal"
                overlayClassName="confirm-modal-overlay"
            >
                <h3>Adoption Request Submitted</h3>
                <p>Your adoption request was sent successfully!</p>
                <div className="modal-buttons">
                    <button className="cancel-btn" onClick={handleModalClose}>OK</button>
                </div>
            </ReactModal>
        </>
    );
};

export default AdoptAnimalPage;
