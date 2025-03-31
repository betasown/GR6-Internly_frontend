"use client";
import React, { useState, useEffect } from "react";

const CreateOffre = () => {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    remuneration: "",
    dateDebut: "",
    dateFin: "",
    places: "",
    entrepriseId: "",
    experienceRequise: "",
    niveauEtudeMinimal: "",
    competences: [],
  });

  const [entreprises, setEntreprises] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [selectedCompetence, setSelectedCompetence] = useState("");

  // Récupérer les entreprises et compétences depuis l'API
  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const response = await fetch("http://localhost:8000/index.php?route=entreprise");
        const data = await response.json();
        setEntreprises(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des entreprises:", error);
      }
    };

    const fetchCompetences = async () => {
      try {
        const response = await fetch("http://localhost:8000/index.php?route=competencies");
        const data = await response.json();
        setCompetences(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des compétences:", error);
      }
    };

    fetchEntreprises();
    fetchCompetences();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    const payload = {
      ...formData,
      remuneration: parseFloat(formData.remuneration),
      places: parseInt(formData.places),
      experienceRequise: parseInt(formData.experienceRequise),
    };

    try {
      const response = await fetch("http://localhost:8000/index.php?route=create_offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Offre créée avec succès !");
        setFormData({
          titre: "",
          description: "",
          remuneration: "",
          dateDebut: "",
          dateFin: "",
          places: "",
          entrepriseId: "",
          experienceRequise: "",
          niveauEtudeMinimal: "",
          competences: [],
        });
      } else {
        alert("Erreur lors de la création de l'offre.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div>
      <h1>Créer une Offre</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre:</label>
          <input type="text" name="titre" value={formData.titre} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Rémunération:</label>
          <input type="number" name="remuneration" value={formData.remuneration} onChange={handleChange} required />
        </div>
        <div>
          <label>Date de début:</label>
          <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} required />
        </div>
        <div>
          <label>Date de fin:</label>
          <input type="date" name="dateFin" value={formData.dateFin} onChange={handleChange} required />
        </div>
        <div>
          <label>Places:</label>
          <input type="number" name="places" value={formData.places} onChange={handleChange} required />
        </div>
        <div>
          <label>Nom de l'entreprise:</label>
          <select name="entrepriseId" value={formData.entrepriseId} onChange={handleChange} required>
            <option value="">Sélectionnez une entreprise</option>
            {entreprises.map((entreprise) => (
              <option key={entreprise.entreprise_id} value={entreprise.entreprise_id}>
                {entreprise.entreprise_nom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Expérience requise (en années):</label>
          <input type="number" name="experienceRequise" value={formData.experienceRequise} onChange={handleChange} required />
        </div>
        <div>
          <label>Niveau d'étude minimal:</label>
          <input type="text" name="niveauEtudeMinimal" value={formData.niveauEtudeMinimal} onChange={handleChange} required />
        </div>
        <div>
          <label>Compétences:</label>
          <div>
            <select value={selectedCompetence} onChange={(e) => setSelectedCompetence(e.target.value)}>
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
              <span key={index} style={{ display: "inline-block", margin: "5px", padding: "5px", border: "1px solid #ccc", borderRadius: "5px" }}>
                {competence}
                <button type="button" onClick={() => handleRemoveCompetence(competence)} style={{ marginLeft: "5px" }}>
                  x
                </button>
              </span>
            ))}
          </div>
        </div>
        <button type="submit">Créer l'offre</button>
      </form>
    </div>
  );
};

export default CreateOffre;