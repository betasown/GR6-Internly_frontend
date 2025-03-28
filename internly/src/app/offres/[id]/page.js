"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronUp, Trash2, Heart} from "lucide-react"; // Import des icônes

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    try {
      return JSON.parse(parts.pop().split(';').shift()); // Parse le JSON du cookie
    } catch (error) {
      console.error("Erreur lors du parsing du cookie :", error);
      return null;
    }
  }
  return null;
}

export default function OffreDetail() {
  const { id } = useParams();
  const [offre, setOffre] = useState(null);
  const [error, setError] = useState(null);
  const [showMessageField, setShowMessageField] = useState(false); // État pour afficher/masquer le champ de message
  const [uploadedFile, setUploadedFile] = useState(null); // État pour gérer le fichier téléchargé
  const [isWishlisted, setIsWishlisted] = useState(false); // État pour gérer le statut de la wishlist
  const [user, setUser] = useState({ nom: "", prenom: "", email: "", id: null }); // Ajout de l'ID utilisateur

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

  const handleWishlistToggle = async () => {
    const userCookie = getCookie("user"); // Récupère directement le cookie
    console.log("Cookie utilisateur dans handleWishlistToggle :", userCookie);
  
    if (!userCookie || !userCookie.id) {
      console.warn("Utilisateur non connecté.");
      return;
    }
  
    try {
      const url = isWishlisted
        ? "http://localhost:8000/index.php?route=remove_from_wishlist" // URL pour retirer de la wishlist
        : "http://localhost:8000/index.php?route=add_to_wishlist"; // URL pour ajouter à la wishlist
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offre_id: id,
          utilisateur_id: userCookie.id,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      // Inverse le statut de la wishlist après une requête réussie
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la wishlist :", error);
    }
  };

  // Récupération des informations utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      const userCookie = getCookie("user"); // Remplacez "user" par le nom exact de votre cookie
  
      if (userCookie && userCookie.id) {
        const userId = userCookie.id; // Récupère l'ID utilisateur
  
        try {
          const res = await fetch(`http://localhost:8000/api/user/${userId}`); // URL de l'API utilisateur
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          setUser({
            nom: data.utilisateur_nom,
            prenom: data.utilisateur_prenom,
            email: data.utilisateur_email,
          }); // Stocke les informations utilisateur
        } catch (error) {
          console.error("Erreur lors de la récupération des informations utilisateur :", error);
        }
      } else {
        console.warn("Aucun ID utilisateur trouvé dans le cookie.");
      }
    };

    const fetchWishlistStatus = async () => {
      const userCookie = getCookie("user");
  
      if (!userCookie || !userCookie.id) {
        console.warn("Utilisateur non connecté.");
        return;
      }
  
      try {
        const response = await fetch(
          `http://localhost:8000/index.php?route=wishlist_status&offre_id=${id}&utilisateur_id=${userCookie.id}`
        );
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
  
        const data = await response.json();
        setIsWishlisted(data.isWishlisted); // Met à jour l'état en fonction de la réponse du backend
      } catch (error) {
        console.error("Erreur lors de la récupération du statut de la wishlist :", error);
      }
    };

    fetchUser();
    fetchWishlistStatus();

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
      <h1 className="title">
          {offre.offre_titre} - {offre.entreprise_nom}
          <button
  className="wishlist-button"
  onClick={handleWishlistToggle}
>
  {isWishlisted ? (
    <>
      <Heart color="red" size={20} />
      Retirer de la wishlist
    </>
  ) : (
    <>
      <Heart size={20} />
      Ajouter à la wishlist
    </>
  )}
</button>
        </h1>
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
          <br/>
          <h3>Résumé de l'offre</h3>
          <ul className="skills" itemProp="qualifications">
            <li>Durée : {calculateDuration(offre.offre_date_debut, offre.offre_date_fin)}</li>
            <li>Niveau d'études : {offre.offre_niveau_etude_minimal}</li>
            <li>Domaines : {offre.entreprise_domaine}</li>
            <li>Expérience requise : {offre.offre_experience_requise}</li>
          </ul>
          <br/><br/>
        </article>
        <form>
        <label className="form-text">Nom<br/>
          <input 
            className="form-input" 
            name="nom" 
            type="text" 
            placeholder="Votre nom" 
            value={user.nom} // Prérempli avec le nom de l'utilisateur
            readOnly
          />
        </label><br/><br/>
        <label className="form-text">Prénom<br/>
          <input 
            className="form-input" 
            name="prenom" 
            type="text" 
            placeholder="Votre prénom" 
            value={user.prenom} // Prérempli avec le prénom de l'utilisateur
            readOnly
          />
        </label><br/><br/>
        <label className="form-text">Courriel<br/>
          <input 
            className="form-input" 
            name="courriel" 
            type="email"
            placeholder="Votre adresse e-mail"
            value={user.email} // Prérempli avec l'email de l'utilisateur
            readOnly
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
    
    <p className="subline">Poids max 2Mo <br/> Formats .pdf, .doc, .docx, .odt, .rtf, .jpg ou .png</p>
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
              <label className="form-text">Message au recruteur<br/>
                <textarea 
                  className="form-input" 
                  name="message" 
                  placeholder="Votre message au recruteur (facultatif)" 
                  rows="4"
                />
              </label>
            </div>
          )}
          
          <br/><br/>
          <button 
            className="apply-button" 
            type="submit"
          >
            Postuler maintenant
          </button>
        </form>
        <p className="subline">En cliquant sur "Postuler", vous acceptez les <a href="/CGU">CGU</a> et déclarez avoir pris connaissance de la <a href="/MentionsLegales">politique de la protection des données</a> de notre site.</p>
      </div>
      <br/>
      <img className="assets" src="/Assets/separateur-w2b.png" />
    </div>
  );
}