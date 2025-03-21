import "./globals.css";




export const metadata = {
  title: "Internly - Trouver le stage de vos rêves",
  description: "Internly est le meilleur site d'annonces en ligne pour trouver le stage de vos rêves. Postulez dès maintenant !",
  charset: "utf-8",
  author: "Robin Noiret",
  keywords: "Stage, Emploi, Offre, Annonce, Entreprise, Candidat, Postuler",
  robots: "index, follow",
  openGraph: {
    title: "Internly - Trouver le stage de vos rêves",
    description: "Internly est le meilleur site d'annonces en ligne pour trouver le stage de vos rêves. Postulez dès maintenant !",
  },
};


export default function RootLayout({ children }) {

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
                <a href="/connexion" className="connect-btn">Se connecter</a>
              </div>
            </nav>
          </header>
        </div>
        
          {children}

          <footer>
            <br/>
            <h1 className="title">Internly</h1>
            <p className="paragraphe">&copy;2025 - Tous droits réservés</p>
            <em>&nbsp;-&nbsp;<a href="/MentionsLegales">Mentions Légales</a></em>&nbsp;-&nbsp;
            <em><a href="/CGU">Conditions Générales d'Utilisation</a></em>&nbsp;-&nbsp;
            <em className="sub-mobile"><a href="/">Github du projet</a>&nbsp;-&nbsp;</em>
          </footer>
        </body>
    </html>
  );
}

