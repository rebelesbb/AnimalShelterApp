import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/LoginPage.css";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get("redirect");

    const signupLink = redirectPath
        ? `/signup?redirect=${encodeURIComponent(redirectPath)}`
        : "/signup";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (res.status === 401) {
                toast.error("Incorrect username or password.");
                return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);

            const base64Payload = data.token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            const role = payload.role;



            if (redirectPath) {
                navigate(redirectPath);
            } else {
                const roleToRoute: Record<string, string> = {
                    ADMIN: "/adminprofile",
                    EMPLOYEE: "/employeeprofile",
                    USER: "/userprofile",
                };
                const route = roleToRoute[role] || "/userprofile";
                navigate(route);
            }

        } catch (err) {
            toast.error("Error: " + err);
        }
    };

    return (
        <>
            <Header />
            <div className="login-wrapper">
                <div className="login-box">
                    <h2>Welcome!</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="username"
                            className="login-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="password"
                            className="login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="login-btn">Log in</button>
                    </form>
                    <p className="login-footer">
                        Don’t have an account? <a href={signupLink}>Sign up!</a>
                    </p>
                </div>

                <div className="login-motto">
                    <img src="/login_dog.png" alt="dog" className="login-dog" />
                    <h1>Every Paw<br />Deserves a<br />Home.</h1>
                </div>
            </div>
            <ToastContainer/>
        </>
    );
};

export default LoginPage;
