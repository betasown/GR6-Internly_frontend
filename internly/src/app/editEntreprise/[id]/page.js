"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

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

  useEffect(() => {
    // Charger les données de l'entreprise si nécessaire
    const fetchEntreprise = async () => {
      try {
        const response = await fetch(`http://localhost:8000/index.php?route=entreprise&id=${id}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
  
        // Mapper les données de l'API aux champs du formulaire
        setFormData({
          nom: data.entreprise_nom,
          description: data.entreprise_description,
          email: data.entreprise_email,
          telephone: data.entreprise_telephone,
          domaine: data.entreprise_domaine,
          visibilite: data.entreprise_visibilite,
        });
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
        alert("Entreprise mise à jour avec succès !");
        router.push("/gestionEntreprise"); // Rediriger après la mise à jour
      } else {
        alert("Erreur lors de la mise à jour de l'entreprise.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div>
      <h1>Modifier une entreprise</h1>
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
          <select
            name="visibilite"
            value={formData.visibilite}
            onChange={handleChange}
            required
          >
            <option value={1}>Visible</option>
            <option value={0}>Non visible</option>
          </select>
        </div>
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default EditEntreprise;