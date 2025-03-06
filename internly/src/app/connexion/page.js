"use client";
import { useState } from 'react';

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        if (email === '') {
            setError('');
            return;
        }
        const emailRegex = /^(?:[a-z]+\.[a-z]+@viacesi\.fr|[a-z]\.[a-z]+@cesi\.fr)$/;
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (error) {
            return;
        }
        // Ajouter la logique de connexion ici
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
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
                <button type="submit" className="login-button">Se connecter</button>
            </form>
            <p>
                <a href="/forgot-password">Mot de passe oublié ?</a>
            </p>
        </div>
        </div>
    );
}