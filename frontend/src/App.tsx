import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import AnimalDetailsPage from "./pages/AnimalDetailsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserProfilePage from "./pages/UserProfilePage";
import EmployeeProfilePage from "./pages/EmployeeProfilePage";
import "./App.css";

const App: React.FC = () => {
    return (
        <div>
        <Router>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/animals/:id" element={<AnimalDetailsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/userprofile" element={<UserProfilePage/>} />
                    <Route path="/employeeprofile" element={<EmployeeProfilePage/>} />
                </Routes>
        </Router>
        </div>
    );
};

export default App;
