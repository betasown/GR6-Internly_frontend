// filepath: /home/robin/Documents/GR6-ProjetWeb/GR6-Internly/internly/src/app/editOffre/[id]/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const EditOffre = () => {
    const { id: offreId } = useParams(); // Récupère l'ID depuis l'URL

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

    const [competences, setCompetences] = useState([]); // Liste des compétences disponibles
    const [selectedCompetence, setSelectedCompetence] = useState(""); // Compétence sélectionnée

    useEffect(() => {
        // Fetch the existing offer data to prefill the form
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

        // Fetch the list of available competences
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
            setSelectedCompetence(""); // Réinitialiser la sélection
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
      try {
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
          } else {
              alert("Erreur lors de la mise à jour de l'offre.");
          }
      } catch (error) {
          console.error("Erreur :", error);
          alert("Une erreur est survenue.");
      }
  };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Titre:</label>
                <input
                    type="text"
                    name="titre"
                    value={formData.titre}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Rémunération:</label>
                <input
                    type="number"
                    name="remuneration"
                    value={formData.remuneration}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Date de début:</label>
                <input
                    type="date"
                    name="dateDebut"
                    value={formData.dateDebut}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Date de fin:</label>
                <input
                    type="date"
                    name="dateFin"
                    value={formData.dateFin}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Places:</label>
                <input
                    type="number"
                    name="places"
                    value={formData.places}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Expérience requise (en années):</label>
                <input
                    type="number"
                    name="experienceRequise"
                    value={formData.experienceRequise}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Niveau d'étude minimal:</label>
                <input
                    type="text"
                    name="niveauEtudeMinimal"
                    value={formData.niveauEtudeMinimal}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Compétences:</label>
                <div>
                    <select
                        value={selectedCompetence}
                        onChange={(e) => setSelectedCompetence(e.target.value)}
                    >
                        <option value="">Sélectionnez une compétence</option>
                        {competences.map((competence) => (
                            <option key={competence.competence_id} value={competence.competence_nom}>
                                {competence.competence_nom}
                            </option>
                        ))}
                    </select>
                    <button type="button" onClick={handleAddCompetence}>
                        Ajouter
                    </button>
                </div>
                <div>
                    {formData.competences.map((competence, index) => (
                        <span key={index}>
                            {competence}
                            <button type="button" onClick={() => handleRemoveCompetence(competence)}>
                                x
                            </button>
                        </span>
                    ))}
                </div>
            </div>
            <button type="submit">Mettre à jour l'offre</button>
        </form>
    );
};

export default EditOffre;