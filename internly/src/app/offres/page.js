"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const [offres, setOffres] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Nombre d'éléments par page
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:8000/index.php?route=offers_display');
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
    }, []);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = offres.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(offres.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0); // Remettre la position de défilement en haut de la page
        }
    };

    return (
        <div>
            <div className="slide-offres-container">
                <div className="title-container">
                    <div className="title-text">
                        <p className="paragraphe">Découvrir nos</p>
                        <h1 className="title">Offres</h1>
                    </div>
                </div>
                <button 
                    className="create-offer-button"
                    onClick={() => router.push('/createOffre')}
                >
                    <span className="button-text">Créer une offre</span>
                    <span className="button-icon">+</span>
                </button>
            </div>

            <div className="container-cards-container">
                <div className="offer-container">
                    {error ? (
                        <p>Erreur: {error}</p>
                    ) : (
                        currentItems.length > 0 ? (
                            currentItems.map((offre, index) => (
                                <div key={index} className="offer-card">
                                    <div className="titre">{offre.titre_offre}</div>
                                    <div className="entreprise">{offre.entreprise}</div>
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
                </div>
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

            <img className="assets" src="/Assets/separateur-w2b.png"/>
        </div>
    );
}