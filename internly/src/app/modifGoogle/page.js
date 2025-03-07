"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ModifEntreprise = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    email: '',
    telephone: '',
    domaine: '',
    adresse: {
      numeroRue: '',
      nomRue: '',
      ville: '',
      codePostal: ''
    }
  });

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('adresse.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        adresse: {
          ...formData.adresse,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSave = () => {
    // Logic to save the form data
    router.push('/Google');
    console.log('Form data saved:', formData);
  };

  const handleQuit = () => {
    setShowConfirmPopup(true);
  };

  const handleConfirmQuit = () => {
    // Logic to quit the modification
    setShowConfirmPopup(false);
    router.push('/Google');
  };

  const handleCancelQuit = () => {
    setShowConfirmPopup(false);
  };

  return (
    <div className="form-container">
      <h1 className='title'>Modification</h1>
      <form>
        <div className="form-group">
          <label>Nom:</label>
          <input type="text" name="nom" value={formData.nom} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>Email de contact:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Téléphone de contact:</label>
          <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Domaine d'activité:</label>
          <input type="text" name="domaine" value={formData.domaine} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Adresse:</label>
          <input type="text" name="adresse.numeroRue" placeholder="Numéro de rue" value={formData.adresse.numeroRue} onChange={handleChange} />
          <input type="text" name="adresse.nomRue" placeholder="Nom de rue" value={formData.adresse.nomRue} onChange={handleChange} />
          <input type="text" name="adresse.ville" placeholder="Ville" value={formData.adresse.ville} onChange={handleChange} />
          <input type="text" name="adresse.codePostal" placeholder="Code postal" value={formData.adresse.codePostal} onChange={handleChange} />
        </div>
        <div className="button-group">
          <button type="button" className="save-button" onClick={handleSave}>Sauvegarder</button>
          <button type="button" className="quit-button" onClick={handleQuit}>Quitter</button>
        </div>
      </form>

      {showConfirmPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Êtes-vous sûr de vouloir quitter la modification ?</p>
            <button onClick={handleConfirmQuit}>Oui</button>
            <button onClick={handleCancelQuit}>Non</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifEntreprise;