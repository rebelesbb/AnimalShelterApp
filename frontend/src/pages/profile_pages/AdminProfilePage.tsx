// src/pages/AdminProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import ProfileCard from "../../components/ProfileCard";
import "../../styles/AdminProfilePage.css";
import {toast} from "react-toastify";

type Location = {
    id: number;
    address: string;
    city: string;
    phoneNumber: string;
};

type Admin = {
    name: string;
    username: string;
    phoneNumber: string;
    email: string;
    location: Location;
};

const AdminProfilePage: React.FC = () => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const base64Payload = token.split(".")[1];
        const payload: any = JSON.parse(atob(base64Payload));
        const username: string = payload.sub;

        fetch(`http://localhost:8080/api/employees/${username}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load admin data");
                return res.json() as Promise<Admin>;
            })
            .then((data) => {
                setAdmin(data);
            })
            .catch((err) => {
                console.error(err);
                toast.error(err);
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const goManageEmployees = () => {
        if (!admin) return;
        navigate(`/employees?locationId=${admin.location.id}`);
    };

    return (
        <>
            <Header />
            {admin ? (
                <div className="profile-page">
                    <ProfileCard
                        name={admin.name}
                        username={admin.username}
                        phone={admin.phoneNumber}
                        email={admin.email}
                        onLogout={handleLogout}
                    />

                    <div className="profile-options">
                        <button className="profile-btn" onClick={() => navigate("/manage-adoptions")}>Manage Adoptions</button>
                        <button className="profile-btn" onClick={() => navigate("/animals/manage")}>Manage Animals</button>
                        <button className="profile-btn" onClick={() => navigate("/manage-reports")}>Manage Found Animals</button>
                        <button className="profile-btn" onClick={goManageEmployees}>
                            Manage Employees
                        </button>
                    </div>
                </div>
            ) : (
                <p className="loading-text">Loading admin data…</p>
            )}
        </>
    );
};

export default AdminProfilePage;
