"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Trash, Pencil } from "lucide-react";

export default function Page() {
    return (
        <div>
            <div className="slide-entreprises-container">
                <div className="title-container">
                    <p className="paragraphe">Gestion des</p>
                    <h1 className="title">utilisateurs</h1>
                </div>
            </div>
            <div className="container-dashboard">
                <div className="grid">
                    <div className="item">
                        <br></br>
                        <center><div className="title">Pilote :</div></center>
                        <br></br>
                        
                    </div>
                    <div className="item">
                        <br></br>
                        <center><div className="title">Accessibilité :</div></center>
                        <br></br>
                        <Link href={`/createEntreprise`} className="info-card">
                            <div className="title">Créer un compte Pilote</div>
                        </Link>
                        <br></br>
                        <Link href={`/entreprise`} className="info-card">
                            <div className="title">Voir les statistiques</div>
                        </Link>
                        <br></br>
                    </div>
                </div>
                
                <div className="container-dashboard">
                    <div className="grid-inverse">
                        <div className="item">
                            <br></br>
                            <center><div className="title">etudiant :</div></center>
                            <br></br>
                        </div>
                        <div className="item">
                            <br></br>
                            <center><div className="title">Accessibilité :</div></center>
                            <br></br>
                            <Link href={`/createEntreprise`} className="info-card">
                                <div className="title">Créer un compte etudiant</div>
                            </Link>
                            <br></br>
                            <Link href={`/entreprise`} className="info-card">
                                <div className="title">Voir les statistiques</div>
                            </Link>
                            <br></br>
                        </div>
                    </div>
                </div>
            </div>
            <img className="assets" src="/Assets/separateur-w2b.png" />
        </div>
    );
}