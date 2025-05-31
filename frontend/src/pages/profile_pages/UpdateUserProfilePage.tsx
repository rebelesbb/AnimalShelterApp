import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import "../../styles/UpdateUserProfilePage.css";

type User = {
    id: number;
    name: string;
    username: string;
    phoneNumber: string;
    email: string;
};

const EditUserProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<User | null>(null);
    const navigate = useNavigate();

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
            navigate("/login");
            return;
        }

        const username = payload.sub;

        fetch(`http://localhost:8080/api/users/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch user");
                return res.json();
            })
            .then((data) => {
                setUser(data);
                setFormData(data);
            })
            .catch(() => {
                toast.error("Could not load user");
                navigate("/");
            });
    }, [navigate]);

    const handleChange = (field: keyof User, value: string) => {
        if (!formData) return;
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData || !user) return;

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:8080/api/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Update failed");
            }

            toast.success("Profile updated successfully");
            navigate("/userprofile");
        } catch (err: any) {
            toast.error(err.message || "Update failed");
        }
    };

    if (!formData) {
        return (
            <>
                <Header />
                <p className="loading-text">Loading profile...</p>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="edit-user-page">
                <h2>Edit Your Profile</h2>
                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            value={formData.phoneNumber}
                            onChange={(e) => handleChange("phoneNumber", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            disabled
                        />
                    </div>
                    <button type="submit" className="submit-btn">Update Profile</button>
                </form>
            </div>
        </>
    );
};

export default EditUserProfilePage;
