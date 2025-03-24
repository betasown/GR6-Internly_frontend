"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [stats, setStats] = useState({
    students: 0,
    offers: 0,
    entreprises: 0,
  });
  const [offres, setOffres] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Nombre d'éléments par page
      const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [studentsRes, offersRes, entreprisesRes] = await Promise.all([
          fetch('http://localhost:8000/index.php?route=users&count=students'),
          fetch('http://localhost:8000/index.php?route=offers&count=offers'),
          fetch('http://localhost:8000/index.php?route=entreprise&count=entreprises'),
        ]);

        const studentsData = await studentsRes.json();
        const offersData = await offersRes.json();
        const entreprisesData = await entreprisesRes.json();

        setStats({
          students: studentsData.student_count,
          offers: offersData.offer_count,
          entreprises: entreprisesData.entreprise_count,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }

    const fetchData = async () => {
      try {
          const res = await fetch('http://localhost:8000/index.php?route=offers&recent=true');
          if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          const offresWithCompetencesArray = data.map(offre => ({
              ...offre,
              competences: typeof offre.competences === 'string' ? offre.competences.split(', ') : []
          }));
          setOffres(offresWithCompetencesArray);
      } catch (error) {
          setError(error.message);
      }
  };
    fetchData();
    fetchStats();
  }, []);

  return (
    <div>
      {/*_____________________________________________________________________*/}
      {/*                            STRAT - FIRST PICS                       */}
      {/*_____________________________________________________________________*/}
      <div className="heroContainer">
        <img className="hero-image" src="/Assets/hero-image.png"/>
        <div className="heroText">
          <h1 className="title">Bienvenue sur Internly</h1>
          <p className="Paragraphe">La plateforme dédiée à la recherche de stages pour les étudiants. Découvrez des offres variées et postulez en ligne pour trouver le stage qui correspond à vos aspirations. Prêt à faire le grand saut ? </p>
          <div className="container-btn">
            <a className="connect-btn" href="/offres" title="Découvrir les offres">Trouver mon stage</a>
          </div>
        </div>
      </div>

      {/*_____________________________________________________________________*/}
      {/*                            STRAT - A PROPOS                         */}
      {/*_____________________________________________________________________*/}
      <div className="slide-statistiques-container">
        <div className="title-container">
          <p className="Paragraphe">A propos de</p>
          <h1 className="title">Internly</h1>
        </div>

        <div className="container-cards-container">
        <div className="cards-container">
          <div className="info-card">
            <div className="title">+{stats.offers} <div className="Paragraphe">Offres</div></div>
          </div>
        </div>

        <div className="cards-container">
          <div className="info-card">
            <div className="title">+{stats.students} <div className="Paragraphe">Étudiants</div></div>
          </div>
        </div>

        <div className="cards-container">
          <div className="info-card">
            <div className="title">+{stats.entreprises} <div className="Paragraphe">Entreprises</div></div>
          </div>
        </div>
        </div>
      </div>

      <img className="assets" src="/Assets/separateur-b2w.png"/>

      {/*_____________________________________________________________________*/}
      {/*                            STRAT - DOMAINES                         */}
      {/*_____________________________________________________________________*/}

      <div className="title-container">
          <p className="paragraphe">Découvrir les Offres</p>
          <h1 className="title">les plus récentes</h1>
        </div>

      <div className="container-cards-container">
                <div className="offer-container">
                    {error ? (
                        <p>Erreur: {error}</p>
                    ) : (
                        offres.length > 0 ? (
                            offres.map((offre, index) => (
                                <div key={index} className="offer-card">
                                    <div className="titre">{offre.entreprise_nom} - {offre.offre_titre}</div>
                                    <div className="entreprise">{offre.ville_code_postal}, {offre.ville_nom}</div>
                                    <div className="competences">
                                        {offre.competences.length > 0 ? (
                                            offre.competences.map((competence, i) => (
                                                <span key={i} className="competence-pill">{competence}</span>
                                            ))
                                        ) : (
                                            <span className="competence-pill">Aucune compétence spécifiée</span>
                                        )}
                                    </div>
                                    <button 
                                        className="apply-button" 
                                        onClick={() => router.push(`/offres/${offre.offre_id}`)}
                                    >
                                        Candidater
                                    </button>
                                    
                                </div>
                            ))
                        ) : (
                            <p>Aucune offre trouvée</p>
                        )
                    )}
                <div className="container-btn">
                  <a className="connect-btn" href="/offres" title="Découvrir les offres">Découvrir les offres</a>
                </div>
                </div>
                
            </div>

      <img className="assets" src="/Assets/separateur-w2b.png"/>
    </div>
  );
}