import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="navbar">
            <div className="navbar-left">
                <img src="/icons/home_icon.png" alt="Home" className="navbar-icon" onClick={() => navigate("/")} />
                <img src="/icons/flag_icon.png" alt="Flag" className="navbar-icon small-flag" />
            </div>

            <div className="navbar-center">
                <img src="/nav_img_dog.png" alt="Dog" className="navbar-animal" />
                <h1 className="navbar-title">Animal Shelter</h1>
                <img src="/nav_img_cat.png" alt="Cat" className="navbar-animal" />
            </div>

            <div className="navbar-right">
                <img
                    src="/icons/profile_icon.png" alt="Profile" className="navbar-icon"
                    onClick={() => navigate('/login')}
                />
            </div>
        </div>
    );
};

export default Header;
