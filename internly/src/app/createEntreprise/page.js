"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import pour la navigation
import { X } from "lucide-react"; // Import de l'icône Lucide React

const CreateEntreprise = () => {
  const router = useRouter(); // Hook pour gérer la navigation
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    email: "",
    telephone: "",
    domaine: "",
    visibilite: true,
  });
  const [errors, setErrors] = useState({
    email: "",
    telephone: "",
  });
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showCreationPopup, setShowCreationPopup] = useState(false); // État pour la popup de confirmation

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Mettre à jour les données du formulaire
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Validation en direct
    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: emailRegex.test(value) ? "" : "Veuillez entrer une adresse email valide.",
      }));
    }

    if (name === "telephone") {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      setErrors((prevErrors) => ({
        ...prevErrors,
        telephone: phoneRegex.test(value) ? "" : "Veuillez entrer un numéro de téléphone valide (10 à 15 chiffres).",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Expressions régulières
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;

    // Validation des champs
    if (!emailRegex.test(formData.email)) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    if (!phoneRegex.test(formData.telephone)) {
      alert("Veuillez entrer un numéro de téléphone valide (10 à 15 chiffres).");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/index.php?route=create_entreprise",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShowCreationPopup(true); // Afficher la popup de confirmation
        console.log(data);

        // Réinitialiser les champs du formulaire
        setFormData({
          nom: "",
          description: "",
          email: "",
          telephone: "",
          domaine: "",
          visibilite: true,
        });

        router.push("/gestionEntreprise"); // Redirection après création
      } else {
        alert("Erreur lors de la création de l'entreprise.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="form-container">
      {/* Bouton pour quitter la page */}
      <button
        className="close-button"
        onClick={() => router.push("/gestionEntreprise")}
        aria-label="Fermer"
      >
        <X size={24} />
      </button>

      <h1 className="title">Créer une entreprise</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nom" className="form-text">
            Nom
            <br />
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="form-input"
              placeholder="Nom de l'entreprise"
              required
            />
            <br />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-text">
            Description
            <br />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              placeholder="Description de l'entreprise"
              rows="4"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-text">
            Email
            <br />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Adresse email"
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="telephone" className="form-text">
            Téléphone
            <br />
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="form-input"
              placeholder="Numéro de téléphone"
              required
            />
            {errors.telephone && <p className="error-message">{errors.telephone}</p>}
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="domaine" className="form-text">
            Domaine
            <br />
            <input
              type="text"
              id="domaine"
              name="domaine"
              value={formData.domaine}
              onChange={handleChange}
              className="form-input"
              placeholder="Domaine d'activité"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="visibilite" className="form-text">
            Visibilité :
            <input
              type="checkbox"
              id="visibilite"
              name="visibilite"
              checked={formData.visibilite}
              onChange={handleChange}
              className="form-checkbox"
            />
          </label>
        </div>
        <div className="button-group">
          <button type="submit" className="apply-button">
            Créer
          </button>
          <button
            type="button"
            className="reinitialiser"
            onClick={() => setShowResetPopup(true)}
          >
            Réinitialiser
          </button>
        </div>
      </form>
      {showResetPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Êtes-vous sûr de vouloir réinitialiser le formulaire ?</p>
            <div className="popup-buttons">
              <button
                onClick={() => {
                  setFormData({
                    nom: "",
                    description: "",
                    email: "",
                    telephone: "",
                    domaine: "",
                    visibilite: true,
                  });
                  setShowResetPopup(false);
                }}
                className="popup-confirm-button"
              >
                Oui
              </button>
              <button
                onClick={() => setShowResetPopup(false)}
                className="popup-cancel-button"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
      {showCreationPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Entreprise créée avec succès !</p>
            <button
              onClick={() => {
                setShowCreationPopup(false);
                router.push("/gestionEntreprise"); // Rediriger vers la page gestionEntreprise
              }}
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

export default CreateEntreprise;