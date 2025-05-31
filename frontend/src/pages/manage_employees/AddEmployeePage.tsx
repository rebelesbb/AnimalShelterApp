import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import "../../styles/manage_employees/AddEmployeePage.css";

type Location = {
    id: number;
    address: string;
    city: string;
};

type Admin = {
    username: string;
    role: string;
    location: Location;
};

type EmployeeDto = {
    name: string;
    phoneNumber: string;
    username: string;
    password: string;
    email?: string;
    hireDate: string;
    salary: number;
    role: "ADMIN"|"EMPLOYEE";
    locationId: number;
};

const AddEmployeePage: React.FC = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<Admin|null>(null);
    const [form, setForm] = useState<EmployeeDto>({
        name: "",
        phoneNumber: "",
        username: "",
        password: "",
        email: "",
        hireDate: "",
        salary: 0,
        role: "EMPLOYEE",
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
        if (payload.role !== "ADMIN") {
            toast.error("Access denied");
            navigate("/");
            return;
        }

        const loadAdminAndLocations = async () => {
            try {
                // 1) admin details
                const res1 = await fetch(
                    `http://localhost:8080/api/employees/${payload.sub}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res1.ok) throw new Error("Failed to load admin");
                const adm: Admin = await res1.json();
                setAdmin(adm);
                setForm(f => ({ ...f, locationId: adm.location.id }));
            } catch (e: any) {
                toast.error(e.message || "Error loading data");
                navigate("/employees");
            }
        };

        loadAdminAndLocations();
    }, [navigate]);


    const handleChange = <K extends keyof EmployeeDto>(k: K, v: EmployeeDto[K]) => {
        setForm(f => ({ ...f, [k]: v }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!admin) return;

        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/employees", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form),
        });
        if (!res.ok) {
            const text = await res.text();
            return toast.error(text || "Create failed");
        }
        toast.success("Employee added");
        navigate(`/employees?locationId=${form.locationId}`);
    };

    if (!admin) {
        return <>
            <Header />
            <p className="loading-text">Loading admin...</p>
        </>;
    }

    return (
        <>
            <Header />
            <div className="add-employee-page">
                <h2>Add New Employee at {admin.location.city}</h2>
                <form className="form-container" onSubmit={handleSubmit}>
                    {/* NUME */}
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={e => handleChange("name", e.target.value)}
                        />
                    </div>

                    {/* PHONE */}
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            required
                            value={form.phoneNumber}
                            onChange={e => handleChange("phoneNumber", e.target.value)}
                        />
                    </div>

                    {/* USERNAME */}
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            required
                            value={form.username}
                            onChange={e => handleChange("username", e.target.value)}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={form.password}
                            onChange={e => handleChange("password", e.target.value)}
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={form.email||""}
                            onChange={e => handleChange("email", e.target.value)}
                        />
                    </div>

                    {/* HIRE DATE */}
                    <div className="form-group">
                        <label>Hire Date</label>
                        <input
                            type="date"
                            required
                            value={form.hireDate}
                            onChange={e => handleChange("hireDate", e.target.value)}
                        />
                    </div>

                    {/* SALARY */}
                    <div className="form-group">
                        <label>Salary</label>
                        <input
                            type="number"
                            required
                            value={form.salary}
                            onChange={e => handleChange("salary", Number(e.target.value))}
                        />
                    </div>

                    {/* ROLE */}
                    <div className="form-group">
                        <label>Role</label>
                        <select
                            value={form.role}
                            required
                            onChange={e => handleChange("role", e.target.value as any)}
                        >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-btn">
                        Add Employee
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddEmployeePage;
