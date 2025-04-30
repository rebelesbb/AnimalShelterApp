import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import { useNavigate } from "react-router-dom";
import "../styles/UserProfilePage.css";

type User = {
    name: string;
    username: string;
    phoneNumber: string;
    email: string;
};

const UserProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));
        const username = payload.sub;

        fetch(`http://localhost:8080/api/users/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Fail");
                return res.json();
            })
            .then((data) => setUser(data))
            .catch((err) => console.error("Failed to load user", err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <Header />
            {user ? (
                <div className="profile-page">
                    <ProfileCard
                        name={user.name}
                        username={user.username}
                        phone={user.phoneNumber}
                        email={user.email}
                        onLogout={handleLogout}
                    />

                    <div className="profile-options">
                        <button className="profile-btn">View Your Adoptions</button>
                        <button className="profile-btn">Update Account Details</button>
                        <button className="profile-btn danger">Delete Account</button>
                    </div>
                </div>
            ) : (
                <p className="loading-text">Loading...</p>
            )}
        </>
    );
};

export default UserProfilePage;
