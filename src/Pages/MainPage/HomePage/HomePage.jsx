import React, { useState, useEffect } from 'react'; // Asegúrate de importar React
import bg from '../../../assets/mainBackgrnd.png';
import './HomePage.css';

const HomePage = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const browser_data = window.localStorage.getItem('LOGIN_STATUS');
    if (browser_data !== null) setUser(JSON.parse(browser_data));
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        alignContent: 'center',
        backgroundImage: `url(${bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <h1 className="main-title">Bienvenido de nuevo {user.username}!</h1>
      <p className="role-message">Estas asignado como {user.role}</p>
    </div>
  );
};

export default HomePage;