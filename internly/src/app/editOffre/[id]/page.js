"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";

const EditOffre = () => {
    const { id: offreId } = useParams();
    const router = useRouter();

    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        remuneration: "",
        dateDebut: "",
        dateFin: "",
        places: "",
        experienceRequise: "",
        niveauEtudeMinimal: "",
        competences: [],
    });

    const [competences, setCompetences] = useState([]);
    const [selectedCompetence, setSelectedCompetence] = useState("");

    useEffect(() => {
        if (offreId) {
            fetch(`http://localhost:8000/index.php?route=offers&id=${offreId}`)
                .then((response) => response.json())
                .then((data) => {
                    setFormData({
                        titre: data.offre_titre || "",
                        description: data.offre_description || "",
                        remuneration: data.offre_remuneration || "",
                        dateDebut: data.offre_date_debut || "",
                        dateFin: data.offre_date_fin || "",
                        places: data.offre_places || "",
                        experienceRequise: data.offre_experience_requise || "",
                        niveauEtudeMinimal: data.offre_niveau_etude_minimal || "",
                        competences: data.competences ? data.competences.split(",") : [],
                    });
                })
                .catch((error) => console.error("Erreur lors du chargement de l'offre :", error));
        }

        fetch("http://localhost:8000/index.php?route=competencies")
            .then((response) => response.json())
            .then((data) => setCompetences(data))
            .catch((error) => console.error("Erreur lors de la récupération des compétences :", error));
    }, [offreId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddCompetence = () => {
        if (selectedCompetence && !formData.competences.includes(selectedCompetence)) {
            setFormData({
                ...formData,
                competences: [...formData.competences, selectedCompetence],
            });
            setSelectedCompetence("");
        }
    };

    const handleRemoveCompetence = (competenceToRemove) => {
        setFormData({
            ...formData,
            competences: formData.competences.filter((competence) => competence !== competenceToRemove),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            remuneration: parseFloat(formData.remuneration),
            places: parseInt(formData.places),
            experienceRequise: parseInt(formData.experienceRequise),
            competences:
                formData.competences.length === 1
                    ? formData.competences[0] // Une seule compétence : chaîne
                    : formData.competences, // Plusieurs compétences : tableau
        };

        try {
            const response = await fetch(
                `http://localhost:8000/index.php?route=update_offer&id=${offreId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                alert("Offre mise à jour avec succès !");
                router.push("/gestionOffres");
            } else {
                alert("Erreur lors de la mise à jour de l'offre.");
            }
        } catch (error) {
            console.error("Erreur :", error);
            alert("Une erreur est survenue.");
        }
    };

    return (
        <div className="form-container">
            {/* Bouton pour quitter la page */}
            <button
                className="close-button"
                onClick={() => router.push("/gestionOffres")}
                aria-label="Fermer"
            >
                <X size={24} />
            </button>

            <h1 className="title">Modifier une Offre</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="titre" className="form-text">
                        Titre
                        <input
                            type="text"
                            id="titre"
                            name="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Titre de l'offre"
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="form-text">
                        Description
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Description de l'offre"
                            rows="4"
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="remuneration" className="form-text">
                        Rémunération
                        <input
                            type="number"
                            id="remuneration"
                            name="remuneration"
                            value={formData.remuneration}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Rémunération"
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="dateDebut" className="form-text">
                        Date de début
                        <input
                            type="date"
                            id="dateDebut"
                            name="dateDebut"
                            value={formData.dateDebut}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="dateFin" className="form-text">
                        Date de fin
                        <input
                            type="date"
                            id="dateFin"
                            name="dateFin"
                            value={formData.dateFin}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="places" className="form-text">
                        Places
                        <input
                            type="number"
                            id="places"
                            name="places"
                            value={formData.places}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Nombre de places"
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="experienceRequise" className="form-text">
                        Expérience requise (en années)
                        <input
                            type="number"
                            id="experienceRequise"
                            name="experienceRequise"
                            value={formData.experienceRequise}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Expérience requise"
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="niveauEtudeMinimal" className="form-text">
                        Niveau d'étude minimal
                        <input
                            type="text"
                            id="niveauEtudeMinimal"
                            name="niveauEtudeMinimal"
                            value={formData.niveauEtudeMinimal}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Niveau d'étude minimal"
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="competences" className="form-text">
                        Compétences
                        <div className="competences-container" style={{ marginBottom: "10px" }}>
                            <select
                                id="competences"
                                value={selectedCompetence}
                                onChange={(e) => setSelectedCompetence(e.target.value)}
                                className="form-input"
                            >
                                <option value="">Sélectionnez une compétence</option>
                                {competences.map((competence) => (
                                    <option key={competence.competence_id} value={competence.competence_nom}>
                                        {competence.competence_nom}
                                    </option>
                                ))}
                            </select>
                            <button type="button" className="add-button" onClick={handleAddCompetence}>
                                Ajouter
                            </button>
                        </div>
                        <div className="competences-pills">
                            {formData.competences.map((competence, index) => (
                                <span key={index} className="competence-pill">
                                    {competence}
                                    <button
                                        type="button"
                                        className="remove-pill"
                                        onClick={() => handleRemoveCompetence(competence)}
                                    >
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>
                    </label>
                </div>
                <div className="button-group">
                    <button type="submit" className="apply-button">
                        Mettre à jour
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditOffre;