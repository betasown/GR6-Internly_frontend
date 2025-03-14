"use client";
import React, { useEffect, useState } from "react";

export default function EntreprisesPage() {
  const [entreprises, setEntreprises] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Nombre d'éléments par page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/index.php?route=entreprise");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setEntreprises(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = entreprises.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(entreprises.length / itemsPerPage);

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

        <div className="container-cards-container">
          {error ? (
            <p>Erreur: {error}</p>
          ) : (
            currentItems.length > 0 ? (
              currentItems.map((entreprise, index) => (
                <div key={index} className="cards-container">
                  <div className="info-card">
                    <div className="title">{entreprise.entreprise_nom}</div>
                  </div>
                </div>
              ))
            ) : (
              <p>Aucune entreprise trouvée</p>
            )
          )}
        </div>

        <div className="pagination">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
        </div>
      </div>

      <img className="assets" src="/Assets/separateur-w2b.png" />
    </div>
  );
}