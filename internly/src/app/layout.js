"use client";

import { useEffect, useState } from "react";
import "./globals.css";
import { Menu, ArrowUp } from 'lucide-react';

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <html lang="fr">
      <body>
        <div className="image-container">
          <header>
            <nav className="navbar-desktop-only">
              <div className="nav-right">
                <a href="/">Accueil</a>
                <a href="/entreprises">Partenaires</a>
                <a href="/offres">Offres</a>
                <a href="/connexion" className="connect-btn">Se connecter</a>
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
            <a href="/CGU">Conditions Générales d'Utilisation</a>
          </em>
          &nbsp;-&nbsp;
          <em className="sub-mobile">
            <a href="/">Github du projet</a>&nbsp;-&nbsp;
          </em>
        </footer>
      </body>
    </html>
  );
}
