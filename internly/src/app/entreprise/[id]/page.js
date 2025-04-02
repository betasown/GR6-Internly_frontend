"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    try {
      return JSON.parse(parts.pop().split(";").shift()); // Parse le JSON du cookie
    } catch (error) {
      console.error("Erreur lors du parsing du cookie :", error);
      return null;
    }
  }
  return null;
};

export default function EntrepriseDetail() {
  const { id } = useParams();
  const [entreprise, setEntreprise] = useState(null);
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0); // État pour la note de l'utilisateur
  const router = useRouter();

  const userCookie = getCookie("user"); // Récupère le cookie utilisateur
  const userRole = userCookie?.status; // Récupère le rôle de l'utilisateur (admin, pilote, etc.)

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

  const handleRatingSubmit = async () => {
    if (!userCookie || !userCookie.id) {
      alert("Vous devez être connecté pour soumettre une évaluation.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/index.php?route=add_evaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entreprise_id: id,
          utilisateur_id: userCookie.id,
          evaluation_note: userRating,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.error === "Vous avez déjà noté cette entreprise.") {
          alert("Vous avez déjà noté cette entreprise.");
        } else {
          throw new Error(data.error || "Une erreur est survenue.");
        }
        return;
      }

      alert(`Votre note de ${userRating} étoile(s) a été soumise avec succès !`);
      console.log("Réponse du serveur :", data);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la note :", error);
      alert(error.message || "Une erreur est survenue lors de la soumission de votre note.");
    }
  };

  const handleStarClick = (rating) => {
    setUserRating(rating);
  };

  if (error) {
    return <p>Erreur: {error}</p>;
  }

  if (!entreprise) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <div className="slide-company-container">
        <button className="close-button" onClick={() => router.push("/entreprise")} aria-label="Fermer">
          <X size={24} />
        </button>
        <h1 className="title">{entreprise.entreprise_nom}</h1>
        <p>{entreprise.entreprise_description}</p>
        <p>
          <strong>Contact:</strong> {entreprise.entreprise_email} / {entreprise.entreprise_telephone}
        </p>
        <p>
          <strong>Domaine:</strong> {entreprise.entreprise_domaine}
        </p>
        <div className="rating">
          <strong>Note: </strong> {entreprise.Note ? parseFloat(entreprise.Note).toFixed(1) : "Non notée"}
        </div>
        <p>
          <strong>Nombre de stagiaires pris: </strong> {entreprise.Nombre_de_stagiaires_pris ?? "Non spécifié"}
        </p>
      </div>

      <br></br>

      <div className="slide-company-container">
        <h2 className="title">Noter {entreprise.entreprise_nom}</h2>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${userRating >= star ? "full-star" : "empty-star"}`}
              onClick={() => handleStarClick(star)}
            >
              ★
            </span>
          ))}
        </div>
        <button onClick={handleRatingSubmit} className="apply-button">
          Soumettre
        </button>
      </div>

      <br></br>

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
          ) : offers.length > 0 ? (
            offers.map((offer, index) => (
              <div key={index} className="offer-card">
                <div className="titre">{offer.offre_titre}</div>
                <div className="entreprise">{offer.entreprise_nom}</div>
                <div className="competences">
                  {offer.competences ? (
                    offer.competences.split(", ").map((competence, i) => (
                      <span key={i} className="competence-pill">{competence}</span>
                    ))
                  ) : (
                    <span className="competence-pill">Aucune compétence spécifiée</span>
                  )}
                </div>
                <button
                  className="apply-button"
                  onClick={() => router.push(`/offres/${offer.offre_id}`)}
                >
                  {(!userCookie || userRole === "admin" || userRole === "pilote") ? "Voir l'offre" : "Candidater"}
                </button>
              </div>
            ))
          ) : (
            <p className="no-results-message">Aucune offre disponible pour cette entreprise.</p>
          )}
        </div>
      </div>
      <img className="assets" src="/Assets/separateur-w2b.png" />
    </div>
  );
}