// Import necessary libraries and styles
import React, { useState, useEffect } from 'react';
import { supabase } from '../../client.js';
import './TopRec.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faComment, faShare } from "@fortawesome/free-solid-svg-icons";
import Comment from './interactions/comment/comment.jsx';
import Rating from './interactions/rating/rating.jsx';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define a functional component named "TopRec"
function TopRec(){
  // Define and initialize state variables using the useState hook
  const [user, setUser] = useState({});
  const [userRole, setUserRole] = useState(null); // Estado para almacenar el rol del usuario
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [recommendationsPerPage, setRecommendationsPerPage] = useState(2);
  const [interactionStates, setInteractionStates] = useState({});
  const [favoriteRecommendations, setFavoriteRecommendations] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [selectedCommentPlaceId, setSelectedCommentPlaceId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = recommendationsPerPage;
  const [copiedLink, setCopiedLink] = useState(null);
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const showToastMessage = () => {
    toast.success("Link copiado en el portapapeles!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // useEffect hook to fetch user information from local storage
  useEffect(() => {
    const browser_data = window.localStorage.getItem('LOGIN_STATUS');
    if (browser_data !== null) {
      setUser(JSON.parse(browser_data));
    }
  }, []);
  
  async function fetchPosts() {
    const { data } = await supabase.from('users').select()
    setUsers(data)
  } 

  // Function to fetch user recommendations from the database
  async function fetchUserRecommendations() {
    setLoadingRecommendations(true);
    // Fetch data from the "places" and "departments" tables
    const { data: placesData, error: placesError } = await supabase.from('places').select('*').gte('avg_rating', 4);
    const { data: departmentsData, error: departmentsError } = await supabase.from('departments').select('*');

    if (placesError || departmentsError) {
      console.error('Error al obtener los datos:', placesError || departmentsError);
    } else {
      // Combine data from the "places" and "departments" tables using the "department_id" field
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

  // useEffect hook to fetch user recommendations when the "currentPage" changes
  useEffect(() => {
    fetchUserRecommendations();
  }, [currentPage]);

  // useEffect hook to load user recommendations from local storage
  useEffect(() => {
    const storedRecommendations = window.localStorage.getItem('USER_RECOMMENDATIONS');
    if (storedRecommendations && user.username === JSON.parse(storedRecommendations)[0]?.author) {
      setUserRecommendations(JSON.parse(storedRecommendations));
      setLoadingRecommendations(false);
    }
  }, [user.username]);

  // useEffect hook to store user recommendations in local storage
  useEffect(() => {
    if (userRecommendations.length > 0) {
      window.localStorage.setItem('USER_RECOMMENDATIONS', JSON.stringify(userRecommendations));
    }
  }, [userRecommendations]);

  async function handleDelete(recommendationId) {
    try {
      // Eliminar la recomendación de la tabla "places" utilizando el ID
      const { error } = await supabase.from('places').delete().eq('id_places', recommendationId);
  
      if (error) {
        console.error('Error al eliminar la recomendación:', error);
      } else {
        // Recargar las recomendaciones después de la eliminación
        fetchUserRecommendations();
        console.log('Recomendación eliminada exitosamente.');
      }
    } catch (error) {
      console.error('Error al eliminar la recomendación:', error);
    }
  }  

  // Function to toggle interactions (like, share) for a recommendation
  async function toggleInteraction(recommendationId, interactionType) {
    const updatedInteractionStates = {
      ...interactionStates,
      [recommendationId]: {
        ...interactionStates[recommendationId],
        [interactionType]: !interactionStates[recommendationId][interactionType],
      },
    };

    setInteractionStates(updatedInteractionStates);

    if (interactionType === 'share') {
      // Get the link of the recommendation
      const recommendation = userRecommendations.find((rec) => rec.id_places === recommendationId);
      if (recommendation) {
        const recommendationLink = `${window.location.origin}/MainPage/recommendation/${recommendation.id_places}`;
  
        // Copy the link to the clipboard
        try {
          await navigator.clipboard.writeText(recommendationLink);
          setCopiedLink(recommendationLink);
          setShowCopyMessage(true);
          setTimeout(() => {
            setShowCopyMessage(false);
          }, 3000);
        } catch (error) {
          console.error('Error al copiar el enlace:', error);
        }
      }
    }

    if (interactionType === 'like') {
      if (!favoriteRecommendations.includes(recommendationId)) {
        // Add the recommendation to the list of favorites
        const updatedFavorites = [...favoriteRecommendations, recommendationId];
        setFavoriteRecommendations(updatedFavorites);

        // Insert the "like" in the likedReviews table
        const { error } = await supabase.from('likedReviews').upsert([
          {
            username: user.username, // The user ID who gave the "like"
            id_places: recommendationId, // The ID of the recommendation that received the "like"
          },
        ]);

        if (error) {
          console.error('Error al registrar el "like":', error);

        }
      } else {
        // If already marked as favorite, remove it from the list of favorites
        const updatedFavorites = favoriteRecommendations.filter(
          (fav) => fav !== recommendationId
        );
        setFavoriteRecommendations(updatedFavorites);

        // Delete the "like" from the likedReviews table
        const {error } = await supabase.from('likedReviews').delete().eq('username', user.username).eq('id_places', recommendationId);

        if (error) {
          console.error('Error al eliminar el "like":', error);

        }
      }
    }
  }

  // Function to handle the change in the number of recommendations per page
  function handleRecommendationsPerPageChange(event) {
    const newRecommendationsPerPage = parseInt(event.target.value, 10);
    setRecommendationsPerPage(newRecommendationsPerPage);
    setCurrentPage(1); // Reset the current page when changing the number of recommendations per page
  }
  
  // Function to render rating stars
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

  // Calculate the range of recommendations to display based on the current page and items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const recommendationsToDisplay = userRecommendations.slice(startIndex, endIndex);

  // Calculate the total number of pages based on the number of recommendations and items per page
  const totalPages = Math.ceil(userRecommendations.length / itemsPerPage);

  // Render the component's UI
  return (
    <div className="root">
      <h1 className="Header">¡Estos son los lugares mejor valorados!</h1>
      <div className="recommendations-per-page">
        <label htmlFor="recommendationsPerPage" className="label-text">
          Recomendaciones por página:
        </label>
        <select
          id="recommendationsPerPage"
          onChange={handleRecommendationsPerPageChange}
          value={recommendationsPerPage}
          className="dropdown"
        >
          {/* Options for the number of recommendations per page */}
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={16}>16</option>
          <option value={20}>20</option>
        </select>
      </div>
  
      <div className="user-recommendations">
        {loadingRecommendations ? (
          <p>Cargando recomendaciones...</p>
        ) : userRecommendations.length === 0 ? (
          <p>Aún no hay recomendaciones para mostrar</p>
        ) : (
          <div className="recommendations-container2">
            {recommendationsToDisplay.map((recommendation) => (
              <div key={recommendation.id_places} className="recommendation-card2">
                {/* Botones para el usuario admin */}
                {userRole === 'admin' && (
                  <div className="admin-buttons">
                    <button onClick={() => handleDelete(recommendation.id_places)}>Eliminar</button>
                    <button onClick={() => handleEdit(recommendation.id_places)}>Editar</button>
                  </div>
                )}

                {/* Contenido de la tarjeta de recomendación */}
                <Link to={`/MainPage/recommendation/${recommendation.id_places}`}>
                  <h3>{recommendation.name}</h3>
                </Link>
                <h3>{recommendation.departmentName}</h3>
                <p>{recommendation.description}</p>
                <div className="rating-stars">{renderRatingStars(recommendation.rating)}</div>
                <img src={recommendation.image} alt={recommendation.name} />
                {/* Icons for interactions (like, comment, share) */}
                <div className="interaction-icons">
                  <FontAwesomeIcon
                    icon={faHeart}
                    onClick={() => toggleInteraction(recommendation.id_places, 'like')}
                    className={interactionStates[recommendation.id_places]?.like ? "activeIn" : ""}
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    onClick={() => {
                      setSelectedCommentPlaceId(recommendation.id_places);
                      setShowRating(true);
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faComment}
                    onClick={() => {
                      setSelectedCommentPlaceId(recommendation.id_places);
                      setShowComment(true); // Cambia el estado a true para mostrar el componente Comment
                    }}
                    className={interactionStates[recommendation.id_places]?.comment ? "activeIn" : ""}
                  />
                  <FontAwesomeIcon
                    icon={faShare}
                    onClick={() => {toggleInteraction(recommendation.id_places, 'share'); showToastMessage();}}
                    className={interactionStates[recommendation.id_places]?.share ? "activeIn" : ""}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  
      {/* Modal for rating */}
      {showRating && (
        <div className="rating-modal">
          <button className="close-button" onClick={() => setShowRating(false)}>×</button>
          <Rating selectedPlaceId={selectedCommentPlaceId} />
        </div>
      )}
      {/* Comment component */}
      {showComment && (
        <Comment selectedPlaceId={selectedCommentPlaceId} />
      )}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? 'activePage' : ''}
          >
            {index + 1}
          </button>
        ))}
        </div>
      </div>
    );
  }

// Export the "TopRec" component as the default export
export default TopRec;