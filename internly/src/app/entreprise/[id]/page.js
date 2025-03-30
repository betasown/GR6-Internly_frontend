"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EntrepriseDetail() {
  const { id } = useParams();
  const [entreprise, setEntreprise] = useState(null);
  const [error, setError] = useState(null);

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
    </div>
  );
}
