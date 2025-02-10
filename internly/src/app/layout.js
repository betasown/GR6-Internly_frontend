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
            
            <nav>
              <div className="nav-right">
                <a href="/">Accueil</a>
                <a href="/Entreprises">Nos partenaires</a>
                <a href="/Offres">Trouver un stage</a>
                <a href="/Inscription" >S'inscrire</a>
                <a href="/Connexion" className="connect-btn">Se connecter</a>
              </div>
            </nav>
          </header>
        </div>
        
          {children}

          <footer>
            <br/>
            <hr/>
            <h1 className="Titre">Internly</h1>
            <p className="Paragraphe">&copy;2025 - Tous droits réservés</p>
            <em><a href="/MentionsLegales">Mentions Légales</a></em>&nbsp;-&nbsp;
            <em><a href="/CGU">Conditions Générales d'Utilisation</a></em>&nbsp;-&nbsp;
            <em><a href="/">Github du projet</a></em>
          </footer>
        </body>
    </html>
  );
}

