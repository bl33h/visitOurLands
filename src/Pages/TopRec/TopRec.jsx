import React, { useState, useEffect } from 'react';
import { supabase } from '../../client.js';
import './TopRec.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSave, faComment, faShare } from "@fortawesome/free-solid-svg-icons";

function TopRec(){
    const [user, setUser] = useState({});
    const [loadingRecommendations, setLoadingRecommendations] = useState(true);
    const [userRecommendations, setUserRecommendations] = useState([]);
    const [departmentName, setDepartmentName] = useState('');
    const [interactionStates, setInteractionStates] = useState({});
    const [favoriteRecommendations, setFavoriteRecommendations] = useState([]);


    useEffect(() => {
        // Local storage
        const browser_data = window.localStorage.getItem('LOGIN_STATUS');
        if (browser_data !== null) {
          setUser(JSON.parse(browser_data));
        }
      }, []);

      async function fetchUserRecommendations() {
        setLoadingRecommendations(true);
        // Obtener los datos de las tablas "places" y "departments"
        const { data: placesData, error: placesError } = await supabase.from('places').select('*').eq('rating', 5);
        const { data: departmentsData, error: departmentsError } = await supabase.from('departments').select('*');
      
        if (placesError || departmentsError) {
          console.error('Error al obtener los datos:', placesError || departmentsError);
        } else {
          // Combinar los datos de las tablas "places" y "departments" utilizando el campo "department_id"
          const userRecommendations = placesData.map(place => {
            const department = departmentsData.find(department => department.id_departments === place.id_departments);
            const departmentName = department ? department.name : ''; // Nombre del departamento o cadena vacía si no se encuentra
            return {
              ...place,
              departmentName
            };
          });
          
        setUserRecommendations(userRecommendations);
          const initialInteractionStates = userRecommendations.reduce((acc, rec) => {
            acc[rec.id_places] = {
              like: false,
              save: false,
              comment: false,
              share: false
            };
            return acc;
          }, {});
          setInteractionStates(initialInteractionStates);
        }
        setLoadingRecommendations(false);
      }

      useEffect(() => {
        fetchUserRecommendations();
      }, []);
      
      useEffect(() => {
        async function fetchDepartmentName() {
          const { data, error } = await supabase
            .from('departments')
            .select('*');
    
          if (error) {
            console.error('Error al obtener el nombre del departamento:', error);
          } else {
            setDepartmentName(data.name);
          }
        }
    
        fetchDepartmentName();
      }, []);

      useEffect(() => {
        const storedRecommendations = window.localStorage.getItem('USER_RECOMMENDATIONS');
        if (storedRecommendations && user.username === JSON.parse(storedRecommendations)[0]?.author) {
          setUserRecommendations(JSON.parse(storedRecommendations));
          setLoadingRecommendations(false);
        }
      }, [user.username]); 

      useEffect(() => {
        if (userRecommendations.length > 0) {
          window.localStorage.setItem('USER_RECOMMENDATIONS', JSON.stringify(userRecommendations));
        }
      }, [userRecommendations]);

      async function toggleInteraction(recommendationId, interactionType) {
        const updatedInteractionStates = {
          ...interactionStates,
          [recommendationId]: {
            ...interactionStates[recommendationId],
            [interactionType]: !interactionStates[recommendationId][interactionType],
          },
        };
      
        setInteractionStates(updatedInteractionStates);
      
        if (interactionType === 'like') {
          if (!favoriteRecommendations.includes(recommendationId)) {
            // Agregar la recomendación a la lista de favoritos
            const updatedFavorites = [...favoriteRecommendations, recommendationId];
            setFavoriteRecommendations(updatedFavorites);
      
            // Insertar el "like" en la tabla likedReviews
            const { data, error } = await supabase.from('likedReviews').upsert([
              {
                username: user.username, // El ID del usuario que dio "like"
                id_places: recommendationId, // El ID de la recomendación que se dio "like"
              },
            ]);
      
            if (error) {
              console.error('Error al registrar el "like":', error);
              
            }
          } else {
            // Si ya está marcado como favorito, quítalo de la lista de favoritos
            const updatedFavorites = favoriteRecommendations.filter(
              (fav) => fav !== recommendationId
            );
            setFavoriteRecommendations(updatedFavorites);
      
            // Eliminar el "like" de la tabla likedReviews
            const { data, error } = await supabase.from('likedReviews').delete().eq('username', user.username).eq('id_places', recommendationId);
      
            if (error) {
              console.error('Error al eliminar el "like":', error);
              
            }
          }
        }
      }
      

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
        <div className="RecDiv">
          <h1 className="Header">¡Estos son los lugares mejor valorados!</h1>
          <div className="user-recommendations">
            {loadingRecommendations ? (
              <p>Cargando recomendaciones...</p>
            ) : userRecommendations.length === 0 ? (
              <p>Aún no hay recomendaciones para mostrar</p>
            ) : (
              <div className="recommendations-container2">
                {userRecommendations.map((recommendation) => (
                  <div key={recommendation.id_places} className="recommendation-card2">
                    <h3>{recommendation.name}</h3>
                    <h3>{recommendation.departmentName}</h3>
                    <p>{recommendation.description}</p>
                    <div className="rating-stars">{renderRatingStars(recommendation.rating)}</div>
                    <img src={recommendation.image} alt={recommendation.name} />
    
                    {/* Icons */}
                    <div className="interaction-icons">
                      <FontAwesomeIcon
                        icon={faHeart}
                        onClick={() => toggleInteraction(recommendation.id_places, 'like')}
                        className={interactionStates[recommendation.id_places].like ? "activeIn" : ""}
                      />
                      <FontAwesomeIcon
                        icon={faSave}
                        onClick={() => toggleInteraction(recommendation.id_places, 'save')}
                        className={interactionStates[recommendation.id_places].save ? "activeIn" : ""}
                      />
                      <FontAwesomeIcon
                        icon={faComment}
                        onClick={() => toggleInteraction(recommendation.id_places, 'comment')}
                        className={interactionStates[recommendation.id_places].comment ? "activeIn" : ""}
                      />
                      <FontAwesomeIcon
                        icon={faShare}
                        onClick={() => toggleInteraction(recommendation.id_places, 'share')}
                        className={interactionStates[recommendation.id_places].share ? "activeIn" : ""}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    export default TopRec;