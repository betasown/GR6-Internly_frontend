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

    if (!userInfo.isLoggedIn) {
        return (
            <div>
                <div className="slide-entreprises-container">
                    <div className="title-container">
                    
                        <center><img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2NtMHF1ZnBieHBic3M1cHpyZWlubDVxYjZ6bHd4NmtrMzYxM3I0ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Ll22OhMLAlVDb8UQWe/giphy.gif" width="190" height="220"/></center>
                        <h1 className="title">Erreur 403</h1>
                        <p className='paragraphe'>Accès refusé</p>
                        <p className='paragraphe'>Vous devez être connecté pour accéder à cette page</p>
                    </div>
                </div>
                <img className="assets" src="/Assets/separateur-w2b.png"/>
            </div>
        );
    }

    return (
        <div>
            <div className="slide-entreprises-container">
                <div className="title-container">
                    <h1 className="title">dashboard</h1>
                    <p className='paragraphe'>Statut: {userInfo.status}</p>
                </div>
            </div>
            <button className="create-offer-button" onClick={handleLogout}>
                <span className="button-text">Déconnexion</span>
                <span className="button-icon">+</span>
            </button>
            {showLogoutConfirmPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                        <button onClick={handleConfirmLogout}>Oui</button>
                        <button onClick={handleCancelLogout}>Non</button>
                    </div>
                </div>
            )}
            <div className="container-dashboard">
                <div className="grid">
                    <div className="item"></div>
                    <div className="item"></div>
                    <div className="item"></div>
                    <div className="item"></div>
                    <div className="item"></div>
                </div>
            </div>
            <img className="assets" src="/Assets/separateur-w2b.png"/>
        </div>
    );
}