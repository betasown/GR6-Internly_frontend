"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash, Pencil, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
    const [entreprises, setEntreprises] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const router = useRouter();

    useEffect(() => {
        // Vérifiez si l'utilisateur est connecté et a le statut "admin" ou "pilote"
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

    useEffect(() => {
        // Fetch data from the API
        fetch("http://localhost:8000/index.php?route=offers_display")
            .then((response) => response.json())
            .then((data) => setEntreprises(data))
            .catch((error) => console.error("Error fetching entreprises:", error));
    }, []);

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

    const handleDelete = async (offreId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
            try {
                const response = await fetch("http://localhost:8000/index.php?route=delete_offer", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ offre_id: offreId }),
                });

                if (response.ok) {
                    alert("Offre supprimée avec succès !");
                    // Mettre à jour la liste des offres après suppression
                    setEntreprises((prevEntreprises) =>
                        prevEntreprises.filter((entreprise) => entreprise.offre_id !== offreId)
                    );
                } else {
                    alert("Erreur lors de la suppression de l'offre.");
                }
            } catch (error) {
                console.error("Erreur lors de la suppression de l'offre :", error);
                alert("Une erreur est survenue.");
            }
        }
    };

    return (
        <div>
            <div className="slide-entreprises-container">
                <div className="title-container">
                    <p className="paragraphe">Gestion des</p>
                    <h1 className="title">Offres</h1>
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
                                <h1 className="title">Offres : </h1>
                            </div>

                            {/* Display the entreprises in a table */}
                            <table className="offer-table">
                                <thead>
                                    <tr>
                                        <th>Titre </th>
                                        <th>Entreprise</th>
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
                                        <tr key={entreprise.offre_id}>
                                            <td>{entreprise.titre_offre}</td>
                                            <td>{entreprise.entreprise}</td>
                                            <td>
                                                <center>
                                                    <button
                                                        className="modif-button"
                                                        onClick={() => router.push(`/editOffre/${entreprise.offre_id}`)}
                                                    >
                                                        <Pencil size={24} />
                                                    </button>
                                                </center>
                                            </td>
                                            <td>
                                                <center>
                                                    <button
                                                        className="remove-button"
                                                        onClick={() => handleDelete(entreprise.offre_id)}
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
                            <Link href={`/createOffre`} className="info-card">
                                <div className="title">Créer une Offre</div>
                            </Link>
                            <br />
                            <Link href={`/offres`} className="info-card">
                                <div className="title">Voir les statistiques</div>
                            </Link>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
            <img className="assets" src="/Assets/separateur-w2b.png" />
        </div>
    );
}