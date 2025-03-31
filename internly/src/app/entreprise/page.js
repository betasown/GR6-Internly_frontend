"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function EntreprisesPage() {
  const [entreprises, setEntreprises] = useState([]);
  const [filteredEntreprises, setFilteredEntreprises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [topRatedCompanies, setTopRatedCompanies] = useState([]);
  const [domainStats, setDomainStats] = useState([]);
  const itemsPerPage = 12; // Nombre d'éléments par page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/index.php?route=entreprise");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setEntreprises(data);
        setFilteredEntreprises(data); // Initialiser les entreprises filtrées
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchTopRatedCompanies = async () => {
      try {
        const res = await fetch("http://localhost:8000/index.php?route=entreprise_stats&type=top_rated");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setTopRatedCompanies(data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchDomainStats = async () => {
      try {
        const res = await fetch("http://localhost:8000/index.php?route=entreprise_stats&type=count_by_domain");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setDomainStats(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
    fetchTopRatedCompanies();
    fetchDomainStats();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = entreprises.filter((entreprise) =>
      entreprise.entreprise_nom.toLowerCase().includes(query)
    );
    setFilteredEntreprises(filtered);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEntreprises.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredEntreprises.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0); // Remettre la position de défilement en haut de la page
    }
  };

  return (
    <div>
      <div className="slide-entreprises-container">
        <div className="title-container">
          <p className="paragraphe">Découvrir les entreprises</p>
          <h1 className="title">Partenaires</h1>
        </div>

        {/* Barre de recherche */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher une entreprise par nom..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="container-cards-container">
          {error ? (
            <p>Erreur: {error}</p>
          ) : (
            currentItems.length > 0 ? (
              currentItems.map((entreprise, index) => (
                <div key={index} className="cards-container">
                  <Link href={`/entreprise/${entreprise.entreprise_id}`} className="info-card">
                    <div className="title">{entreprise.entreprise_nom}</div>
                  </Link>
                </div>
              ))
            ) : (
              <p>Aucune entreprise trouvée</p>
            )
          )}
        </div>

        <div className="pagination">
          <button onClick={() => paginate(1)} disabled={currentPage === 1}>&laquo;</button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>&raquo;</button>
        </div>
      </div>

      {/* Section Statistiques des entreprises */}
      <div className="statistics-section">
        <h1 className="title">Statistiques des Entreprises</h1>

        <div className="bento-container">
          {/* Répartition par domaine */}
          <div className="bento-item">
            <h3>Répartition par Domaine</h3>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{ width: "100%", maxWidth: "700px", height: "auto", aspectRatio: "1" }}>
                <Pie
                  data={{
                    labels: (() => {
                      const sortedDomains = domainStats
                        .map(domain => ({
                          domaine: domain.entreprise_domaine,
                          count: domain.nombre_entreprises,
                        }))
                        .sort((a, b) => b.count - a.count);

                      const topDomains = sortedDomains.slice(0, 4);
                      const otherCount = sortedDomains.slice(4).reduce((sum, domain) => sum + domain.count, 0);

                      return [...topDomains.map(domain => domain.domaine), "Autres"];
                    })(),
                    datasets: [
                      {
                        data: (() => {
                          const sortedDomains = domainStats
                            .map(domain => ({
                              domaine: domain.entreprise_domaine,
                              count: domain.nombre_entreprises,
                            }))
                            .sort((a, b) => b.count - a.count);

                          const topCounts = sortedDomains.slice(0, 4).map(domain => domain.count);
                          const otherCount = sortedDomains.slice(4).reduce((sum, domain) => sum + domain.count, 0);

                          return [...topCounts, otherCount];
                        })(),
                        backgroundColor: ["#F1F5C0", "#C6D602", "#E4EC8A", "#D0DD33", "#DBE561"],
                        hoverBackgroundColor: ["#F1F5C0", "#C6D602", "#E4EC8A", "#D0DD33", "#DBE561"],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          font: {
                            size: 14,
                          },
                        },
                      },
                    },
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Top entreprises les mieux notées */}
          <div className="bento-item">
            <h3>Top 10 des Entreprises les Mieux Notées</h3>
            <ul className="wishlist-list">
              {topRatedCompanies
                .map(company => ({
                  id: company.entreprise_id,
                  nom: company.entreprise_nom,
                  rating: parseFloat(company.moyenne_note),
                }))
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 10)
                .map((entreprise, index) => (
                  <li
                    key={entreprise.id}
                    className="wishlist-item"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="wishlist-rank">{index + 1}.</span>
                    <span className="wishlist-title">{entreprise.nom}</span>
                    <span className="wishlist-count">{entreprise.rating.toFixed(1)} étoiles</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <img className="assets" src="/Assets/separateur-w2b.png" />
    </div>
  );
}