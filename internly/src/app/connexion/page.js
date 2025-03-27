"use client";
import { useState } from 'react';

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Fonction de validation de l'adresse email
    const validateEmail = (email) => {
        if (email === '') {
            setError('');
            return;
        }
        const emailRegex = /^(?:[a-z]+\.[a-z]+@viacesi\.fr|[a-z]+@cesi\.fr|[a-z]+\.[a-z]+@internly\.fr)$/;
        if (!emailRegex.test(email)) {
            setError('Adresse email invalide');
        } else {
            setError('');
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (error || !email || !password) {
            setError('Veuillez remplir tous les champs correctement.');
            return;
        }
    
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (response.status === 401) {
                throw new Error('Identifiants incorrects');
            } else if (!response.ok) {
                throw new Error('Erreur serveur');
            }
    
            const data = await response.json();
            console.log('Connexion réussie :', data);
    
            // Accédez directement aux propriétés de la réponse
            if (data.id && data.email && data.status) {
                const user = { id: data.id, email: data.email, status: data.status };
    
                // Stocker les informations utilisateur dans un cookie sécurisé
                document.cookie = `user=${JSON.stringify(user)}; path=/;`;
    
                // Rediriger l'utilisateur en fonction de son statut
                switch (user.status) {
                    case 'admin':
                        window.location.href = '/dashboardAdmin';
                        break;
                    case 'pilote':
                        window.location.href = '/dashboardPilote';
                        break;
                    case 'etudiant':
                        window.location.href = '/dashboardEtudiant';
                        break;
                    default:
                        throw new Error('Statut utilisateur inconnu');
                }
            } else {
                throw new Error('Données utilisateur incomplètes');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="slide-container">
                <div className="slide-login-container">
                    <h1 className='title'>Connexion</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Adresse email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                                className={error ? 'error-input' : ''}
                            />
                            {error && <p className="error-message">{error}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>
                    <p>
                        <a href="/forgot-password">Mot de passe oublié ?</a>
                    </p>
                </div>
            </div>
            <img className="assets" src="/Assets/separateur-w2b.png"/>
        </div>
    );
}