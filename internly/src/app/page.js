import Image from "next/image";

export default function Home() {
  return (
    <div>
      <img className="HP-Background" src="/Assets/HP-Background.png"/>

      {
      /*_____________________________________________________________________*/
      /*                            STRAT - A PROPOS                         */
      /*_____________________________________________________________________*/
      }
      <div className="HP_STRAT1-APropos">

        <p className="Paragraphe">A prospos de</p>
        <h1 className="Titre">Internly</h1>
      
      

        <div className="HP-TrapezContainer">

          <div className="HP-Trapez_v2"><h1></h1></div>
          <div className="HP-Trapez_v1"><h1></h1></div>
          <div className="HP-Trapez_v2"><h1></h1></div>

          <div className="HP-ContentTrapez_v1">
            <h1 className="Titre">+2K</h1>
            <p className="Paragraphe">Etudiants</p>
          </div>

          <div className="HP-ContentTrapez_v2">
            <h1 className="Titre">+80K</h1>
            <p className="Paragraphe">Offres</p>
          </div>

          <div className="HP-ContentTrapez_v1">
            <h1 className="Titre">+390</h1>
            <p className="Paragraphe">Entreprises</p>
          </div>

          <div className="HP-Trapez_v2"><h1></h1></div>
          <div className="HP-Trapez_v1"><h1></h1></div>
          <div className="HP-Trapez_v2"><h1></h1></div>

        </div>
      </div>


      {
      /*_____________________________________________________________________*/
      /*                            STRAT - DOMAINES                         */
      /*_____________________________________________________________________*/
      }

      <p className="Paragraphe">Découvrir les principaux</p>
      <h1 className="Titre">Domaines</h1>
      
      <div className="HP-TrapezContainer">

        <div className="HP-Trapez_v2">
          <h1 className="Titre"></h1>
        </div>

        <div className="HP-ContentTrapez_v1">
          <h1 className="Titre">IT</h1>
        </div>

        <div className="HP-ContentTrapez_v2">
          <h1 className="Titre">BTP</h1>
        </div>

        <div className="HP-ContentTrapez_v1">
          <h1 className="Titre">Cyber</h1>
        </div>

        <div className="HP-Trapez_v2">
          <h1 className="Titre"></h1>
        </div>
      </div>

      <a href="/" title="Découvrir les domaines">Afficher tous les domaines</a>


      {
      /*_____________________________________________________________________*/
      /*                          STRAT - ENTREPRISES                        */
      /*_____________________________________________________________________*/
      }

      <p className="Paragraphe">Ils nous font</p>
      <h1 className="Titre">Confiance</h1>
      
      <div className="HP-TrapezContainer">
        <div className="HP-ContentTrapez_v1">
          <h1 className="Titre">Apple</h1>
        </div>

        <div className="HP-ContentTrapez_v2">
          <h1 className="Titre">Nvidia</h1>
        </div>

        <div className="HP-ContentTrapez_v1">
          <h1 className="Titre">Google</h1>
        </div>
      </div>

      <a href="/" title="Découvrir les entreprises">Afficher toutes les entreprises</a>


    </div>
  );
}
