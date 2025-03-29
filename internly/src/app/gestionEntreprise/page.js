"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash, Pencil} from "lucide-react";

export default function Page() {
    const [entreprises, setEntreprises] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        // Fetch data from the API
        fetch("http://localhost:8000/index.php?route=entreprise")
            .then((response) => response.json())
            .then((data) => setEntreprises(data))
            .catch((error) => console.error("Error fetching entreprises:", error));

            
    }, []);
    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = entreprises.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(entreprises.length / itemsPerPage);
        
    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            // Scroll to top of the page
        }
    };

    return (
        <>
            <div className="slide-entreprises-container">
                <div className="title-container">
                    <p className="paragraphe">Gestion des</p>
                    <h1 className="title">Entreprises</h1>
                </div>
            </div>
            <div className="container-dashboard">
                <div className="grid">
                    <div className="item">
                        <br></br>
                        <div className="title-container">
                            <h1 className="title">Entreprises : </h1>
                        </div>

                        {/* Display the entreprises in a table */}
                        <table className="offer-table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Tel :</th>
                                    <th><center></center></th>
                                    <th><center></center></th>

                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((entreprise, index) => (
                                        <tr key={entreprise.entreprise_id}>
                                            <td>{entreprise.entreprise_nom}</td>
                                            <td>{entreprise.entreprise_email}</td>
                                            <td>{entreprise.entreprise_telephone}</td>
                                            <td><center><button className="remove-button"><Trash size={24}/></button></center></td>
                                            <td><center><button className="remove-button"><Pencil size={24}/></button></center></td>
                                    
                                        </tr>
                                    ))}
                                
                                
                            </tbody>
                        </table>
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
                    <div className="item">
                        <br></br>
                        <center><div className="title">Accessibilité :</div></center>
                        <br></br>
                        <Link href={`/createEntreprise`} className="info-card">
                            <div className="title">Créer une entreprise</div>
                        </Link>
                       <br></br>
                        <Link href={`/entreprise`} className="info-card">
                            <div className="title">Voir les statistiques</div>
                        </Link>
                        <br></br>
                    </div>
                </div>
            </div>
            <img className="assets" src="/Assets/separateur-w2b.png" />
        </>
    );
}