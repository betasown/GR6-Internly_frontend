"use client";

import { useRouter } from 'next/navigation';

export default function Page() {
    const offres = [
        {
            id: 1,
            entreprise: "Google",
            titre: "Software Engineer",
            description: "Develop and maintain web applications.",
            competences: ["JavaScript", "React", "Node.js"],
            remuneration: "100k-120k",
            dates: "01/01/2024 - 31/12/2024",
            nombreCandidatures: 50
        },
        {
            id: 2,
            entreprise: "Microsoft",
            titre: "Data Scientist",
            description: "Analyze and interpret complex data.",
            competences: ["Python", "Machine Learning", "SQL"],
            remuneration: "90k-110k",
            dates: "01/02/2024 - 31/12/2024",
            nombreCandidatures: 30
        },
        {
            id: 3,
            entreprise: "Google",
            titre: "Software Engineer",
            description: "Develop and maintain web applications.",
            competences: ["JavaScript", "React", "Node.js"],
            remuneration: "100k-120k",
            dates: "01/01/2024 - 31/12/2024",
            nombreCandidatures: 50
        },
        {
            id: 4,
            entreprise: "Microsoft",
            titre: "Data Scientist",
            description: "Analyze and interpret complex data.",
            competences: ["Python", "Machine Learning", "SQL"],
            remuneration: "90k-110k",
            dates: "01/02/2024 - 31/12/2024",
            nombreCandidatures: 30
        },
        {
            id: 5,
            entreprise: "Google",
            titre: "Software Engineer",
            description: "Develop and maintain web applications.",
            competences: ["JavaScript", "React", "Node.js"],
            remuneration: "100k-120k",
            dates: "01/01/2024 - 31/12/2024",
            nombreCandidatures: 50
        },
        {
            id: 6,
            entreprise: "Microsoft",
            titre: "Data Scientist",
            description: "Analyze and interpret complex data.",
            competences: ["Python", "Machine Learning", "SQL"],
            remuneration: "90k-110k",
            dates: "01/02/2024 - 31/12/2024",
            nombreCandidatures: 30
        },
        {
            id: 7,
            entreprise: "Google",
            titre: "Software Engineer",
            description: "Develop and maintain web applications.",
            competences: ["JavaScript", "React", "Node.js"],
            remuneration: "100k-120k",
            dates: "01/01/2024 - 31/12/2024",
            nombreCandidatures: 50
        },
        {
            id: 8,
            entreprise: "Microsoft",
            titre: "Data Scientist",
            description: "Analyze and interpret complex data.",
            competences: ["Python", "Machine Learning", "SQL"],
            remuneration: "90k-110k",
            dates: "01/02/2024 - 31/12/2024",
            nombreCandidatures: 30
        },
        {
            id: 9,
            entreprise: "Google",
            titre: "Software Engineer",
            description: "Develop and maintain web applications.",
            competences: ["JavaScript", "React", "Node.js"],
            remuneration: "100k-120k",
            dates: "01/01/2024 - 31/12/2024",
            nombreCandidatures: 50
        },
        {
            id: 10,
            entreprise: "Microsoft",
            titre: "Data Scientist",
            description: "Analyze and interpret complex data.",
            competences: ["Python", "Machine Learning", "SQL"],
            remuneration: "90k-110k",
            dates: "01/02/2024 - 31/12/2024",
            nombreCandidatures: 30
        },
        {
            id: 11,
            entreprise: "Google",
            titre: "Software Engineer",
            description: "Develop and maintain web applications.",
            competences: ["JavaScript", "React", "Node.js"],
            remuneration: "100k-120k",
            dates: "01/01/2024 - 31/12/2024",
            nombreCandidatures: 50
        },
        {
            id: 12,
            entreprise: "Microsoft",
            titre: "Data Scientist",
            description: "Analyze and interpret complex data.",
            competences: ["Python", "Machine Learning", "SQL"],
            remuneration: "90k-110k",
            dates: "01/02/2024 - 31/12/2024",
            nombreCandidatures: 30
        }
    ];

    const router = useRouter();

    return (
        <div>
            <div className="slide-offres-container">
                <div className="title-container">
                    <div className="title-text">
                        <p className="paragraphe">Découvrir nos</p>
                        <h1 className="title">Offres</h1>
                    </div>
                    <button 
                        className="apply-button"
                        onClick={() => router.push('/createOffer')}
                    >
                        Créer une offre
                    </button>
                </div>
            </div>

            <div className="container-cards-container">
                <div className="offer-container">
                    {offres.map((offre, index) => (
                        <div key={index} className="offer-card">
                            <div className="titre">{offre.titre}</div>
                            <div className="entreprise">{offre.entreprise}</div>
                            <div className="competences">
                                {offre.competences.map((competence, i) => (
                                    <span key={i} className="competence-pill">{competence}</span>
                                ))}
                            </div>
                            <button 
                                className="apply-button" 
                                onClick={() => router.push('/fakeOffer')}
                            >
                                Candidater
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <img className="assets" src="/Assets/separateur-w2b.png"/>
        </div>
    );
}