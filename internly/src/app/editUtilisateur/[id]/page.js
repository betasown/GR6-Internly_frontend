"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";

const EditUtilisateur = () => {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    statut: "",
  });

  const [errors, setErrors] = useState({
    email: "",
  });

  const [showUpdatePopup, setShowUpdatePopup] = useState(false); // Popup de succès
  const [showErrorPopup, setShowErrorPopup] = useState(false); // Popup d'erreur

  useEffect(() => {
    const fetchUtilisateur = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/user/${id}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        setFormData({
          nom: data.utilisateur_nom,
          prenom: data.utilisateur_prenom,
          email: data.utilisateur_email,
          statut: data.utilisateur_statut,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        alert("Impossible de récupérer les données de l'utilisateur.");
      }
    };

    if (id) {
      fetchUtilisateur();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mettre à jour les données du formulaire
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validation dynamique pour l'email
    if (name === "email") {
      let emailRegex;
      if (formData.statut === "pilote") {
        emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@cesi\.fr$/; // RegEx pour pilote
      } else if (formData.statut === "etudiant") {
        emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@viacesi\.fr$/; // RegEx pour étudiant
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        email: emailRegex && emailRegex.test(value)
          ? ""
          : `Veuillez entrer une adresse email valide`,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/index.php?route=update_user&id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setShowUpdatePopup(true); // Afficher la popup de succès
      } else {
        setShowErrorPopup(true); // Afficher la popup d'erreur
      }
    } catch (error) {
      console.error("Erreur :", error);
      setShowErrorPopup(true); // Afficher la popup d'erreur
    }
  };

  return (
    <div className="form-container">
      <button
        className="close-button"
        onClick={() => {
          // Lire le cookie et parser le JSON pour récupérer le statut
          const userCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("user")) // Remplacez "user=" par le nom exact du cookie
            ?.split("=")[1];

          if (userCookie) {
            const user = JSON.parse(decodeURIComponent(userCookie)); // Décoder et parser le JSON
            const userStatut = user.status;

            // Redirection conditionnelle en fonction du statut
            if (userStatut === "admin") {
              router.push("/gestionUtilisateur");
            } else if (userStatut === "pilote") {
              router.push("/gestionEtudiant");
            } else {
              alert("Rôle inconnu, redirection par défaut.");
              router.push("/"); // Redirection par défaut si le rôle est inconnu
            }
          } else {
            alert("Impossible de déterminer le rôle de l'utilisateur.");
            router.push("/"); // Redirection par défaut
          }
        }}
        aria-label="Fermer"
      >
        <X size={24} />
      </button>
      <h1 className="title">Modifier un utilisateur</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="prenom">Prénom</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <button type="submit" className="apply-button">Mettre à jour</button>
      </form>

      {showUpdatePopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Utilisateur mis à jour avec succès !</p>
            <button
              onClick={() => {
                setShowUpdatePopup(false);

                // Lire le cookie et parser le JSON pour récupérer le statut
                const userCookie = document.cookie
                  .split("; ")
                  .find((row) => row.startsWith("user"))
                  ?.split("=")[1];

                if (userCookie) {
                  const user = JSON.parse(decodeURIComponent(userCookie));
                  const userStatut = user.status;

                  // Redirection conditionnelle en fonction du statut
                  if (userStatut === "admin") {
                    router.push("/gestionUtilisateur");
                  } else if (userStatut === "pilote") {
                    router.push("/gestionEtudiant");
                  } else {
                    router.push("/"); // Redirection par défaut
                  }
                } else {
                  router.push("/"); // Redirection par défaut
                }
              }}
              className="popup-confirm-button"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Une erreur est survenue lors de la mise à jour de l'utilisateur.</p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="popup-close-button"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUtilisateur;