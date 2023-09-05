import { useState, useEffect } from 'react';
import './Profile.css';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import profileImage from '../../assets/profile.png';
import { supabase } from '../../client';
import edit from '../../assets/1.png';
import save from '../../assets/2.png';
import like from '../../assets/3.png';
import EditButton from './buttons/edit/EditButton';
import LikeButton from './buttons/like/LikeButton';

function Profile() {
  const [user, setUser] = useState({});
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [showInitialInfo, setShowInitialInfo] = useState(true); // Estado para mostrar/ocultar recomendaciones iniciales
  const [showEditButton, setShowEditButton] = useState(false);
  const [showLikeButton, setShowLikeButton] = useState(false);


  useEffect(() => {
    // Local storage
    const browser_data = window.localStorage.getItem('LOGIN_STATUS');
    if (browser_data !== null) {
      setUser(JSON.parse(browser_data));
    }
  }, []);

  useEffect(() => {
    async function fetchUserRecommendations() {
      setLoadingRecommendations(true);
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('author', user.username);

      if (error) {
        console.error('Error al obtener las recomendaciones:', error);
      } else {
        setUserRecommendations(data);
      }
      setLoadingRecommendations(false);
    }

    if (user.username) {
      fetchUserRecommendations();
    }
  }, [user.username]);

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

  function handleEditRecommendationClick(recommendationId) {
    setShowEditButton(true);
    setShowInitialInfo(false); // Ocultar recomendaciones iniciales al presionar editar
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

        <div className="buttons-container">
          {/* Botón Editar */}
          <button
            className="each-button"
            data-testid="edit-button"
            style={{
              backgroundImage: `url(${edit})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            onClick={() => handleEditRecommendationClick(null)}
          ></button>
          <button
            id="save"
            className="each-button"
            data-testid="save-button"
            style={{
              backgroundImage: `url(${save})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            onClick={() => {
               // Colocar la acción para mostrar las recomendaciones
            }}
          ></button>

          <button
            id="like"
            className="each-button"
            data-testid="like-button"
            style={{
              backgroundImage: `url(${like})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            onClick={() => {
              setShowLikeButton(!showLikeButton);
            }}
          ></button>
        </div>

        {showLikeButton && <LikeButton />}

        {/* Mostrar EditButton si showEditButton es true */}
        {showEditButton && (
          <EditButton
            recommendations={userRecommendations}
            onEditRecommendationClick={handleEditRecommendationClick}
            setShowEditButton={setShowEditButton}
            setShowInitialInfo={setShowInitialInfo}
          />
        )}
        {/* Mostrar recomendaciones iniciales si showInitialInfo es true */}
        {showInitialInfo && !loadingRecommendations && userRecommendations.length > 0 && (
          <div className="user-recommendations">
            <h2>Tus recomendaciones</h2>
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
        )}
      </div>
    </div>
  );
}

export default Profile;