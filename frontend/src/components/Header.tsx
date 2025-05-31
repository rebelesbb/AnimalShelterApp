import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import "../styles/Navbar.css";
import "../styles/ModalStyle.css";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [showReportModal, setShowReportModal] = useState(false);

    const handleProfileClick = () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const role = payload.role;
                console.log('Role:');
                console.log(role);
                if (role === "ADMIN") navigate("/adminprofile");
                else if (role === "EMPLOYEE") navigate("/employeeprofile");
                else navigate("/userprofile");
            } catch {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } else {
            navigate("/login");
            return;
        }
    };

    const handleReportClick = () => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/report/found");
        } else {
            setShowReportModal(true);
        }
    };

    return (
        <>
            <div className="navbar">
                <div className="navbar-left">
                    <img
                        src="/icons/home_icon.png"
                        alt="Home"
                        className="navbar-icon"
                        onClick={() => navigate("/")}
                    />
                    <img
                        src="/icons/flag_icon.png"
                        alt="Flag"
                        className="navbar-icon small-flag"
                        onClick={handleReportClick}
                    />
                </div>

                <div className="navbar-center" onClick={() => navigate("/")} style={{cursor: "pointer"}}>
                    <img src="/nav_img_dog.png" alt="Dog" className="navbar-animal"/>
                    <h1 className="navbar-title">Animal Shelter</h1>
                    <img src="/nav_img_cat.png" alt="Cat" className="navbar-animal"/>
                </div>

                <div className="navbar-right">
                    <img
                        src="/icons/profile_icon.png"
                        alt="Profile"
                        className="navbar-icon"
                        onClick={handleProfileClick}
                    />
                </div>
            </div>

            <ReactModal
                isOpen={showReportModal}
                onRequestClose={() => setShowReportModal(false)}
                contentLabel="Continue Without Account"
                className="confirm-modal"
                overlayClassName="confirm-modal-overlay"
            >
                <h3>Do you have an account or want to create one?</h3>
                <p>You can log in or continue without an account.</p>
                <div className="modal-buttons">
                    <button
                        className="confirm-btn"
                        onClick={() => navigate("/login?redirect=/report/found")}
                    >
                        Yes
                    </button>
                    <button
                        className="cancel-btn"
                        onClick={() => {
                            setShowReportModal(false);
                            navigate("/report/found");
                        }}
                    >
                        Continue without account
                    </button>
                </div>
            </ReactModal>
        </>
    );
};

export default Header;
