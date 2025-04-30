import React from "react";
import "../styles/ProfileCard.css";

interface ProfileCardProps {
    name: string;
    username: string;
    phone: string;
    email: string;
    onLogout: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
                                                     name,
                                                     username,
                                                     phone,
                                                     email,
                                                     onLogout,
                                                 }) => {
    return (
        <div className="profile-card">
            <img src="/user_profile_cat.png" alt="Cat" className="cat-icon" />

            <h2>{name}</h2>

            <p><strong>Username</strong><br />{username}</p>
            <p><strong>Phone</strong><br />{phone}</p>
            <p><strong>Email</strong><br />{email}</p>

            <button className="logout-button" onClick={onLogout}>Log out</button>

            <img src="/user_profile_dog.png" alt="Dog" className="dog-icon" />
        </div>
    );
};

export default ProfileCard;
