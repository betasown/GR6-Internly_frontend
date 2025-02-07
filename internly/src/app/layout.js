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
        <header>

          <div id="nav-left">
            <img src="/icon-Internly.png" alt="LogoInternly"/>
          </div>

          <nav>
            <div className="nav-right">
              <a href="/" title="Accueil">Accueil</a>&nbsp;&nbsp;&nbsp;
              <a href="/Entreprises" title="Nos partenaires">Nos partenaires</a>&nbsp;&nbsp;&nbsp;
              <a href="/Offres" title="Trouver un stage">Trouver un stage</a>&nbsp;&nbsp;&nbsp;
              <a href="/Inscription" title="S'inscrire">S'inscrire</a>&nbsp;&nbsp;&nbsp;
              <a href="/Connexion" title="Se connecter">Se connecter</a>
            </div>
          </nav>
        <hr/>
        </header>
        
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

