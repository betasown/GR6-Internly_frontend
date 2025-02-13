'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Données soumises:', formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <p className="Paragraphe">Prêt pour vous</p>
      <h1 className="Titre">CONNECTER</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm" htmlFor="nom">Nom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm" htmlFor="prenom">Prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>
        <a href="/"
          className="JoinButton">
          NOUS REJOINDRE
        </a>
      </form>
    </div>
  );
}
