"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EntrepriseDetail() {
  const { id } = useParams();
  const [entreprise, setEntreprise] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const router = useRouter();

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star full-star"></span>);
      } else if (i - rating < 1) {
        stars.push(<span key={i} className="star half-star"></span>);
      } else {
        stars.push(<span key={i} className="star empty-star"></span>);
      }
    }
    return stars;
  };

  const handleDeleteClick = () => {
    setShowConfirmPopup(true);
  };

  const handleConfirmDelete = () => {
    // Ajouter la logique de suppression ici
    setShowConfirmPopup(false);
    console.log('Entreprise supprimée');
    router.push('/entreprises'); // Rediriger vers la page des entreprises
  };

  const handleCancelDelete = () => {
    setShowConfirmPopup(false);
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const res = await fetch(`http://localhost:8000/index.php?route=entreprise&id=${id}`);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          setEntreprise(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchData();
    }
  }, [id]);

  if (error) {
    return <p>Erreur: {error}</p>;
  }

  if (!entreprise) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <div className="slide-container">
        <div className="slide-company-container">
          <h1 className='title'>{entreprise.entreprise_nom}</h1>
          <p>{entreprise.entreprise_description}</p>
          <p><strong>Contact:</strong> {entreprise.entreprise_email} / {entreprise.entreprise_telephone}</p>
          <p><strong>Domaine:</strong> {entreprise.entreprise_domaine}</p>
          <div className="rating">
            <strong>Note:</strong> 0
          </div>
          <p><strong>Nombre de stagiaires pris:</strong> 0</p>
          <p><strong>Adresse : </strong>{entreprise.adresse_num_rue} {entreprise.adresse_rue}, {entreprise.ville_code_postal}, {entreprise.ville}</p>
        
      
      <div className="button-group">
        <button className="edit-button" onClick={() => router.push('/modifGoogle')}>Modifier</button>
        <button className="delete-button" onClick={handleDeleteClick}>Supprimer</button>
      </div>

      {showConfirmPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Êtes-vous sûr de vouloir supprimer cette entreprise ?</p>
            <button onClick={handleConfirmDelete}>Oui</button>
            <button onClick={handleCancelDelete}>Non</button>
          </div>
        </div>
      )}</div>
      </div>
    </div>
  );
}
