"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import pour la navigation et les paramètres d'URL
import { X } from "lucide-react"; // Import de l'icône Lucide React

const CreateUtilisateur = () => {
  const router = useRouter(); // Hook pour gérer la navigation
  const searchParams = useSearchParams(); // Hook pour récupérer les paramètres d'URL
  const statutParam = searchParams.get("statut") || "etudiant"; // Récupérer le statut ou utiliser "etudiant" par défaut

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    statut: statutParam, // Initialiser avec le statut récupéré
    email: "",
    password: "",
  });


  const [errors, setErrors] = useState({
    email: "",
  }); // État pour les erreurs de validation
  const [showCreationPopup, setShowCreationPopup] = useState(false); // Popup de succès
  const [showErrorPopup, setShowErrorPopup] = useState(false); // Popup d'erreur

  // Vérification des droits d'accès
  useEffect(() => {
    const userCookie = document.cookie.split("; ").find((row) => row.startsWith("user="));
    if (userCookie) {
      const user = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
      if (user.status !== "admin" && user.status !== "pilote") {
        router.push("/403/"); // Redirige si l'utilisateur n'est ni admin ni pilote
      }
    } else {
      router.push("/403/"); // Redirige si l'utilisateur n'est pas connecté
    }
  }, [router]);

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
        emailRegex = /^[a-zA-Z]\.[a-zA-Z]+@cesi\.fr$/; // RegEx pour pilote
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
        "http://localhost:8000/index.php?route=create_user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShowCreationPopup(true); // Afficher la popup de succès
        console.log(data);

        // Réinitialiser les champs du formulaire sauf le statut
        setFormData({
          nom: "",
          prenom: "",
          statut: statutParam, // Conserver le statut initial
          email: "",
          password: "",
        });
      } else {
        setShowErrorPopup(true); // Afficher la popup d'erreur
      }
    } catch (error) {
      console.error("Erreur:", error);
      setShowErrorPopup(true); // Afficher la popup d'erreur
    }
  };

  return (
    <div className="form-container">
      {/* Bouton pour quitter la page */}
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

      <h1 className="title">Créer un utilisateur</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nom" className="form-text">
            Nom
            <br />
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="form-input"
              placeholder="Nom"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="prenom" className="form-text">
            Prénom
            <br />
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="form-input"
              placeholder="Prénom"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-text">
            Email
            <br />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Adresse email"
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-text">
            Mot de passe
            <br />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Mot de passe"
              required
            />
          </label>
        </div>
        <div className="button-group">
          <button type="submit" className="apply-button">
            Créer
          </button>
          <button
            type="button"
            className="reinitialiser"
            onClick={() =>
              setFormData({
                nom: "",
                prenom: "",
                statut: statutParam, // Réinitialiser avec le statut initial
                email: "",
                password: "",
              })
            }
          >
            Réinitialiser
          </button>
        </div>
      </form>

      {showCreationPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Utilisateur créé avec succès !</p>
            <button
              onClick={() => {
                setShowCreationPopup(false);

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
            <p>Une erreur est survenue lors de la création de l'utilisateur.</p>
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

export default CreateUtilisateur;