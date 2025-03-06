"use client";

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
                    <button className="edit-button">Modifier</button>
                    <button className="delete-button">Supprimer</button>
                </div>
            </div>
        </div>
    );
}