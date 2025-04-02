"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import pour la navigation
import { X } from "lucide-react"; // Import de l'icône Lucide React

const CreateOffre = () => {
  const router = useRouter(); // Hook pour gérer la navigation
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
  const [showCreationPopup, setShowCreationPopup] = useState(false); // Popup de succès
  const [showErrorPopup, setShowErrorPopup] = useState(false); // Popup d'erreur

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

  // Récupérer les entreprises et compétences depuis l'API
  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const response = await fetch("http://20.123.199.44:8000/index.php?route=entreprise");
        const data = await response.json();
        setEntreprises(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des entreprises:", error);
      }
    };

    const fetchCompetences = async () => {
      try {
        const response = await fetch("http://20.123.199.44:8000/index.php?route=competencies");
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
      const response = await fetch("http://20.123.199.44:8000/index.php?route=create_offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowCreationPopup(true); // Afficher la popup de succès
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
        setShowErrorPopup(true); // Afficher la popup d'erreur
      }
    } catch (error) {
      console.error("Erreur:", error);
      setShowErrorPopup(true); // Afficher la popup d'erreur
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

      <h1 className="title">Créer une Offre</h1>
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
          <label htmlFor="entrepriseId" className="form-text">
            Nom de l'entreprise
            <select
              id="entrepriseId"
              name="entrepriseId"
              value={formData.entrepriseId}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Sélectionnez une entreprise</option>
              {entreprises.map((entreprise) => (
                <option key={entreprise.entreprise_id} value={entreprise.entreprise_id}>
                  {entreprise.entreprise_nom}
                </option>
              ))}
            </select>
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
            Créer
          </button>
        </div>
      </form>

      {showCreationPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Offre créée avec succès !</p>
            <button
              onClick={() => {
                setShowCreationPopup(false);
                router.push("/gestionOffres"); // Rediriger après la création
              }}
              className="popup-confirm-button"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Une erreur est survenue lors de la création de l'offre.</p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="popup-close-button"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOffre;