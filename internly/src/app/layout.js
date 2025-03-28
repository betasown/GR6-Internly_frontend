"use client";
import "./globals.css";
import { useEffect, useState } from "react";
import { User, ArrowUp } from "lucide-react"; // Importer l'icône "User" depuis Lucide React";

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userStatus, setUserStatus] = useState(null); // Stocke le statut de l'utilisateur
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const userCookie = document.cookie.split("; ").find((row) => row.startsWith("user="));
    if (userCookie) {
      const user = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
      setIsLoggedIn(true);
      setUserStatus(user.status); // Récupère le statut de l'utilisateur
    } else {
      setIsLoggedIn(false);
      setUserStatus(null);
    }

    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAccountClick = () => {
    if (userStatus === "admin") {
      window.location.href = "/dashboardAdmin";
    } else if (userStatus === "pilote") {
      window.location.href = "/dashboardPilote";
    } else if (userStatus === "etudiant") {
      window.location.href = "/dashboardEtudiant";
    } else {
      alert("Statut utilisateur inconnu. Veuillez contacter l'administrateur.");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <html lang="fr">
      <body>
        <div className="image-container">
          <header>
            <nav className="navbar-desktop-only">
              <div className="nav-right">
                <a href="/">Accueil</a>
                <a href="/entreprise">Partenaires</a>
                <a href="/offres">Offres</a>
                {/* Afficher le bouton "Se connecter" uniquement si l'utilisateur n'est pas connecté */}
                {!isLoggedIn && <a href="/connexion" className="connect-btn">Se connecter</a>}
                {/* Afficher le bouton "Mon compte" avec une icône si l'utilisateur est connecté */}
                {isLoggedIn && (
                  <button onClick={handleAccountClick} className="connect-btn">
                    <User size={20} />
                  </button>
                )}
              </div>
            </nav>
          </header>
        </div>

        <main>{children}</main>

        {showScroll && (
          <button className="scroll-to-top" onClick={scrollToTop}>
            <ArrowUp size={24} />
          </button>
        )}

        <footer>
          <br />
          <h1 className="title">Internly</h1>
          <p className="paragraphe">&copy;2025 - Tous droits réservés</p>
          <em>
            &nbsp;-&nbsp;<a href="/MentionsLegales">Mentions Légales</a>
          </em>
          &nbsp;-&nbsp;
          <em>
            <a href="/MentionsLegales">Conditions Générales d'Utilisation</a>
          </em>
          &nbsp;-&nbsp;
          <em className="sub-mobile">
            <a href="https://github.com/betasown/GR6-Internly_frontend">Github du projet</a>&nbsp;-&nbsp;
          </em>
        </footer>
      </body>
    </html>
  );
}