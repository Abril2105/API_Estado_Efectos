import React, { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [showAllUsers, setShowAllUsers] = useState(false);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/users?limit=10`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setVisibleUsers(data.slice(0, 6));
      });
  }, []);

  const loadMoreUsers = () => {
    const startIndex = visibleUsers.length;
    const endIndex = startIndex + 6;
    const additionalUsers = users.slice(startIndex, endIndex);
    setVisibleUsers([...visibleUsers, ...additionalUsers]);
    setPage(page + 1);
    setShowAllUsers(true); 
  };

  const toggleShowUsers = () => {
    if (showAllUsers) {
      setVisibleUsers(users.slice(0, 6));
      setShowAllUsers(false); 
    } else {
      setVisibleUsers(users);
      setShowAllUsers(true); 
    }
  };

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {visibleUsers.map((user) => (
          <div key={user.id} style={{ width: 'calc(33.33% - 20px)', marginBottom: '20px', border: '1px solid #ccc', padding: '10px', boxSizing: 'border-box' }}>
            <p>Nombre: {user.name.firstname} {user.name.lastname}</p>
            <p>Correo: {user.email}</p>
            <p>User Name: {user.username}</p>
            <p>Ciudad: {user.address.city}</p>
            <p>Calle: {user.address.street}</p>
            <p>Número: {user.address.number}</p>
            <p>Zipcode: {user.address.zipcode}</p>
            <p>Teléfono: {user.phone}</p>
          </div>
        ))}
      </div >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {!showAllUsers && (
          <button onClick={loadMoreUsers}>Ver Más</button>
        )}
        {showAllUsers && (
          <button onClick={toggleShowUsers}>Ver menos</button>
        )}
      </div>
    </div>
  );
}

export default App;