"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function calculateDurationInMonths(startDate, endDate) {
    if (!startDate || !endDate) return null; // Si une des dates est manquante, retourner null
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return months >= 0 ? months : null; // Retourner null si la durée est négative
}

export default function Page() {
    const [offres, setOffres] = useState([]);
    const [filteredOffres, setFilteredOffres] = useState([]); // État pour les offres filtrées
    const [searchQuery, setSearchQuery] = useState(""); // État pour la barre de recherche
    const [wishListStats, setWishListStats] = useState([]);
    const [durationStats, setDurationStats] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [user, setUser] = useState(null); // État pour stocker les informations utilisateur
    const itemsPerPage = 12; // Nombre d'éléments par page
    const router = useRouter();

    useEffect(() => {
        // Récupérer les informations de l'utilisateur à partir du cookie
        const userData = JSON.parse(document.cookie.split('; ').find(row => row.startsWith('user='))?.split('=')[1] || '{}');
        setUser(userData);

        // Charger les offres
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
                setFilteredOffres(offresWithCompetencesArray); // Initialiser les offres filtrées
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();

        const fetchWishListStats = async () => {
            try {
                const res = await fetch('http://localhost:8000/index.php?route=offers_stats');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setWishListStats(data); // Met à jour les statistiques des wish lists
            } catch (error) {
                setError(error.message);
            }
        };
    
        fetchWishListStats();

        const fetchDurationStats = async () => {
            try {
                const res = await fetch('http://localhost:8000/index.php?route=offers_duration');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setDurationStats(data); // Met à jour les statistiques de durée
            } catch (error) {
                setError(error.message);
            }
        };
    
        fetchDurationStats();
    }, []);

    // Fonction pour gérer la recherche
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = offres.filter((offre) =>
            offre.titre_offre.toLowerCase().includes(query)
        );
        setFilteredOffres(filtered);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOffres.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredOffres.length / itemsPerPage);

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
            </div>

            {/* Barre de recherche */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Rechercher une offre par titre..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                />
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
                            <p className="no-results-message">Aucune offre trouvée</p>
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

    <div className="statistics-section">
    <h1 className='title'>Statistiques sur les Offres</h1>

    <div className="bento-container">
        {/* Répartition par compétences */}
        <div className="bento-item">
            <h3>Répartition par Compétences</h3>
            <Pie
                data={{
                    labels: (() => {
                        const competenceCounts = offres.reduce((acc, offre) => {
                            offre.competences.forEach(competence => {
                                acc[competence] = (acc[competence] || 0) + 1;
                            });
                            return acc;
                        }, {});

                        const sortedCompetences = Object.entries(competenceCounts).sort((a, b) => b[1] - a[1]);
                        const topCompetences = sortedCompetences.slice(0, 4); // Limiter à 4 compétences
                        const otherCount = sortedCompetences.slice(4).reduce((sum, [, count]) => sum + count, 0);

                        return [...topCompetences.map(([competence]) => competence), 'Autres'];
                    })(),
                    datasets: [
                        {
                            data: (() => {
                                const competenceCounts = offres.reduce((acc, offre) => {
                                    offre.competences.forEach(competence => {
                                        acc[competence] = (acc[competence] || 0) + 1;
                                    });
                                    return acc;
                                }, {});

                                const sortedCompetences = Object.entries(competenceCounts).sort((a, b) => b[1] - a[1]);
                                const topCounts = sortedCompetences.slice(0, 4).map(([, count]) => count); // Limiter à 4 compétences
                                const otherCount = sortedCompetences.slice(4).reduce((sum, [, count]) => sum + count, 0);

                                return [...topCounts, otherCount];
                            })(),            
                            backgroundColor: ['#F1F5C0', '#C6D602', '#E4EC8A', '#D0DD33', '#DBE561'], // Couleurs
                            hoverBackgroundColor: ['#F1F5C0', '#C6D602', '#E4EC8A', '#D0DD33', '#DBE561'], // Couleurs au survol
                            
                        },
                    ],
                }}
            />
        </div>

        {/* Répartition par durée */}
        <div className="bento-item">
    <h3>Répartition par Durée</h3>
    <Pie
        data={{
            labels: durationStats.map(stat => stat.duree_groupe),
            datasets: [
                {
                    data: durationStats.map(stat => stat.nombre_offres),
                    backgroundColor: ['#C6D602', '#DBE561', '#F1F5C0'], // Couleurs spécifiées
                    hoverBackgroundColor: ['#C6D602', '#DBE561', '#F1F5C0'], // Couleurs au survol
                },
            ],
        }}
    />
</div>

        {/* Top des wish lists */}
        <div className="bento-item">
            <h3>Top 10 des Wish Lists</h3>
            <ul className="wishlist-list">
                {wishListStats
                    .sort((a, b) => b.wishListCount - a.wishListCount) // Trier par wishListCount décroissant
                    .slice(0, 10) // Prendre les 10 premiers
                    .map((offre, index) => (
                        <li
                            key={offre.offre_id}
                            className="wishlist-item"
                            onClick={() => router.push(`/offres/${offre.offre_id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="wishlist-rank">{index + 1}.</span>
                            <span className="wishlist-title">{offre.offre_titre}</span>
                            <span className="wishlist-count">{offre.wishListCount} wish lists</span>
                        </li>
                    ))}
            </ul>
        </div>
    </div>
</div>

            <img className="assets" src="/Assets/separateur-w2b.png"/>
        </div>
    );
}