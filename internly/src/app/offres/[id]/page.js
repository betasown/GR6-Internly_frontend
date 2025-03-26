"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"; // Import des icônes

export default function OffreDetail() {
  const { id } = useParams();
  const [offre, setOffre] = useState(null);
  const [error, setError] = useState(null);
  const [showMessageField, setShowMessageField] = useState(false); // État pour afficher/masquer le champ de message
  const [uploadedFile, setUploadedFile] = useState(null); // État pour gérer le fichier téléchargé

  const toggleMessageField = () => {
    setShowMessageField(!showMessageField); // Inverse l'état
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file); // Stocke le fichier téléchargé
    }
  };

  const handleFileRemove = () => {
    setUploadedFile(null); // Supprime le fichier téléchargé
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return `${durationInMonths} mois`;
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const res = await fetch(`http://localhost:8000/index.php?route=offers&id=${id}`);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          setOffre(data);
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

  if (!offre) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <div className="slide-offres-detail-container">
        <h1 className="title">{offre.offre_titre} - {offre.entreprise_nom}</h1>
        <p>{offre.offre_description}</p>
        <article itemScope itemType="http://schema.org/JobPosting">
          <meta itemProp="datePosted" content={offre.offre_date_publication} />
          <meta itemProp="industry" content={offre.entreprise_domaine} />
          <meta itemProp="employmentType" content={offre.employmentType} />
          <p className="subline">
            <span itemProp="hiringOrganization">{offre.entreprise_nom}</span>&nbsp;|&nbsp;
            <span itemProp="jobLocation"> {offre.code_postal}, {offre.ville}</span>&nbsp;|&nbsp;
            <time dateTime={offre.offre_date_publication}>Publiée le {new Date(offre.offre_date_publication).toLocaleDateString()}</time>
          </p>
          <br />
          <h3>Résumé de l'offre</h3>
          <ul className="skills" itemProp="qualifications">
            <li>Durée : {calculateDuration(offre.offre_date_debut, offre.offre_date_fin)}</li>
            <li>Niveau d'études : {offre.offre_niveau_etude_minimal}</li>
            <li>Domaines : {offre.entreprise_domaine}</li>
            <li>Expérience requise : {offre.offre_experience_requise}</li>
          </ul>
          <br /><br />
        </article>
        <form>
          <label className="form-text">Nom<br />
            <input 
              className="form-input" 
              name="nom" 
              type="text" 
              placeholder="Votre nom" 
              required 
            />
          </label><br /><br />
          <label className="form-text">Prénom<br />
            <input 
              className="form-input" 
              name="prenom" 
              type="text" 
              placeholder="Votre prénom" 
              required 
            />
          </label><br /><br />
          <label className="form-text">Courriel<br />
            <input 
              className="form-input" 
              name="courriel" 
              type="email" 
              placeholder="Votre adresse e-mail" 
              required 
            />
          </label><br/><br/>
          
          <label className="form-text">CV</label>
          <div className="cv-container">
  <div className="cv-upload">
    {!uploadedFile ? (
      <label className="apply-button">
        Télécharger votre CV
        <input 
          type="file" 
          accept=".pdf,.doc,.docx,.odt,.rtf,.jpg,.png" 
          hidden 
          onChange={handleFileUpload} 
          required 
        />
      </label>
    ) : (
      <div className="uploaded-file">
        <p>{uploadedFile.name}</p>
        <button 
          type="button" 
          className="remove-file-button" 
          onClick={handleFileRemove}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Trash2 size={16} /> Supprimer
        </button>
      </div>
    )}
  </div>
  {/* Affichage conditionnel des lignes de poids et formats */}
  {!uploadedFile && (
    
    <p className="subline">Poids max 2Mo <br /> Formats .pdf, .doc, .docx, .odt, .rtf, .jpg ou .png</p>
  )}
</div>

          {/* Espacement vertical avant le bouton */}
          <div style={{ marginTop: "20px" }}>
            {/* Bouton pour afficher/masquer le champ de message */}
            <button 
              type="button" 
              className="toggle-message-button" 
              onClick={toggleMessageField}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {showMessageField ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showMessageField ? "Masquer le message au recruteur" : "Ajouter un message au recruteur"}
            </button>
          </div>
          
          {/* Champ de message conditionnel */}
          {showMessageField && (
            <div className="message-field">
              <label className="form-text">Message au recruteur<br />
                <textarea 
                  className="form-input" 
                  name="message" 
                  placeholder="Votre message au recruteur (facultatif)" 
                  rows="4"
                />
              </label>
            </div>
          )}
          
          <br /><br />
          <button 
            className="apply-button" 
            type="submit"
          >
            Postuler maintenant
          </button>
        </form>
        <p className="subline">En cliquant sur "Postuler", vous acceptez les <a href="/CGU">CGU</a> et déclarez avoir pris connaissance de la <a href="/MentionsLegales">politique de la protection des données</a> de notre site.</p>
      </div>
      <br />
      <img className="assets" src="/Assets/separateur-w2b.png" />
    </div>
  );
}