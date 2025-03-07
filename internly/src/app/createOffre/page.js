"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateOffre = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    entreprise: '',
    competences: '',
    remuneration: '',
    dateDebut: '',
    dateFin: ''
  });

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    // Logic to save the form data
    console.log('Form data saved:', formData);
    router.push('/offres');
  };

  const handleQuit = () => {
    setShowConfirmPopup(true);
  };

  const handleConfirmQuit = () => {
    // Logic to quit the creation
    setShowConfirmPopup(false);
    router.push('/offres');
  };

  const handleCancelQuit = () => {
    setShowConfirmPopup(false);
  };

  return (
    <div className="form-container">
      <h1 className='title'>Créer une offre</h1>
      <form>
        <div className="form-group">
          <label>Titre:</label>
          <input type="text" name="titre" value={formData.titre} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>Entreprise:</label>
          <input type="text" name="entreprise" value={formData.entreprise} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Compétences:</label>
          <input type="text" name="competences" value={formData.competences} onChange={handleChange} placeholder="Séparées par des virgules" />
        </div>
        <div className="form-group">
          <label>Rémunération:</label>
          <input type="text" name="remuneration" value={formData.remuneration} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Date de début:</label>
          <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Date de fin:</label>
          <input type="date" name="dateFin" value={formData.dateFin} onChange={handleChange} />
        </div>
        <div className="button-group">
          <button type="button" className="save-button" onClick={handleSave}>Sauvegarder</button>
          <button type="button" className="quit-button" onClick={handleQuit}>Quitter</button>
        </div>
      </form>

      {showConfirmPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Êtes-vous sûr de vouloir quitter la création ?</p>
            <button onClick={handleConfirmQuit}>Oui</button>
            <button onClick={handleCancelQuit}>Non</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOffre;