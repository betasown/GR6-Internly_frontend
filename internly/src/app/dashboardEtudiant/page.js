"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importer le hook useRouter pour la redirection
import { X } from "lucide-react";

const formatDate = (dateString) => {
    return dateString.split(' ')[0]; // Séparer la date et l'heure, et retourner uniquement la date
};

export default function Page() {
    const [userInfo, setUserInfo] = useState({ isLoggedIn: false, status: '', id: null, prenom: '' });
    const [candidatures, setCandidatures] = useState([]);
    const [candidatureStats, setCandidatureStats] = useState([]);
    const [showLogoutConfirmPopup, setShowLogoutConfirmPopup] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Nombre d'éléments par page
    const router = useRouter(); // Initialiser le hook useRouter
    const [selectedMotivationLetter, setSelectedMotivationLetter] = useState(null); // État pour stocker la lettre de motivation sélectionnée
    const handleViewMotivationLetter = (letter) => {
        setSelectedMotivationLetter(letter);
    };

    // Calcul des éléments de la page actuelle
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = wishlist.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(wishlist.length / itemsPerPage);

    useEffect(() => {
        const userCookie = document.cookie.split("; ").find((row) => row.startsWith("user="));
        if (userCookie) {
            const userValue = decodeURIComponent(userCookie.split('=')[1]);
            const user = JSON.parse(userValue);

            // Vérification du statut de l'utilisateur
            if (user.status !== "etudiant") {
                router.push('/403'); // Rediriger vers une page 403 si l'utilisateur n'est pas un étudiant
                return;
            }

            setUserInfo({ isLoggedIn: true, status: user.status, id: user.id });

            // Récupération du prénom de l'utilisateur
            fetch(`http://localhost:8000/index.php?route=user_firstname&id=${user.id}&field=prenom`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.utilisateur_prenom) {
                        setUserInfo((prev) => ({ ...prev, prenom: data.utilisateur_prenom }));
                    }
                })
                .catch(error => console.error('Error fetching user first name:', error));

            // Fetch wishlist based on user ID
            fetch(`http://localhost:8000/index.php?route=wishlist&user_id=${user.id}`)
                .then(response => response.json())
                .then(data => setWishlist(data))
                .catch(error => console.error('Error fetching wishlist:', error));

            // Fetch candidatures based on user ID
            fetch(`http://localhost:8000/index.php?route=candidatures_by_user&user_id=${user.id}`)
                .then(response => response.json())
                .then(data => setCandidatures(data))
                .catch(error => console.error('Error fetching candidatures:', error));

            // Fetch candidature stats
            fetch(`http://localhost:8000/index.php?route=candidatures&user_id=${user.id}&count=status`)
                .then(response => response.json())
                .then(data => setCandidatureStats(data))
                .catch(error => console.error('Error fetching candidature stats:', error));
        } else {
            router.push('/403'); // Rediriger vers une page 403 si aucun cookie utilisateur n'est trouvé
        }
    }, [router]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

    const handleRemoveFromWishlist = async (index) => {
        const offreId = wishlist[index].offre_id; // Récupérer l'ID de l'offre
        const userId = userInfo.id; // Récupérer l'ID de l'utilisateur
    
        try {
            const response = await fetch('http://localhost:8000/index.php?route=remove_from_wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    offre_id: offreId,
                    utilisateur_id: userId,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
    
            // Supprimer l'élément de la wishlist localement après une requête réussie
            const updatedWishlist = [...wishlist];
            updatedWishlist.splice(index, 1);
            setWishlist(updatedWishlist);
        } catch (error) {
            console.error('Erreur lors de la suppression de la wishlist :', error);
        }
    };

    const [currentCandidaturePage, setCurrentCandidaturePage] = useState(1);
    const candidaturesPerPage = 4; // Nombre d'éléments par page pour les candidatures

    const indexOfLastCandidature = currentCandidaturePage * candidaturesPerPage;
    const indexOfFirstCandidature = indexOfLastCandidature - candidaturesPerPage;
    const currentCandidatures = candidatures.slice(indexOfFirstCandidature, indexOfLastCandidature);

    const totalCandidaturePages = Math.ceil(candidatures.length / candidaturesPerPage);

    const paginateCandidatures = (pageNumber) => setCurrentCandidaturePage(pageNumber);

    return (
        <div>
            <div className="slide-entreprises-container">
                <div className="title-container">
                    <h1 className="title">Bienvenue {userInfo.prenom} !</h1>
                </div>
                <button className="create-offer-button" onClick={handleLogout}>
                    <span className="button-text">Déconnexion</span>
                    <span className="button-icon">+</span>
                </button>
                <div className="container-dashboard">
                    <div className="grid">
                        <div className="item">
                            {/* Tableau des candidatures */}
                            <div className="title-container">
                                <h1 className="title">Candidatures</h1>
                            </div>
                            {currentCandidatures.length > 0 ? (
                                <table className="offer-table">
                                <thead>
                                    <tr>
                                        <th>Offre</th>
                                        <th>Entreprise</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th> {/* Nouvelle colonne pour le bouton */}
                                    </tr>
                                </thead>
                                <tbody>
                                {currentCandidatures.map((candidature, index) => (
                                    <tr key={index}>
                                        <td>{candidature.offre_titre}</td>
                                        <td>{candidature.entreprise_nom}</td>
                                        <td>{formatDate(candidature.candidature_date)}</td>
                                        <td>
                                            <button 
                                                className="view-button" 
                                                onClick={() => handleViewMotivationLetter(candidature.candidature_lm)}
                                            >
                                                Lettre de motivation
                                            </button>
                                        </td>
                                        <td>
                                            <span 
                                                className={`status-pill ${
                                                    candidature.candidature_status === "refusée" ? "refusee" :
                                                    candidature.candidature_status === "en_attente" ? "en-attente" :
                                                    "acceptee"
                                                }`}
                                            >
                                                {candidature.candidature_status === "en_attente" 
                                                    ? "en attente" 
                                                    : candidature.candidature_status}
                                            </span>
                                        </td>
                                        
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            ) : (
                                <p>Aucune candidature trouvée.</p>
                            )}
                            {/* Pagination for candidatures */}
                            <div className="pagination">
                                <button onClick={() => paginateCandidatures(1)} disabled={currentCandidaturePage === 1}>&laquo;</button>
                                {Array.from({ length: totalCandidaturePages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginateCandidatures(index + 1)}
                                        className={currentCandidaturePage === index + 1 ? 'active' : ''}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button onClick={() => paginateCandidatures(totalCandidaturePages)} disabled={currentCandidaturePage === totalCandidaturePages}>&raquo;</button>
                            </div>
                        </div>
                        <div className="item">
                            
                            <div className="title-container">
                                <h1 className="title">wishList</h1>
                            </div> 
                            {currentItems.length > 0 ? (
                                <ul className="wishlist">
                                    {currentItems.map((item, index) => (
                                        <li key={index} className="wishlist-itemm">
                                            <div className="wishlist-details">
                                                <strong>{item.entreprise_nom}</strong> - {item.offre_nom} 
                                            </div>
                                            <button 
                                                className="remove-button" 
                                                onClick={() => handleRemoveFromWishlist(index + indexOfFirstItem)}
                                            >
                                                Supprimer
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <center><p>Aucune offres trouvée.</p></center>
                            )}
                            {/* Pagination */}
                            <div className="pagination">
                                <button onClick={() => paginate(1)} disabled={currentPage === 1}>&laquo;</button>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginate(index + 1)}
                                        className={currentPage === index + 1 ? 'active' : ''}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>&raquo;</button>
                            </div>
                        </div>
                        {/* Div pour les statistiques des candidatures */}
                        <div className="item">
                            <div className="info-card">
                                <h1 className="title">{candidatureStats.find(stat => stat.candidature_status === "en_attente")?.count || 0} En attente</h1>
                            </div>
                        </div>

                        {/* Div pour les candidatures acceptées */}
                        <div className="item">
                            <div className="info-card">
                                <h1 className="title">{candidatureStats.find(stat => stat.candidature_status === "acceptée")?.count || 0} Acceptées</h1>
                            </div>
                        </div>

                        {/* Div pour les candidatures refusées */}
                        <div className="item">
                            <div className="info-card">
                                <h1 className="title">{candidatureStats.find(stat => stat.candidature_status === "refusée")?.count || 0} Refusées</h1>
                            </div>
                        </div>
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

            {selectedMotivationLetter && (
                <div className="popup-lm">
                    <div className="popup-content-lm">
                        <button 
                            className="close-button-popup" 
                            onClick={() => setSelectedMotivationLetter(null)} 
                            aria-label="Fermer"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="title">Lettre de Motivation</h2>
                        <p>{selectedMotivationLetter}</p>
                    </div>
                </div>
            )}
            
            <img className="assets" src="/Assets/separateur-w2b.png"/>
        </div>
    );
}