'use client';
import { useState } from 'react';

export default function Home() {
  // État initial
  const initialFormData = {
    civilite: 'Madame',
    nom: '',
    prenom: '',
    courriel: '',
    permisB: false,
    vehicule: false,
    certifications: false,
    majeur: '',
    message: '',
    cv: null,
	cvName: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('');
  

  // Validation email en temps réel
  const validateEmail = (email) => {
	const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return reg.test(email);
  };

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Pour les checkboxes
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }

    // Pour le champ email, validation en temps réel
    if (name === 'courriel') {
      if (value && !validateEmail(value)) {
        setErrors(prev => ({
          ...prev,
          courriel: 'Format d\'email invalide'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          courriel: ''
        }));
      }
    }

    // Pour le nom, conversion en majuscules
    const newValue = name === 'nom' ? value.toUpperCase() : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // Gestion du fichier CV
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.odt', '.rtf', '.jpg', '.png'];
    
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          cv: 'Le fichier doit être inférieur à 2 Mo'
        }));
        return;
      }

      const extension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        setErrors(prev => ({
          ...prev,
          cv: 'Format de fichier non autorisé'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        cv: file,
		    cvName: file.name
      }));
      setErrors(prev => ({
        ...prev,
        cv: ''
      }));
    }
  };

  // Suppression du fichier CV
  const handleRemoveCV = () => {
	setFormData(prev => ({
	  ...prev,
	  cv: null,
	  cvName: ''
	}));
	// Réinitialiser l'input file
	const fileInput = document.querySelector('input[type="file"]');
	if (fileInput) {
	  fileInput.value = '';
	}
  };

  // Réinitialisation du formulaire
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitStatus('');
    // Réinitialiser le champ de fichier
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validation des champs requis
    if (!formData.nom) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom) newErrors.prenom = 'Le prénom est requis';
    if (!formData.message) newErrors.message = 'Le message est requis';
    if (!formData.courriel) { newErrors.courriel = 'Le courriel est requis';} 
	else if (!validateEmail(formData.courriel)) { newErrors.courriel = 'Format d\'email invalide';}

    setErrors(newErrors);

    // Si pas d'erreurs, traiter le formulaire
    if (Object.keys(newErrors).length === 0) {
	  handleReset();
      setSubmitStatus('Formulaire envoyé avec succès !');
      console.log('Données du formulaire:', formData);

	  setTimeout(() => { setSubmitStatus(''); }, 5000);


    } else {
      setSubmitStatus('Veuillez corriger les erreurs.');
    }
  };

  return (
	<div>
        <div className="slide-offres-detail-container">
		    <h1 className="title">Stage Administrateur Système et Réseau H/F - IBM Pornichet</h1>
			
		    <p>
            Découvrez notre offre de stage en administration système et réseau chez IBM à Pornichet. 
            Complétez le formulaire ci-dessous pour postuler directement à cette opportunité.
            </p>
			
			<article itemScope itemType="http://schema.org/JobPosting">
				<meta itemProp="datePosted" content="2025-01-23" />
				<meta itemProp="industry" content="Information Technology" />
				<meta itemProp="employmentType" content="INTERN" />
				
				<p className="subline">
					<span itemProp="hiringOrganization">IBM</span>&nbsp;|&nbsp;
					<span itemProp="jobLocation">Pornichet - 44</span>&nbsp;|&nbsp;
					<time dateTime="2025-01-23">Publiée le 23/01/2025</time>&nbsp;|&nbsp;
					<span>Ref. 123XYZ-44</span>
				</p>

                <br></br>
				
				<h3>Résumé de l'offre</h3>
				<ul className="skills" itemProp="qualifications">
					<li>Durée : 3 mois</li>
					<li>Niveau d'études : Bac +2, Bac +3</li>
					<li>Domaines : Systèmes, Réseaux, Cloud</li>
					<li>Expérience requise : - 1 an</li>
				</ul>
                <br></br><br></br>
			</article>

		<form onSubmit={handleSubmit} onReset={handleReset}>
        	{submitStatus && (
          		<div className={`submit-status ${submitStatus.includes('succès') ? 'success' : 'error'}`}> {submitStatus}
          		</div>
        	)}

        <label className="form-text">Civilité<br />
          <select 
            className="form-input" 
            name="civilite"
            value={formData.civilite}
            onChange={handleChange}
          >
            <option>Madame</option>
            <option>Monsieur</option>
            <option>Autres</option>
          </select>
        </label><br /><br />

        <label className="form-text">Nom<br />
          <input 
            className={`form-input ${errors.nom ? 'error-input' : ''}`} 
            name="nom"
            type="text" 
            value={formData.nom}
            onChange={handleChange}
            required 
          />
        </label>
        {errors.nom && <p className="error-message">{errors.nom}</p>}
        <br /><br />

        <label className="form-text">Prénom<br />
          <input 
            className={`form-input ${errors.prenom ? 'error-input' : ''}`}
            name="prenom"
            type="text" 
            value={formData.prenom}
            onChange={handleChange}
            required 
          />
        </label>
        {errors.prenom && <p className="error-message">{errors.prenom}</p>}
        <br /><br />

        <label className="form-text">Courriel<br />
          <input 
            className={`form-input ${errors.courriel ? 'error-input' : ''}`} 
            name="courriel"
            type="email" 
            value={formData.courriel}
            onChange={handleChange}
            required 
          />
        </label>
        {errors.courriel && <p className="error-message">{errors.courriel}</p>}
        <br /><br />

        <label className="form-text">A propos de vous</label><br />
        <input 
          type="checkbox" 
          name="permisB" 
          checked={formData.permisB}
          onChange={handleChange}
        />Permis B<br />      
        <input 
          type="checkbox" 
          name="vehicule" 
          checked={formData.vehicule}
          onChange={handleChange}
        />Véhiculé<br />      
        <input 
          type="checkbox" 
          name="certifications" 
          checked={formData.certifications}
          onChange={handleChange}
        />Certifications(s) (Microsoft, Cisco...)<br />      
        <br /><br />

        <label className="form-text">Je suis majeur</label>
        &nbsp;<input 
          type="radio" 
          name="majeur" 
          value="yes"
          checked={formData.majeur === 'yes'}
          onChange={handleChange}
        />Oui
        &nbsp;<input 
          type="radio" 
          name="majeur" 
          value="no"
          checked={formData.majeur === 'no'}
          onChange={handleChange}
        />Non
        <br /><br />

        <label className="form-text">Votre message au recruteur<br />
          <textarea 
            className={`form-input ${errors.message ? 'error-input' : ''}`}
            name="message" 
            rows="5" 
            cols="100"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </label>
        {errors.message && <p className="error-message">{errors.message}</p>}
        <br /><br />

        <label className="form-text">CV</label>
          <div className="cv-container">
            {formData.cv ? (
            // Affichage du fichier sélectionné
            <div className="cv-info">
              <div className="cv-name">
                {formData.cvName}
              </div>
              <div className="cv-action">
                <button type="button" onClick={handleRemoveCV} className="remove-file">
                  Supprimer
                </button>
              </div>
            </div>
            ) : (
            // Bouton pour choisir un fichier
            <div className="cv-upload">
              <label className="apply-button">Choisir un fichier
                <input type="file" accept=".pdf,.doc,.docx,.odt,.rtf,.jpg,.png" onChange={handleFileChange} hidden />
              </label>
            </div>
            )}
          </div>
          <p className="subline">Poids max 2Mo <br /> Formats .pdf, .doc, .docx, .odt, .rtf, .jpg ou .png</p>

        <button className="apply-button" type="submit">Postuler</button>&nbsp;
        <input className="reinitialiser" type="reset" value="Réinitialiser" />

        <p className="subline">En cliquant sur "Postuler", vous acceptez les <a href="/CGU">CGU</a> et déclarez avoir pris connaissance de la <a href="/MentionsLegales">politique de la protection des données</a> de notre site.</p>
      </form>
    </div>
    <br></br>

    <img className="assets" src="/Assets/separateur-w2b.png"/>
    </div>
  );
}