import { useState, useEffect } from 'react';
import './Profile.css';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import profileImage from '../../assets/profile.png';
import edit from '../../assets/1.png';
import save from '../../assets/2.png';
import like from '../../assets/3.png';
import { supabase } from '../../client';

function Profile() {
  const [user, setUser] = useState({});
  const [userRecommendations, setUserRecommendations] = useState([]);

  useEffect(() => {
    // Obtener el usuario desde el localStorage
    const browser_data = window.localStorage.getItem('LOGIN_STATUS');
    if (browser_data !== null) {
      setUser(JSON.parse(browser_data));
    }

    // Consultar las recomendaciones del usuario actual
    async function fetchUserRecommendations() {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('author', user.username); // Filtrar las recomendaciones por el 'username' del usuario

      if (error) {
        console.error('Error al obtener las recomendaciones:', error);
      } else {
        setUserRecommendations(data);
      }
    }

    fetchUserRecommendations();
  }, [user.username]); // Agregar user.username como dependencia del useEffect

  function renderRatingStars(rating) {
    const stars = [];
    const totalStars = 5;
  
    for (let i = 1; i <= totalStars; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star filled-star"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star empty-star"></i>);
      }
    }
  
    return stars;
  }  

  return (
    <div className="root">
      <div className="container">
        <div className="info">
          <img id="profile-picture" src={profileImage} alt="Profile" />
          <div className="column">
            <h1 className="username">{user.username}</h1>
            <p className="description">{user.role}</p>
          </div>
        </div>

        <div id="edit" className="buttons">
          <button
            className="each-button"
            style={{
              backgroundImage: `url(${edit})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            onClick={() => {
              // Colocar la acción para editar el perfil
            }}
          ></button>

          <button
            id="save"
            className="each-button"
            style={{
              backgroundImage: `url(${save})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            onClick={() => {
              // Colocar la acción para guardar el perfil
            }}
          ></button>

          <button
            id="like"
            className="each-button"
            style={{
              backgroundImage: `url(${like})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            onClick={() => {
              // Colocar la acción para mostrar las recomendaciones
            }}
          ></button>
        </div>

        {/* Mostrar las recomendaciones del usuario */}
        <div className="user-recommendations">
          <h2>Tus Recomendaciones:</h2>
          <div className="recommendations-container">
            {userRecommendations.map((recommendation) => (
              <div key={recommendation.id_places} className="recommendation-card">
                <h3>{recommendation.name}</h3>
                <p>{recommendation.description}</p>
                <div className="rating-stars">{renderRatingStars(recommendation.rating)}</div>
                <img src={recommendation.image} alt={recommendation.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;