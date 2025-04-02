"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Trash, Pencil, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation"; // Importez useRouter

export default function Page() {
    const [pilotes, setPilotes] = useState([]);
    const [etudiants, setEtudiants] = useState([]);
    const [currentPagePilotes, setCurrentPagePilotes] = useState(1);
    const [currentPageEtudiants, setCurrentPageEtudiants] = useState(1);
    const [searchPilotes, setSearchPilotes] = useState(""); // Barre de recherche pour pilotes
    const [searchEtudiants, setSearchEtudiants] = useState(""); // Barre de recherche pour étudiants
    const itemsPerPage = 4;
    const router = useRouter(); // Initialisez le routeur

    const [selectedUserId, setSelectedUserId] = useState(null); // ID de l'utilisateur à supprimer
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
    const [showDeleteErrorPopup, setShowDeleteErrorPopup] = useState(false);

    const handleDeleteUser = (id) => {
        setSelectedUserId(id); // Stocker l'ID de l'utilisateur sélectionné
        setShowDeletePopup(true); // Afficher la popup de confirmation
    };

    const confirmDeleteUser = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/index.php?route=delete_user",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: selectedUserId }),
                }
            );

            const responseData = await response.json();

            if (response.ok && responseData.success) {
                setShowDeleteSuccessPopup(true); // Afficher la popup de succès
                setPilotes((prevPilotes) =>
                    prevPilotes.filter((pilote) => pilote.utilisateur_id !== selectedUserId)
                );
                setEtudiants((prevEtudiants) =>
                    prevEtudiants.filter((etudiant) => etudiant.utilisateur_id !== selectedUserId)
                );
            } else {
                setShowDeleteErrorPopup(true); // Afficher la popup d'erreur
            }
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            setShowDeleteErrorPopup(true); // Afficher la popup d'erreur
        } finally {
            setShowDeletePopup(false); // Fermer la popup de confirmation
        }
    };

    useEffect(() => {
        // Fetch data for pilotes
        fetch("http://localhost:8000/index.php?route=users&status=pilote")
            .then((response) => response.json())
            .then((data) => setPilotes(data))
            .catch((error) => console.error("Error fetching pilotes:", error));

        // Fetch data for etudiants
        fetch("http://localhost:8000/index.php?route=users&status=etudiant")
            .then((response) => response.json())
            .then((data) => setEtudiants(data))
            .catch((error) => console.error("Error fetching etudiants:", error));
    }, []);

    const totalPagesPilotes = Math.ceil(pilotes.length / itemsPerPage);
    const totalPagesEtudiants = Math.ceil(etudiants.length / itemsPerPage);

    const paginatePilotes = (pageNumber) => {
        setCurrentPagePilotes(pageNumber);
    };

    const paginateEtudiants = (pageNumber) => {
        setCurrentPageEtudiants(pageNumber);
    };

    const filteredPilotes = pilotes.filter((pilote) =>
        pilote.utilisateur_nom.toLowerCase().includes(searchPilotes.toLowerCase())
    );

    const filteredEtudiants = etudiants.filter((etudiant) =>
        etudiant.utilisateur_nom.toLowerCase().includes(searchEtudiants.toLowerCase())
    );

    const currentPilotes = filteredPilotes.slice(
        (currentPagePilotes - 1) * itemsPerPage,
        currentPagePilotes * itemsPerPage
    );

    const currentEtudiants = filteredEtudiants.slice(
        (currentPageEtudiants - 1) * itemsPerPage,
        currentPageEtudiants * itemsPerPage
    );

    return (
        <div>
            <div className="slide-entreprises-container">
                <div className="title-container">
                    <p className="paragraphe">Gestion des</p>
                    <h1 className="title">utilisateurs</h1>
                </div>
           
                <button
                    className="return-button"
                    onClick={() => {
                        const userCookie = document.cookie.split("; ").find((row) => row.startsWith("user="));
                        if (userCookie) {
                            const user = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
                            switch (user.status) {
                                case "admin":
                                    router.push("/dashboardAdmin");
                                    break;
                                case "pilote":
                                    router.push("/dashboardPilote");
                                    break;
                                default:
                                    alert("Statut utilisateur inconnu. Veuillez contacter l'administrateur.");
                            }
                        } else {
                            alert("Utilisateur non connecté.");
                        }
                    }}
                >
                    <span className="button-text"><ArrowLeft size={24} /></span>
                </button>
                <div className="container-dashboard">
                    <div className="grid">
                        <div className="item">
                            <br></br>
                            <center><div className="title">Pilotes :</div></center>
                            
                            <center><input
                                type="text"
                                placeholder="Entrer le nom d'un pilote..."
                                value={searchPilotes}
                                onChange={(e) => setSearchPilotes(e.target.value)}
                                className="search-bar"
                            /></center>
                            
                            {/* Display the pilotes in a table */}
                            <table className="offer-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Prénom</th>
                                        <th>Email</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPilotes.map((pilote) => (
                                        <tr key={pilote.utilisateur_id}>
                                            <td>{pilote.utilisateur_nom}</td>
                                            <td>{pilote.utilisateur_prenom}</td>
                                            <td>{pilote.utilisateur_email}</td>
                                            <td>
                                                <center>
                                                    <Link href={`/editUtilisateur/${pilote.utilisateur_id}`}>
                                                        <button className="modif-button">
                                                            <Pencil size={24} />
                                                        </button>
                                                    </Link>
                                                </center>
                                            </td>
                                            <td>
                                                <center>
                                                    <button
                                                        className="remove-button"
                                                        onClick={() => handleDeleteUser(pilote.utilisateur_id)}
                                                    >
                                                        <Trash size={24} />
                                                    </button>
                                                </center>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination">
                                <button onClick={() => paginatePilotes(1)} disabled={currentPagePilotes === 1}>&laquo;</button>
                                {Array.from({ length: totalPagesPilotes }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginatePilotes(index + 1)}
                                        className={currentPagePilotes === index + 1 ? 'active' : ''}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button onClick={() => paginatePilotes(totalPagesPilotes)} disabled={currentPagePilotes === totalPagesPilotes}>&raquo;</button>
                            </div>
                        </div>
                        <div className="item">
                            <br></br>
                            <center><div className="title">Accessibilité :</div></center>
                            <br></br>
                            <Link href={`/createUtilisateur?statut=pilote`} className="info-card">
                                <div className="title">Créer un compte Pilote</div>
                            </Link>
                            <br></br>
                            <Link href={`/entreprise`} className="info-card">
                                <div className="title">Voir les statistiques</div>
                            </Link>
                            <br></br>
                        </div>
                    </div>
                </div>
                <div className="container-dashboard">
                    <div className="grid-inverse">
                        <div className="item">
                            <br></br>
                            <center><div className="title">Etudiants :</div></center>
                            
                            <center><input
                                type="text"
                                placeholder="Entrer le nom d'un étudiant..."
                                value={searchEtudiants}
                                onChange={(e) => setSearchEtudiants(e.target.value)}
                                className="search-bar"
                            /></center>
                            {/* Display the etudiants in a table */}
                            <table className="offer-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Prénom</th>
                                        <th>Email</th>
                                        <th><center></center></th>
                                        <th><center></center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEtudiants.map((etudiant) => (
                                        <tr key={etudiant.utilisateur_id}>
                                            <td>{etudiant.utilisateur_nom}</td>
                                            <td>{etudiant.utilisateur_prenom}</td>
                                            <td>{etudiant.utilisateur_email}</td>
                                            <td>
                                                <center>
                                                    <Link href={`/editUtilisateur/${etudiant.utilisateur_id}`}>
                                                        <button className="modif-button">
                                                            <Pencil size={24} />
                                                        </button>
                                                    </Link>
                                                </center>
                                            </td>
                                            <td>
                                                <center>
                                                    <button
                                                        className="remove-button"
                                                        onClick={() => handleDeleteUser(etudiant.utilisateur_id)}
                                                    >
                                                        <Trash size={24} />
                                                    </button>
                                                </center>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination">
                                <button onClick={() => paginateEtudiants(1)} disabled={currentPageEtudiants === 1}>&laquo;</button>
                                {Array.from({ length: totalPagesEtudiants }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginateEtudiants(index + 1)}
                                        className={currentPageEtudiants === index + 1 ? 'active' : ''}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button onClick={() => paginateEtudiants(totalPagesEtudiants)} disabled={currentPageEtudiants === totalPagesEtudiants}>&raquo;</button>
                            </div>
                        </div>
                        <div className="item">
                            <br></br>
                            <center><div className="title">Accessibilité :</div></center>
                            <br></br>
                            <Link href={`/createUtilisateur?statut=etudiant`} className="info-card">
                                <div className="title">Créer un compte Étudiant</div>
                            </Link>
                            <br></br>
                            <Link href={`/entreprise`} className="info-card">
                                <div className="title">Voir les statistiques</div>
                            </Link>
                            <br></br>
                        </div>
                    </div>
                </div>
            
        </div>
        <img className="assets" src="/Assets/separateur-w2b.png" />
        {showDeletePopup && (
            <div className="popup">
                <div className="popup-content">
                    <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
                    <div className="popup-buttons">
                        <button
                            onClick={confirmDeleteUser}
                            className="popup-confirm-button"
                        >
                            Oui
                        </button>
                        <button
                            onClick={() => setShowDeletePopup(false)}
                            className="popup-cancel-button"
                        >
                            Non
                        </button>
                    </div>
                </div>
            </div>
        )}

        {showDeleteSuccessPopup && (
            <div className="popup">
                <div className="popup-content">
                    <p>Utilisateur supprimé avec succès !</p>
                    <button
                        onClick={() => setShowDeleteSuccessPopup(false)}
                        className="popup-close-button"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        )}

        {showDeleteErrorPopup && (
            <div className="popup">
                <div className="popup-content">
                    <p>Une erreur est survenue lors de la suppression de l'utilisateur.</p>
                    <button
                        onClick={() => setShowDeleteErrorPopup(false)}
                        className="popup-close-button"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        )}
    </div>
    );
}