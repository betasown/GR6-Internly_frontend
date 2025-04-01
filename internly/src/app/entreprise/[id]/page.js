"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react"; 

export default function EntrepriseDetail() {
  const { id } = useParams();
  const [entreprise, setEntreprise] = useState(null);
  const [offers, setOffers] = useState([]); // Nouvel état pour les offres
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchEntrepriseData = async () => {
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

      const fetchOffersData = async () => {
        try {
          const res = await fetch(`http://localhost:8000/index.php?route=offers_by_entreprise&entreprise_id=${id}`);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          setOffers(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchEntrepriseData();
      fetchOffersData();
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
          <button className="close-button" onClick={() => router.push("/entreprise")} aria-label="Fermer"><X size={24} /></button>
          <h1 className="title">{entreprise.entreprise_nom}</h1>
          <p>{entreprise.entreprise_description}</p>
          <p>
            <strong>Contact:</strong> {entreprise.entreprise_email} / {entreprise.entreprise_telephone}
          </p>
          <p>
            <strong>Domaine:</strong> {entreprise.entreprise_domaine}
          </p>
          <div className="rating">
            <strong>Note:</strong> 0
          </div>
          <p>
            <strong>Nombre de stagiaires pris:</strong> 0
          </p>
        </div>
      </div>

      
                <div className="title-container">
                    <div className="title-text">
                        <p className="paragraphe">Découvrir les offres de </p>
                        <h1 className="title">l'entreprise</h1>
                    </div>
                </div>
          

      <div className="container-cards-container">
  <div className="offer-container">
    {error ? (
      <p>Erreur: {error}</p>
    ) : (
      offers.length > 0 ? (
        offers.map((offer, index) => (
          <div key={index} className="offer-card">
            <div className="titre">{offer.offre_titre}</div>
            <div className="entreprise">{offer.entreprise_nom}</div>
            <div className="competences">
              {Array.isArray(offer.competences) && offer.competences.length > 0 ? (
                offer.competences.map((competence, i) => (
                  <span key={i} className="competence-pill">{offer.competences}</span>
                ))
              ) : (
                <span className="competence-pill">Aucune compétence spécifiée</span>
              )}
            </div>
            <button 
              className="apply-button" 
              onClick={() => router.push(`/offres/${offer.offre_id}`)}
            >
              Candidater
            </button>
          </div>
        ))
      ) : (
        <p className="no-results-message">Aucune offre disponible pour cette entreprise.</p>
      )
    )}
  </div>
</div>
<img className="assets" src="/Assets/separateur-w2b.png" />
    </div>
  );
}
