import { useState, useEffect } from 'react';
import { supabase } from '../../../../client';
import EditRecommendations from './edit'; 
import "./edit.css";

function EditButton({setShowEditButton, setShowInitialInfo}) {
  const [user, setUser] = useState({});
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [editRecom, setEditRecom] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false); 
  const [currentRecommendation, setCurrentRecommendation] = useState(null); 
  

  useEffect(() => {
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
    const recommendationToEdit = userRecommendations.find(
      (recommendation) => recommendation.id_places === recommendationId
    );

    setCurrentRecommendation(recommendationToEdit);
    setShowEditForm(true);
  }

  async function handleSaveClick() {
    editedRecommendation.rating = selectedStars;
    console.log('edit:', editedRecommendation);
    try {
      const { data, error } = await supabase
        .from('places')
        .update(editedRecommendation)
        .eq('id_places', recommendation.id_places);

      if (error) {
        console.error('Error al actualizar la recomendación:', error);
      } else {
        onSave();
        setShowSuccessMessage(true);
        setShowEditButton(false);
        setShowInitialInfo(true);
      }
    } catch (error) {
      console.error('Error al actualizar la recomendación:', error);
    }
  }

  async function handleSaveRecommendation(updatedRecommendation) {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('author', user.username);
  
      if (error) {
        console.error('Error al obtener las recomendaciones:', error);
      } else {
        setUserRecommendations(data);
      }
    } catch (error) {
      console.error('Error al obtener las recomendaciones:', error);
    }
  }

  async function handleDeleteRecommendation(recommendationId) {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta recomendación?")) {
      try {
        // Eliminar la recomendación de la base de datos
        const { data, error } = await supabase
          .from('places')
          .delete()
          .eq('id_places', recommendationId);
  
        if (error) {
          console.error('Error al eliminar la recomendación:', error);
        } else {
          // Eliminar la recomendación de la lista en el estado
          const updatedRecommendations = userRecommendations.filter(
            (recommendation) => recommendation.id_places !== recommendationId
          );
          setUserRecommendations(updatedRecommendations);
        }
      } catch (error) {
        console.error('Error al eliminar la recomendación:', error);
      }
    }
  }
  

  return (
    <div>
        {showEditForm ? (
          <EditRecommendations
            recommendation={currentRecommendation}
            onSave={() => {
              setShowEditForm(false);
              handleSaveRecommendation(); // Llamar a la función handleSaveRecommendation sin argumentos
            }}
            onCancelEdit={() => setShowEditForm(false)}
            setShowEditButton={setShowEditButton}
            setShowInitialInfo={setShowInitialInfo}
          />
        ) : (
          editRecom && (
            <div className="user-recommendations">
              <h2>Edita tus recomendaciones</h2>
              <div className="recommendations-container">
                {userRecommendations.map((recommendation) => (
                  <div key={recommendation.id_places} className="recommendation-card">
                    <h3>{recommendation.name}</h3>
                    <p>{recommendation.description}</p>
                    <div className="rating-stars">{renderRatingStars(recommendation.rating)}</div>
                    <img src={recommendation.image} alt={recommendation.name} />
                    <div className="change-buttons">
                    <button className="edit-button-each" 
                      onClick={() => handleEditRecommendationClick(recommendation.id_places)}
                    >
                      Editar
                    </button>
                    <button className="edit-button-each"
                      onClick={() => handleDeleteRecommendation(recommendation.id_places)}
                    >
                      Eliminar
                    </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
  );
}

export default EditButton;