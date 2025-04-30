import React, { useState } from "react";
import "../styles/SignupPage.css";
import Header from "../components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match.");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    phoneNumber: formData.phoneNumber,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            if (!res.ok) {
                const error = await res.text();
                toast.error(`Error: ${error}`);
                return;
            }

            toast.success("Account successfully created!");
            navigate("/login");
        } catch (err) {
            console.error(err);
            toast.error("Signup error.");
        }
    };

    return (
        <>
            <Header />
            <div className="signup-wrapper">
                <div className="signup-box">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSignup} className="signup-form">
                        <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
                        <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                        <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
                        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                        <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                        <Input label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
                        <button type="submit" className="signup-btn">Sign up</button>
                    </form>
                    <p className="signup-footer">
                        Already have an account? <a href="/login">Log in!</a>
                    </p>
                </div>

                <div className="signup-motto">
                    <img src="/login_dog.png" alt="dog" className="signup-dog" />
                    <h1>Every Paw<br />Deserves a<br />Home.</h1>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

type InputProps = {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputProps> = ({ label, name, type = "text", value, onChange }) => (
    <div className="input-group">
        <label className="input-label">
            {label} <span className="required">*</span>
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="signup-input"
            required
        />
    </div>
);

export default SignupPage;
