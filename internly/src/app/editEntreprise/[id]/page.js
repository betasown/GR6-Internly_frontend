"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react"; // Import de l'icône Lucide React

const EditEntreprise = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const router = useRouter();

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    email: "",
    telephone: "",
    domaine: "",
    visibilite: 1,
  });

  const [initialData, setInitialData] = useState(null); // Stocke les données initiales
  const [showUpdatePopup, setShowUpdatePopup] = useState(false); // Popup pour la mise à jour réussie
  const [showErrorPopup, setShowErrorPopup] = useState(false); // Popup pour les erreurs
  const [errors, setErrors] = useState({
    email: "",
    telephone: "",
  }); // Stocke les erreurs de validation

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

  useEffect(() => {
    const fetchEntreprise = async () => {
      try {
        const response = await fetch(`http://localhost:8000/index.php?route=entreprise&id=${id}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();

        // Mapper les données de l'API aux champs du formulaire
        const mappedData = {
          nom: data.entreprise_nom,
          description: data.entreprise_description,
          email: data.entreprise_email,
          telephone: data.entreprise_telephone,
          domaine: data.entreprise_domaine,
          visibilite: data.entreprise_visibilite,
        };

        setFormData(mappedData); // Remplit le formulaire avec les données récupérées
        setInitialData(mappedData); // Stocke les données initiales
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        alert("Impossible de récupérer les données de l'entreprise.");
      }
    };

    if (id) {
      fetchEntreprise();
    }
  }, [id]);

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
    try {
      const response = await fetch(`http://localhost:8000/index.php?route=update_entreprise&id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowUpdatePopup(true); // Afficher la popup de mise à jour réussie
      } else {
        setShowErrorPopup(true); // Afficher la popup d'erreur
      }
    } catch (error) {
      console.error("Erreur :", error);
      setShowErrorPopup(true); // Afficher la popup d'erreur
    }
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData); // Réinitialise les champs avec les données initiales
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

      <h1 className="title">Modifier une entreprise</h1>
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
            Mettre à jour
          </button>
          <button
            type="button"
            className="reinitialiser"
            onClick={handleReset} // Réinitialise les champs avec les données initiales
          >
            Réinitialiser
          </button>
        </div>
      </form>

      {showUpdatePopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Entreprise mise à jour avec succès !</p>
            <button
              onClick={() => {
                setShowUpdatePopup(false);
                router.push("/gestionEntreprise"); // Rediriger après la mise à jour
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
            <p>Une erreur est survenue lors de la mise à jour de l'entreprise.</p>
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

export default EditEntreprise;