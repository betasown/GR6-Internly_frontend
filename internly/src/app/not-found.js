import Link from 'next/link';

export default function Custom404() {
    return (
        <div>
                <div className="slide-entreprises-container">
                    <div className="title-container">
                    
                        <center><img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2NtMHF1ZnBieHBic3M1cHpyZWlubDVxYjZ6bHd4NmtrMzYxM3I0ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Ll22OhMLAlVDb8UQWe/giphy.gif" width="190" height="220"/></center>
                        <h1 className="title">Erreur 404</h1>
                        <p className='paragraphe'>Page non trouvé</p>
                        <a className="connect-btn" href="/" style={{marginTop: '2%'}}>Revenir à l'accueil</a>
                    </div>
                </div>
                <img className="assets" src="/Assets/separateur-w2b.png"/>
            </div>
    );
}