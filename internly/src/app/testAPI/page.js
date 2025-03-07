"use client";
import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/index.php");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setUsers(data);
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
            users.map((user) => (
              <li key={user.id}>
                {user.name} - {user.email}
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
