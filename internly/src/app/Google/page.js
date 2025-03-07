"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const company = {
        name: "Google",
        description: "Google LLC is an American multinational technology company that specializes in Internet-related services and products.",
        contact: {
            email: "contact@google.com",
            phone: "+1-650-253-0000"
        },
        domain: "Technology",
        rating: 4.5,
        internsTaken: 120
    };

    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const router = useRouter();

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<span key={i} className="star full-star"></span>);
            } else if (i - rating < 1) {
                stars.push(<span key={i} className="star half-star"></span>);
            } else {
                stars.push(<span key={i} className="star empty-star"></span>);
            }
        }
        return stars;
    };

    const handleDeleteClick = () => {
        setShowConfirmPopup(true);
    };

    const handleConfirmDelete = () => {
        // Ajouter la logique de suppression ici
        setShowConfirmPopup(false);
        console.log('Entreprise supprimée');
        router.push('/entreprises'); // Rediriger vers la page des entreprises
    };

    const handleCancelDelete = () => {
        setShowConfirmPopup(false);
    };

    return (
        <div className="slide-container">
            <div className="slide-company-container">
                <h1 className='title'>{company.name}</h1>
                <p>{company.description}</p>
                <p><strong>Contact:</strong> {company.contact.email} / {company.contact.phone}</p>
                <p><strong>Domaine:</strong> {company.domain}</p>
                <div className="rating">
                    <strong>Note:</strong> {renderStars(company.rating)} ({company.rating})
                </div>
                <p><strong>Nombre de stagiaires pris:</strong> {company.internsTaken}</p>
                <div className="button-group">
                    <button className="edit-button" onClick={() => router.push('/modifGoogle')}>Modifier</button>
                    <button className="delete-button" onClick={handleDeleteClick}>Supprimer</button>
                </div>
            </div>

            {showConfirmPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Êtes-vous sûr de vouloir supprimer cette entreprise ?</p>
                        <button onClick={handleConfirmDelete}>Oui</button>
                        <button onClick={handleCancelDelete}>Non</button>
                    </div>
                </div>
            )}
        </div>
    );
}