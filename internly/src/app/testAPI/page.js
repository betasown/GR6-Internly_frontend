"use client";
import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/index.php?route=users");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        
        // Remove duplicates
        const uniqueUsers = data.filter((user, index, self) =>
          index === self.findIndex((u) => (
            u.utilisateur_id === user.utilisateur_id
          ))
        );

        setUsers(uniqueUsers);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Liste des Utilisateurs</h1>
      {error ? (
        <p>Erreur: {error}</p>
      ) : (
        <ul>
          {users.length > 0 ? (
            users.map((user, index) => (
              <li key={`${user.utilisateur_id}-${index}`}>
                {user.utilisateur_nom} - {user.utilisateur_email}
              </li>
            ))
          ) : (
            <p>Aucun utilisateur trouvé</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
