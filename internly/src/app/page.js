import Image from "next/image";


export default function Home() {

  return (
    <div>
      {
      /*_____________________________________________________________________*/
      /*                            STRAT - FIRST PICS                       */
      /*_____________________________________________________________________*/
      }

      <img className="hero-image" src="/Assets/hero-image.png"/>

      {
      /*_____________________________________________________________________*/
      /*                            STRAT - A PROPOS                         */
      /*_____________________________________________________________________*/
      }
      <div className="slide-statistiques-container">
        <div className="title-container">
          <p className="Paragraphe">A prospos de</p>
          <h1 className="title">Internly</h1>
        </div>

        <div className="cards-container">
          <div className="info-card">
            <div className="title">+2k</div>
            <div className="Text">Etudiants</div>
          </div>

          <div className="info-card">
            <div className="title">+80k</div>
            <div className="Text">Offres</div>
          </div>

          <div className="info-card">
            <div className="title">+390</div>
            <div className="Text">Entreprises</div>
          </div>
        </div>
      </div>

      <img className="assets" src="/Assets/separateur-b2w.png"/>

      {
      /*_____________________________________________________________________*/
      /*                            STRAT - DOMAINES                         */
      /*_____________________________________________________________________*/
      }
      <div className="slide-domaines-container">
        <div className="title-container">
          <p className="paragraphe">Découvrir les principaux</p>
          <h1 className="title">Domaines</h1>
        </div>

        <div className="container-cards-container">
          <div className="cards-container">
            <div className="info-card"><div className="title">Web</div></div>
            <div className="info-card"><div className="title">BTP</div></div>
            <div className="info-card"><div className="title">Sécurité</div></div>
          </div>
          <div className="cards-container">
            <div className="info-card"><div className="title">Finance </div></div>
            <div className="info-card"><div className="title">Commerce </div></div>
            <div className="info-card"><div className="title">Santé</div></div>
          </div>
          <div className="cards-container sub-mobile">
            <div className="info-card"><div className="title">Design</div></div>
            <div className="info-card"><div className="title">Data</div></div>
            <div className="info-card"><div className="title">Louistiti</div></div>
          </div>
        </div>

        <div className="container-cta">
          <a className="connect-btn" href="/" title="Découvrir les domaines">Afficher tous les domaines</a>
        </div>
      </div>

      <img className="assets" src="/Assets/separateur-w2b.png"/>

    </div>
  );
}
