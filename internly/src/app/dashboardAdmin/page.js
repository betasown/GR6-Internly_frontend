"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importez useRouter
import Link from "next/link";

export default function Page() {
    const [userInfo, setUserInfo] = useState({ isLoggedIn: false, status: '' });
    const [showLogoutConfirmPopup, setShowLogoutConfirmPopup] = useState(false);
    const [offers, setOffers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const router = useRouter(); // Initialisez le routeur

    useEffect(() => {
        const userCookie = document.cookie.split("; ").find((row) => row.startsWith("user="));
        if (userCookie) {
            const userValue = decodeURIComponent(userCookie.split('=')[1]);
            const user = JSON.parse(userValue); // Parsez le cookie utilisateur

            // Vérification du statut de l'utilisateur
            if (user.status !== "admin") {
                router.push('/403'); // Rediriger vers une page 403 si l'utilisateur n'est pas un administrateur
                return;
            }

            setUserInfo({ isLoggedIn: true, status: user.status });
        } else {
            router.push('/403'); // Rediriger vers une page 403 si aucun cookie utilisateur n'est trouvé
            return;
        }

        // Récupération des données des offres
        fetch('http://localhost:8000/index.php?route=candidatures_with_details')
            .then(response => response.json())
            .then(data => setOffers(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [router]); // Ajoutez router comme dépendance

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

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = offers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(offers.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            // Scroll to top of the page
        }
    };

    return (
        <div>
            <div className="slide-entreprises-container">
                <div className="title-container">
                    <p className="paragraphe">Bienvenue sur votre dashboard </p>
                    <h1 className="title">Administrateur</h1>
                </div>
                <button className="create-offer-button" onClick={handleLogout}>
                    <span className="button-text">Déconnexion</span>
                    <span className="button-icon">+</span>
                </button>
                <div className="container-dashboard">
                    <div className="grid">
                        <div className="item">
                            <br></br>
                            <div className="title-container">
                                <h1 className="title">Candidature en cours :</h1>
                            </div>
                            <table className="offer-table">
                                <thead>
                                    <tr>
                                        <th>Nom de l'offre</th>
                                        <th>Entreprise</th>
                                        <th>Date de candidature</th>
                                        <th>Etudiant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((offer, index) => (
                                        <tr key={index}>
                                            <td>{offer.titre}</td>
                                            <td>{offer.entreprise_nom}</td>
                                            <td>{new Date(offer.date).toISOString().split('T')[0]}</td>
                                            <td>{offer.utilisateur_prenom} {offer.utilisateur_nom}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                        <div className="item">
                            <br></br>
                            <div className="title-container">
                                <h1 className="title">Tickets :</h1>
                            </div> 
                        </div>
                        <div className="item"> 
                            <Link href={`/gestionOffres`} className="info-card">
                                <div className="title" >Offres</div>
                            </Link>
                        </div>
                        <div className="item">
                            <Link href={`/gestionEntreprise`} className="info-card">
                                <div className="title">entreprises</div>
                            </Link>
                        </div>
                        <div className="item">
                            <Link href={`/gestionUtilisateur`} className="info-card">
                                <div className="title">Utilisateurs</div>
                            </Link>
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
            <img className="assets" src="/Assets/separateur-w2b.png"/>
        </div>
    );
}