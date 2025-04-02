"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash, Pencil, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation"; // Importez useRouter

export default function Page() {
    const router = useRouter(); // Initialisez le routeur
    const [entreprises, setEntreprises] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [showDeletePopup, setShowDeletePopup] = useState(false); // Popup de confirmation de suppression
    const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false); // Popup de succès
    const [showDeleteErrorPopup, setShowDeleteErrorPopup] = useState(false); // Popup d'erreur
    const [selectedEntrepriseId, setSelectedEntrepriseId] = useState(null); // ID de l'entreprise à supprimer

    // Vérification des droits d'accès
    useEffect(() => {
        const userCookie = document.cookie.split("; ").find((row) => row.startsWith("user="));
        if (userCookie) {
            const user = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
            if (user.status !== "admin" && user.status !== "pilote") {
                router.push("/403/"); // Redirige si l'utilisateur n'est ni admin ni pilote
            }
        } else {
            router.push("/403/"); // Redirige si l'utilisateur n'est pas connecté
        }
    }, [router]);

    const fetchEntreprises = async () => {
        try {
            const response = await fetch("http://20.123.199.44:8000/index.php?route=entreprise");
            const data = await response.json();
            setEntreprises(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des entreprises :", error);
        }
    };

    useEffect(() => {
        fetchEntreprises(); // Appel initial pour charger les entreprises
    }, []);

    const handleDelete = async (id) => {

        setSelectedEntrepriseId(id); // Stocker l'ID de l'entreprise sélectionnée
        setShowDeletePopup(true); // Afficher la popup de confirmation
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(
                "http://20.123.199.44:8000/index.php?route=delete_entreprise",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `id=${selectedEntrepriseId}`,

                }
            );

            const responseData = await response.json();

            if (responseData.success) {
                setShowDeleteSuccessPopup(true); // Afficher la popup de succès
                fetchEntreprises(); // Rafraîchir la liste des entreprises
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

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = entreprises.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(entreprises.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div>
            <div className="slide-entreprises-container">
                <div className="title-container">
                    <p className="paragraphe">Gestion des</p>
                    <h1 className="title">Entreprises</h1>
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
                    <span className="button-text">
                        <ArrowLeft size={24} />
                    </span>
                </button>
                <div className="container-dashboard">
                    <div className="grid">
                        <div className="item">
                            <br />
                            <div className="title-container">
                                <h1 className="title">Entreprises : </h1>
                            </div>

                            {/* Display the entreprises in a table */}
                            <table className="offer-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Email</th>
                                        <th>Tel :</th>
                                        <th>
                                            <center></center>
                                        </th>
                                        <th>
                                            <center></center>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((entreprise) => (
                                        <tr key={entreprise.entreprise_id}>
                                            <td>{entreprise.entreprise_nom}</td>
                                            <td>{entreprise.entreprise_email}</td>
                                            <td>{entreprise.entreprise_telephone}</td>
                                            <td>
                                                <center>
                                                    <Link href={`/editEntreprise/${entreprise.entreprise_id}`}>
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
                                                        onClick={() => handleDelete(entreprise.entreprise_id)}
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
                                <button onClick={() => paginate(1)} disabled={currentPage === 1}>
                                    &laquo;
                                </button>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginate(index + 1)}
                                        className={currentPage === index + 1 ? "active" : ""}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>
                                    &raquo;
                                </button>
                            </div>
                        </div>
                        <div className="item">
                            <br />
                            <center>
                                <div className="title">Accessibilité :</div>
                            </center>
                            <br />
                            <Link href={`/createEntreprise`} className="info-card">
                                <div className="title">Créer une entreprise</div>
                            </Link>
                            <br />
                            <Link href={`/entreprise`} className="info-card">
                                <div className="title">Voir les statistiques</div>
                            </Link>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
            <img className="assets" src="/Assets/separateur-w2b.png" />

            {showDeletePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Êtes-vous sûr de vouloir supprimer cette entreprise ?</p>
                        <div className="popup-buttons">
                            <button
                                onClick={confirmDelete}
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
                        <p>Entreprise supprimée avec succès !</p>
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
                        <p>Une erreur est survenue lors de la suppression de l'entreprise.</p>
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