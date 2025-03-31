"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import pour la navigation et les paramètres d'URL
import { X } from "lucide-react"; // Import de l'icône Lucide React

const CreateUtilisateur = () => {
  const router = useRouter(); // Hook pour gérer la navigation
  const searchParams = useSearchParams(); // Hook pour récupérer les paramètres d'URL
  const statutParam = searchParams.get("statut") || "etudiant"; // Récupérer le statut ou utiliser "etudiant" par défaut

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    statut: statutParam, // Initialiser avec le statut récupéré
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/index.php?route=create_user",
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
        alert("Utilisateur créé avec succès !");
        console.log(data);
      } else {
        alert("Erreur lors de la création de l'utilisateur.");
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
        onClick={() => router.push("/gestionUtilisateur")}
        aria-label="Fermer"
      >
        <X size={24} />
      </button>

      <h1 className="title">Créer un utilisateur</h1>

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
              placeholder="Nom"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="prenom" className="form-text">
            Prénom
            <br />
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="form-input"
              placeholder="Prénom"
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
          <label htmlFor="password" className="form-text">
            Mot de passe
            <br />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Mot de passe"
              required
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
                prenom: "",
                statut: statutParam, // Réinitialiser avec le statut initial
                email: "",
                password: "",
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

export default CreateUtilisateur;