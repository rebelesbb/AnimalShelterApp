import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "../../styles/manage_reports/ReportFoundAnimalPage.css";
import ReactModal from "react-modal";

interface PersonDto {
    id: number;
    name: string;
    phoneNumber: string;
}

interface AnimalReportRequestDto {
    details: string;
    location: string;
    person: PersonDto;
}

const ReportFoundAnimalPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AnimalReportRequestDto>({
        details: "",
        location: "",
        person: {
            id: -1,
            name: "",
            phoneNumber: "",
        },
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const personId = payload.id;
                setIsLoggedIn(true);

                fetch(`http://localhost:8080/api/contacts/${personId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then(res => res.ok ? res.json() : null)
                    .then(data => {
                        if (data) {
                            setFormData(prev => ({
                                ...prev,
                                person: {
                                    id: data.id,
                                    name: data.name,
                                    phoneNumber: data.phoneNumber,
                                }
                            }));
                        }
                    })
                    .catch(() => {});
            } catch {
                setIsLoggedIn(false);
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "name" || name === "phoneNumber") {
            setFormData(prev => ({
                ...prev,
                person: {
                    ...prev.person,
                    [name]: value,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8080/api/reports/found", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setShowSuccessModal(true); // afișăm modalul
        } else {
            alert("Failed to submit report.");
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        navigate("/");
    };

    return (
        <>
            <Header />
            <div className="form-page-container">
                <div className="form-card">
                    <h2 className="form-title">Report Found Animal</h2>
                    <form onSubmit={handleSubmit} className="form">
                        {!isLoggedIn && (
                            <>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.person.name}
                                    onChange={handleChange}
                                    required
                                />

                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.person.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </>
                        )}

                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="details">Details</label>
                        <textarea
                            id="details"
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit" className="submit-button">Submit Report</button>
                    </form>
                </div>
            </div>

            <ReactModal
                isOpen={showSuccessModal}
                onRequestClose={handleSuccessClose}
                className="confirm-modal"
                overlayClassName="confirm-modal-overlay"
            >
                <h3>Report Submitted</h3>
                <p>Your report has been successfully submitted.</p>
                <div className="modal-buttons">
                    <button className="cancel-btn" onClick={handleSuccessClose}>OK</button>
                </div>
            </ReactModal>
        </>
    );
};

export default ReportFoundAnimalPage;
