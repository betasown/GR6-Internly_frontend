"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OffreDetail() {
  const { id } = useParams();
  const [offre, setOffre] = useState(null);
  const [error, setError] = useState(null);

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
                <label className="form-text">Civilité<br />
                    <select className="form-input" name="civilite">
                        <option>Madame</option>
                        <option>Monsieur</option>
                        <option>Autres</option>
                    </select>
                </label><br /><br />
                <label className="form-text">Nom<br />
                    <input className="form-input" name="nom" type="text" required />
                </label><br /><br />
                <label className="form-text">Prénom<br />
                    <input className="form-input" name="prenom" type="text" required />
                </label><br /><br />
                <label className="form-text">Courriel<br />
                    <input className="form-input" name="courriel" type="email" required />
                </label><br /><br />
                
                <label className="form-text">Votre message au recruteur<br />
                    <textarea className="form-input" name="message" rows="5" cols="100"></textarea>
                </label><br /><br />
                <label className="form-text">CV</label>
                <div className="cv-container">
                    <div className="cv-upload">
                        <label className="apply-button">Choisir un fichier
                            <input type="file" accept=".pdf,.doc,.docx,.odt,.rtf,.jpg,.png" hidden />
                        </label>
                    </div>
                </div>
                <p className="subline">Poids max 2Mo <br /> Formats .pdf, .doc, .docx, .odt, .rtf, .jpg ou .png</p>
                <button className="apply-button" type="submit">Postuler</button>&nbsp;
                <input className="reinitialiser" type="reset" value="Réinitialiser" />
            </form>
            <p className="subline">En cliquant sur "Postuler", vous acceptez les <a href="/CGU">CGU</a> et déclarez avoir pris connaissance de la <a href="/MentionsLegales">politique de la protection des données</a> de notre site.</p>
        </div>
        <br />
        <img className="assets" src="/Assets/separateur-w2b.png" />
    </div>
);
}