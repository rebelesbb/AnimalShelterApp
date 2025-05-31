// src/pages/ManageEmployeesPage.tsx
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/manage_employees/ManageEmployeesPage.css";

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
    role: string;
};

type Employee = {
    id: number;
    name: string;
    username: string;
    phoneNumber: string;
    email: string;
};

const ManageEmployeesPage: React.FC = () => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
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
            toast.error("Invalid token");
            navigate("/login");
            return;
        }

        if (payload.role !== "ADMIN") {
            toast.error("Access denied");
            navigate("/");
            return;
        }

        const username: string = payload.sub;

        // 1) fetch admin details (to get location)
        fetch(`http://localhost:8080/api/employees/${username}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load admin data");
                return res.json() as Promise<Admin>;
            })
            .then((data) => {
                setAdmin(data);
                // 2) fetch employees at same location
                return fetch(
                    `http://localhost:8080/api/employees?locationId=${data.location.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            })
            .then((res) => {
                if (!res!.ok) throw new Error("Failed to fetch employees");
                return res!.json() as Promise<Employee[]>;
            })
            .then((list) => setEmployees(list))
            .catch((err) => toast.error(err.message));
    }, [navigate]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this employee?"))
            return;
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/employees/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`! },
        });
        if (res.ok) {
            setEmployees((prev) => prev.filter((e) => e.id !== id));
            toast.success("Employee deleted");
        } else {
            toast.error("Delete failed");
        }
    };

    const handleModify = (id: number) => {
        navigate(`/employees/edit/${id}`);
    };

    const handleAdd = () => {
        navigate("/employees/add");
    };

    if (!admin) {
        return (
            <>
                <Header />
                <p className="loading-text">Loading...</p>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="manage-employees-page">
                <div className="header-row">
                    <h2>Manage Employees at {admin.location.city}</h2>
                    <button className="add-btn" onClick={handleAdd}>
                        + Add Employee
                    </button>
                </div>
                <div className="employees-list">
                    {employees.map((emp) => (
                        <div key={emp.id} className="employee-card">
                            <div className="emp-info">
                                <p className="emp-name">{emp.name}</p>
                                <p className="emp-username">@{emp.username}</p>
                                <p className="emp-contact">
                                    {emp.email} • {emp.phoneNumber}
                                </p>
                            </div>
                            <div className="actions">
                                <button
                                    className="modify-btn"
                                    onClick={() => handleModify(emp.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(emp.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ManageEmployeesPage;
