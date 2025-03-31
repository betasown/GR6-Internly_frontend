"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";

const EditUtilisateur = () => {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    statut: "",
  });

  useEffect(() => {
    const fetchUtilisateur = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/user/${id}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        setFormData({
          nom: data.utilisateur_nom,
          prenom: data.utilisateur_prenom,
          email: data.utilisateur_email,
          statut: data.utilisateur_statut,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        alert("Impossible de récupérer les données de l'utilisateur.");
      }
    };

    if (id) {
      fetchUtilisateur();
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
      const response = await fetch(`http://localhost:8000/index.php?route=update_user&id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Utilisateur mis à jour avec succès !");
        router.push("/gestionUtilisateur");
      } else {
        alert("Erreur lors de la mise à jour de l'utilisateur.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="form-container">
      <button
        className="close-button"
        onClick={() => router.push("/gestionUtilisateur")}
        aria-label="Fermer"
      >
        <X size={24} />
      </button>
      <h1 className="title">Modifier un utilisateur</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="prenom">Prénom</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="apply-button" >Mettre à jour</button>
      </form>
    </div>
  );
};

export default EditUtilisateur;