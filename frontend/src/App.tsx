import React from "react";
import ReactModal from "react-modal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import AnimalDetailsPage from "./pages/AnimalDetailsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserProfilePage from "./pages/profile_pages/UserProfilePage";
import EmployeeProfilePage from "./pages/profile_pages/EmployeeProfilePage";
import AdminProfilePage from "./pages/profile_pages/AdminProfilePage";
import ManageEmployeesPage from "./pages/manage_employees/ManageEmployeesPage";
import AddEmployeePage from "./pages/manage_employees/AddEmployeePage";
import EditEmployeePage from "./pages/manage_employees/EditEmployeesPage";
import ManageAnimalsPage from "./pages/manage_animals/ManageAnimalsPage";
import AddAnimalPage from "./pages/manage_animals/AddAnimalPage";
import EditAnimalPage from "./pages/manage_animals/EditAnimalPage";
import AdoptAnimalPage from "./pages/manage_adoptions/AdoptAnimalPage";
import ReportFoundAnimalPage from "./pages/manage_reports/ReportFoundAnimalPage";
import MyAdoptionsPage from "./pages/manage_adoptions/MyAdoptionsPage";
import ManageAdoptionsPage from "./pages/manage_adoptions/ManageAdoptionsPage";
import ManageReportsPage from "./pages/manage_reports/ManageReportsPage";
import UpdateUserProfilePage from "./pages/profile_pages/UpdateUserProfilePage";
import "./App.css";

ReactModal.setAppElement("#root");

const App: React.FC = () => {
    return (
        <div>
        <Router>
                <Routes>
                    <Route path="/" element={<MainPage/>} />
                    <Route path="/animals/:id" element={<AnimalDetailsPage/>} />
                    <Route path="/login" element={<LoginPage/>} />
                    <Route path="/signup" element={<SignupPage/>} />
                    <Route path="/userprofile" element={<UserProfilePage/>} />
                    <Route path="/employeeprofile" element={<EmployeeProfilePage/>} />
                    <Route path="/adminprofile" element={<AdminProfilePage/>} />
                    <Route path="/employees" element={<ManageEmployeesPage/>} />
                    <Route path="/employees/add" element={<AddEmployeePage/>} />
                    <Route path="/employees/edit/:id" element={<EditEmployeePage/>} />
                    <Route path="/animals/manage" element={<ManageAnimalsPage/>} />
                    <Route path="/animals/manage/add" element={<AddAnimalPage/>} />
                    <Route path="/animals/manage/edit/:id" element={<EditAnimalPage/>} />
                    <Route path="/animals/adopt/:id" element={<AdoptAnimalPage/>} />
                    <Route path="/report/found" element={<ReportFoundAnimalPage/>} />
                    <Route path="/my-adoptions" element={<MyAdoptionsPage />} />
                    <Route path="/manage-adoptions" element={<ManageAdoptionsPage/>} />
                    <Route path="/manage-reports" element={<ManageReportsPage/>} />
                    <Route path="/userprofile/update" element={<UpdateUserProfilePage/>} />
                </Routes>
        </Router>
        </div>
    );
};

export default App;
