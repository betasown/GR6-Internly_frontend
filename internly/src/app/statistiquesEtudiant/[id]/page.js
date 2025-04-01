"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Import useParams pour récupérer l'ID
import { ArrowLeft } from "lucide-react";

export default function Page() {
    const [candidatures, setCandidatures] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const router = useRouter();
    const { id } = useParams(); // Récupère l'ID depuis l'URL

    useEffect(() => {
        if (!id) return;

        // Fetch candidatures for the user
        fetch(`http://localhost:8000/index.php?route=candidatures_by_user&user_id=${id}`)
            .then((response) => response.json())
            .then((data) => setCandidatures(data))
            .catch((error) => console.error("Error fetching candidatures:", error));

        // Fetch user information
        fetch(`http://localhost:8000/api/user/${id}`)
            .then((response) => response.json())
            .then((data) => setUserInfo(data))
            .catch((error) => console.error("Error fetching user info:", error));
    }, [id]);

    return (
        <div>
            <div className="slide-entreprises-container">
                <div className="title-container">
                    <p className="paragraphe">Candidatures de</p>
                    <h1 className="title">{userInfo ? `${userInfo.utilisateur_nom} ${userInfo.utilisateur_prenom}` : "Chargement..."}</h1>
                </div>
            
                <button className="return-button" onClick={() => router.push("/gestionEtudiant")}>
                    <span className="button-text"><ArrowLeft size={24}/></span>
                </button>
                <div className="container-dashboard">
                    <div className="grid">
                        <div className="item">
                            <br></br>
                            <center><div className="title">Candidatures :</div></center>
                            <br></br>
                            {/* Display the candidatures in a table */}
                            <table className="offer-table">
                                <thead>
                                    <tr>
                                        <th>Poste</th>
                                        <th>Entreprise</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {candidatures.map((candidature, index) => (
                                        <tr key={index}>
                                            <td>{candidature.offre_titre}</td>
                                            <td>{candidature.entreprise_nom}</td>
                                            <td>{new Date(candidature.candidature_date).toLocaleDateString()}</td>
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
                        </div>
                        <div className="item">
                            <br></br>
                            <center><div className="title">Informations :</div></center>
                            <br></br>
                            {userInfo ? (
                                <div className="user-info">
                                    <p><strong>Nom :</strong> {userInfo.utilisateur_nom}</p>
                                    <p><strong>Prénom :</strong> {userInfo.utilisateur_prenom}</p>
                                    <p><strong>Email :</strong> {userInfo.utilisateur_email}</p>
                                </div>
                            ) : (
                                <p>Chargement des informations...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}