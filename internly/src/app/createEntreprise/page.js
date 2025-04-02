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
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert("Entreprise créée avec succès !");
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
            onClick={() =>
              setFormData({
                nom: "",
                description: "",
                email: "",
                telephone: "",
                domaine: "",
                visibilite: true,
              })
            }
          >
            Réinitialiser
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEntreprise;