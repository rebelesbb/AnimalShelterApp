import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    password: string;       // new password; blank = keep old
    email?: string;
    hireDate: string;       // ISO date, e.g. "2025-05-01"
    salary: number;
    role: "ADMIN" | "EMPLOYEE";
    locationId: number;
};

const EditEmployeePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const empId = Number(id);
    const navigate = useNavigate();

    const [admin, setAdmin] = useState<Admin | null>(null);
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

        const loadData = async () => {
            try {
                // 1) load admin to get location
                const resAdm = await fetch(
                    `http://localhost:8080/api/employees/${payload.sub}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!resAdm.ok) throw new Error("Failed to load admin");
                const adm: Admin = await resAdm.json();
                setAdmin(adm);

                // 2) load employee details by id
                const resEmp = await fetch(
                    `http://localhost:8080/api/employees/id/${empId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!resEmp.ok) throw new Error("Failed to load employee");
                const empData: any = await resEmp.json();

                setForm({
                    name: empData.name,
                    phoneNumber: empData.phoneNumber,
                    username: empData.username,
                    password: "",                 // leave blank
                    email: empData.email,
                    hireDate: empData.hireDate,
                    salary: empData.salary,
                    role: empData.role,
                    locationId: adm.location.id,  // keep admin's location
                });
            } catch (e: any) {
                toast.error(e.message);
                navigate("/employees");
            }
        };

        loadData();
    }, [empId, navigate]);

    const handleChange = <K extends keyof EmployeeDto>(
        key: K,
        value: EmployeeDto[K]
    ) => {
        setForm(f => ({ ...f, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!admin) return;

        const token = localStorage.getItem("token");
        const res = await fetch(
            `http://localhost:8080/api/employees/${empId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            }
        );
        if (!res.ok) {
            const text = await res.text();
            return toast.error(text || "Update failed");
        }
        toast.success("Employee updated");
        navigate(`/employees?locationId=${form.locationId}`);
    };

    if (!admin) {
        return (
            <>
                <Header />
                <p className="loading-text">Loading admin...</p>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="add-employee-page">
                <h2>Edit Employee at {admin.location.city}</h2>
                <form className="form-container" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={e => handleChange("name", e.target.value)}
                        />
                    </div>
                    {/* Phone Number */}
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            required
                            value={form.phoneNumber}
                            onChange={e =>
                                handleChange("phoneNumber", e.target.value)
                            }
                        />
                    </div>
                    {/* Username (read-only) */}
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={form.username} disabled />
                    </div>
                    {/* Password */}
                    <div className="form-group">
                        <label>New Password (leave blank to keep old)</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={e =>
                                handleChange("password", e.target.value)
                            }
                        />
                    </div>
                    {/* Email */}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={form.email || ""}
                            onChange={e =>
                                handleChange("email", e.target.value)
                            }
                        />
                    </div>
                    {/* Hire Date */}
                    <div className="form-group">
                        <label>Hire Date</label>
                        <input
                            type="date"
                            required
                            value={form.hireDate}
                            onChange={e =>
                                handleChange("hireDate", e.target.value)
                            }
                        />
                    </div>
                    {/* Salary */}
                    <div className="form-group">
                        <label>Salary</label>
                        <input
                            type="number"
                            required
                            value={form.salary}
                            onChange={e =>
                                handleChange("salary", Number(e.target.value))
                            }
                        />
                    </div>
                    {/* Role */}
                    <div className="form-group">
                        <label>Role</label>
                        <select
                            required
                            value={form.role}
                            onChange={e =>
                                handleChange("role", e.target.value as any)
                            }
                        >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-btn">
                        Save Changes
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditEmployeePage;
