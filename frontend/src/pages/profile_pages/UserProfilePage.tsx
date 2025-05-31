import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import ProfileCard from "../../components/ProfileCard";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../styles/UserProfilePage.css";

type User = {
    name: string;
    username: string;
    phoneNumber: string;
    email: string;
};

const UserProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }

        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));
        const username = payload.sub;

        fetch(`http://localhost:8080/api/users/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Fail");
                return res.json();
            })
            .then((data) => setUser(data))
            .catch((err) => console.error("Failed to load user", err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token || !user) return;

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;

        try {
            const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Delete failed");
            }

            toast.success("Account deleted successfully.");
            localStorage.removeItem("token");
            navigate("/");
        } catch (err: any) {
            toast.error(err.message || "Failed to delete account.");
        } finally {
            setModalOpen(false);
        }
    };

    return (
        <>
            <Header />
            {user ? (
                <div className="profile-page">
                    <ProfileCard
                        name={user.name}
                        username={user.username}
                        phone={user.phoneNumber}
                        email={user.email}
                        onLogout={handleLogout}
                    />

                    <div className="profile-options">
                        <button
                            className="profile-btn"
                            onClick={() => navigate('/my-adoptions')}
                        >View Your Adoptions
                        </button>
                        <button
                            className="profile-btn"
                            onClick={() => navigate('/userprofile/update')}
                        >
                            Update Account Details
                        </button>
                        <button
                            className="profile-btn danger"
                            onClick={() => setModalOpen(true)}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            ) : (
                <p className="loading-text">Loading...</p>
            )}

            <ReactModal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                contentLabel="Confirm Delete"
                className="confirm-modal"
                overlayClassName="confirm-modal-overlay"
                ariaHideApp={false}
            >
                <h3>Delete Account</h3>
                <p>Are you sure you want to delete your account?</p>
                <div className="modal-buttons">
                    <button onClick={confirmDelete} className="confirm-btn">
                        Yes
                    </button>
                    <button onClick={() => setModalOpen(false)} className="cancel-btn">
                        Cancel
                    </button>
                </div>
            </ReactModal>
        </>
    );
};

export default UserProfilePage;
