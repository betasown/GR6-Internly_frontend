"use client";
import React, { useState } from "react";

const CreateEntreprise = () => {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    email: "",
    telephone: "",
    domaine: "",
    visibilite: true,
  });

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
      } else {
        alert("Erreur lors de la création de l'entreprise.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div>
      <h1>Créer une entreprise</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description :</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Téléphone :</label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Domaine :</label>
          <input
            type="text"
            name="domaine"
            value={formData.domaine}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Visibilité :</label>
          <input
            type="checkbox"
            name="visibilite"
            checked={formData.visibilite}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default CreateEntreprise;