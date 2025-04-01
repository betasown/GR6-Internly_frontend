"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Trash, Pencil, ArrowLeft, FileChartColumn } from "lucide-react";
import { useRouter } from "next/navigation";

const handleDeleteUser = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
        try {
            const response = await fetch(
                "http://localhost:8000/index.php?route=delete_user",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id }),
                }
            );

            const responseData = await response.json();

            if (responseData.success) {
                alert("Utilisateur supprimé avec succès !");
                // Rafraîchir la page après suppression
                window.location.reload();
            } else {
                alert(`Erreur : ${responseData.error || "Une erreur est survenue."}`);
            }
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            alert("Une erreur est survenue.");
        }
    }
};

export default function Page() {
    const [etudiants, setEtudiants] = useState([]);
    const [currentPageEtudiants, setCurrentPageEtudiants] = useState(1);
    const itemsPerPage = 5;
    const router = useRouter(); // Initialisez le routeur

    useEffect(() => {
        // Fetch data for etudiants
        fetch("http://localhost:8000/index.php?route=users&status=etudiant")
            .then((response) => response.json())
            .then((data) => setEtudiants(data))
            .catch((error) => console.error("Error fetching etudiants:", error));
    }, []);

    const totalPagesEtudiants = Math.ceil(etudiants.length / itemsPerPage);

    const paginateEtudiants = (pageNumber) => {
        setCurrentPageEtudiants(pageNumber);
    };

    const currentEtudiants = etudiants.slice(
        (currentPageEtudiants - 1) * itemsPerPage,
        currentPageEtudiants * itemsPerPage
    );

    return (
        <div>
            <div className="slide-entreprises-container">
                <div className="title-container">
                    <p className="paragraphe">Gestion des</p>
                    <h1 className="title">Etudiants</h1>
                </div>
            
            <button className="return-button" onClick={() => router.push("/dashboardPilote")}>
                    <span className="button-text"><ArrowLeft size={24}/></span>
            </button>
            <div className="container-dashboard">
                <div className="container-dashboard">
                    <div className="grid">
                        <div className="item">
                            <br></br>
                            <center><div className="title">Etudiants :</div></center>
                            <br></br>
                            {/* Display the etudiants in a table */}
                            <table className="offer-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Prénom</th>
                                        <th>Email</th>
                                        <th><center></center></th>
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
                                                    <Link href={`/statistiquesEtudiant/${etudiant.utilisateur_id}`}>
                                                        <button className="view-button">
                                                            <FileChartColumn size={24} />
                                                        </button>
                                                    </Link>
                                                </center>
                                            </td>
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
                            <Link href={`/createUtilisateur`} className="info-card">
                                <div className="title">Créer un compte Etudiant</div>
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
        </div>
        <img className="assets" src="/Assets/separateur-w2b.png" />
    </div>
    );
}