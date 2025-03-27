"use client"
import { useEffect, useState } from 'react';

export default function Page() {
    const [userInfo, setUserInfo] = useState({ isLoggedIn: false, status: '' });
    const [showLogoutConfirmPopup, setShowLogoutConfirmPopup] = useState(false);

    useEffect(() => {
        const userCookie = document.cookie.split("; ").find((row) => row.startsWith("user="));
        if (userCookie) {
            const userValue = decodeURIComponent(userCookie.split('=')[1]);
            const user = JSON.parse(userValue);
            setUserInfo({ isLoggedIn: true, status: user.status });
        }
    }, []);

    const handleLogout = () => {
        setShowLogoutConfirmPopup(true);
    };

    const handleConfirmLogout = () => {
        document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = '/';
    };

    const handleCancelLogout = () => {
        setShowLogoutConfirmPopup(false);
    };

    return (
        <div>
            <div className="slide-entreprises-container">
                <div className="title-container">
                    <p className="paragraphe">Bienvenue sur votre </p>
                    <h1 className="title">dashboard</h1>
                    </div>
                <button className="create-offer-button" onClick={handleLogout}>
                    <span className="button-text">Déconnexion</span>
                    <span className="button-icon">+</span>
                </button>
                <div className="container-dashboard">
                    <div className="grid">
                        <div className="item">
                            
                        </div>
                        <div className="item"></div>
                        <div className="item"></div>
                        <div className="item"></div>
                        <div className="item"></div>
                    </div>
                </div>
            </div>
            {showLogoutConfirmPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                        <button onClick={handleConfirmLogout}>Oui</button>
                        <button onClick={handleCancelLogout}>Non</button>
                    </div>
                </div>
            )}
            
            <img className="assets" src="/Assets/separateur-w2b.png"/>
        </div>
    );
}