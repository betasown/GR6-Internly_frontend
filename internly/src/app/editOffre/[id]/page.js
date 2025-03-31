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
  }, [offreId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "competences" ? value.split(",") : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `http://localhost:8000/index.php?route=update_offer&id=${offreId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...formData,
                        remuneration: parseFloat(formData.remuneration),
                        places: parseInt(formData.places),
                        experienceRequise: parseInt(formData.experienceRequise),
                    }),
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
                <label>Compétences (séparées par des virgules):</label>
                <input
                    type="text"
                    name="competences"
                    value={Array.isArray(formData.competences) ? formData.competences.join(",") : ""}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Mettre à jour l'offre</button>
        </form>
    );
};

export default EditOffre;