import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import ProfileCard from "../../components/ProfileCard";
import { useNavigate } from "react-router-dom";
import "../../styles/UserProfilePage.css"; // Reuse same styles

type Employee = {
    name: string;
    username: string;
    phoneNumber: string;
    email: string;
};

const EmployeeProfilePage: React.FC = () => {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));
        const username = payload.sub;

        fetch(`http://localhost:8080/api/employees/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Fail");
                return res.json();
            })
            .then((data) => setEmployee(data))
            .catch((err) => console.error("Failed to load employee", err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <Header />
            {employee ? (
                <div className="profile-page">
                    <ProfileCard
                        name={employee.name}
                        username={employee.username}
                        phone={employee.phoneNumber}
                        email={employee.email}
                        onLogout={handleLogout}
                    />

                    <div className="profile-options">
                        <button className="profile-btn">Manage Adoptions</button>
                        <button className="profile-btn">Manage Animals</button>
                        <button className="profile-btn">Manage Found Animals</button>
                    </div>
                </div>
            ) : (
                <p className="loading-text">Loading...</p>
            )}
        </>
    );
};

export default EmployeeProfilePage;
