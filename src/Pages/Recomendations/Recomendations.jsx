import React, { useState, useEffect } from 'react';
import { supabase } from '../../client.js';
import './Recomendations.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faComment, faShare } from "@fortawesome/free-solid-svg-icons";
import Comment from './interactions/comment/comment.jsx';
import Rating from './interactions/rating/rating.jsx';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Recomendations() {
  // State variables for user-related data and recommendations
  const [user, setUser] = useState({});
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [allRecommendations, setAllRecommendations] = useState([]); 
  const [interactionStates, setInteractionStates] = useState({});
  const [favoriteRecommendations, setFavoriteRecommendations] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [selectedCommentPlaceId, setSelectedCommentPlaceId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const optionsPerPage = [2, 3, 4, 5, 6, 10, 15, 16, 20]; 
  const [copiedLink, setCopiedLink] = useState(null);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDepartments] = useState([]);
  const [, setHasFiltered] = useState(false);
  const [searching, setSearching] = useState(false);

  // Event handler for changing the number of items per page
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

    // Function to display a success message when the link is copied
  const showToastMessage = () => {
    toast.success("Link copiado en el portapapeles!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  useEffect(() => {
    // Local storage
    const browser_data = window.localStorage.getItem('LOGIN_STATUS');
    if (browser_data !== null) {
      setUser(JSON.parse(browser_data));
    }
  }, []);

  // Function to fetch user recommendations and related data
  async function fetchUserRecommendations() {
    setLoadingRecommendations(true);
    const { data: placesData, error: placesError } = await supabase.from('places').select('*');
    const { data: departmentsData, error: departmentsError } = await supabase.from('departments').select('*');

    if (placesError || departmentsError) {
      console.error('Error al obtener los datos:', placesError || departmentsError);
    } else {
      const userRecommendations = placesData.map(place => {
        const department = departmentsData.find(department => department.id_departments === place.id_departments);
        const departmentName = department ? department.name : '';
        return {
          ...place,
          departmentName
        };
      });

      setUserRecommendations(userRecommendations);
      setAllRecommendations(userRecommendations); // Guardar todas las recomendaciones
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
  }, [currentPage]);

  useEffect(() => {
    async function fetchDepartmentName() {
      const { error } = await supabase
        .from('departments')
        .select('*');

      if (error) {
        console.error('Error al obtener el nombre del departamento:', error);
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

  // Function to toggle user interactions (like, share)
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
      const recommendation = userRecommendations.find((rec) => rec.id_places === recommendationId);
      if (recommendation) {
        const recommendationLink = `${window.location.origin}/MainPage/recommendation/${recommendation.id_places}`;
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
        // Add the recommendation to the favorites list
        const updatedFavorites = [...favoriteRecommendations, recommendationId];
        setFavoriteRecommendations(updatedFavorites);

        // Insert the "like" into the likedReviews table
        const { error } = await supabase.from('likedReviews').upsert([
          {
            username: user.username,
            id_places: recommendationId,
          },
        ]);

        if (error) {
          console.error('Error al registrar el "like":', error);

        }
      } else {
        // If already marked as a favorite, remove it from the favorites list
        const updatedFavorites = favoriteRecommendations.filter(
          (fav) => fav !== recommendationId
        );
        setFavoriteRecommendations(updatedFavorites);

        // Remove the "like" from the likedReviews table
        const { error } = await supabase.from('likedReviews').delete().eq('username', user.username).eq('id_places', recommendationId);

        if (error) {
          console.error('Error al eliminar el "like":', error);

        }
      }
    }
  }

  // Function to perform search based on search term and selected departments
  const performSearch = () => {
    if (searchTerm !== '') {
      setSearching(true);
      const searchTermRegex = new RegExp(searchTerm, 'i');
      const departmentMatches = selectedDepartments.length > 0;

      setHasFiltered(searchTerm !== '' || departmentMatches);

      const filteredResults = allRecommendations.filter((recommendation) => {
        const nameMatches = searchTermRegex.test(recommendation.name.toLowerCase());
        const apartmentMatches = searchTermRegex.test(recommendation.departmentName.toLowerCase());
        const departmentMatches = selectedDepartments.length === 0 || selectedDepartments.includes(recommendation.departmentName);
        return (nameMatches || apartmentMatches) && departmentMatches;
      });

      setSearchResults(filteredResults);
      setCurrentPage(1);
      setSearching(false);
    }
  };

  // Event handler for search input change
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };


  useEffect(() => {
    if (searchTerm !== '' && !searching) {
      performSearch();
    }
  }, [searchTerm, searching]);

  useEffect(() => {
    // Local storage
    const browser_data = window.localStorage.getItem('LOGIN_STATUS');
    if (browser_data !== null) {
      setUser(JSON.parse(browser_data));
    }
    setSearchTerm(''); // Establece searchTerm en una cadena vacía
  }, []);
  
  // Function to render rating stars based on the rating value
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

  // Calculate start and end index for displaying recommendations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const allrec = allRecommendations.slice(startIndex, endIndex);
  const recommendationsToDisplay = searchResults.slice(startIndex, endIndex);
  // Calcular totalPages en función de searchResults
  const totalPages = searchResults.length >= 0 && searchTerm !==''
  ? Math.ceil(searchResults.length / itemsPerPage)
  : Math.ceil(allRecommendations.length / itemsPerPage)

  return (
    <div className="root">
      <input
        className="FiltroBusqueda"
        type="text"
        placeholder="Buscar por nombre o departamento"
        value={searchTerm}
        onChange={handleSearchInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            performSearch();
          }
        }}
      />
      <div className="dropdown-container">
        <label>Recomendaciones por página:</label>
        <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="dropdown">
          {optionsPerPage.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <h1 className="Header">¡Estos son todos los lugares que poseemos!</h1>
      <div className="user-recommendations3">
        {loadingRecommendations ? (
          <p>Cargando recomendaciones...</p>
        ) : searchTerm !=='' && recommendationsToDisplay.length === 0 ? (
          <p>No se encontraron resultados</p>
        ) : searchTerm !== '' ? (
          <div className="recommendations-container3">
            {recommendationsToDisplay.map((recommendation) => (
              <div key={recommendation.id_places} className="recommendation-card-rec">
                <Link to={`/MainPage/recommendation/${recommendation.id_places}`}>
                  <h3>{recommendation.name}</h3>
                </Link>
                <h3>{recommendation.departmentName}</h3>
                <p>{recommendation.description}</p>
                <div className="rating-stars">{renderRatingStars(recommendation.rating)}</div>
                <img src={recommendation.image} alt={recommendation.name} />

                <div className="interaction-icons2">
                  <FontAwesomeIcon
                    icon={faHeart}
                    onClick={() => toggleInteraction(recommendation.id_places, 'like')}
                    className={interactionStates[recommendation.id_places].like ? "activeIn" : ""}
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
                      setShowComment(true);
                    }}
                    className={interactionStates[recommendation.id_places].comment ? "activeIn" : ""}
                  />
                  <FontAwesomeIcon
                    icon={faShare}
                    onClick={() => {toggleInteraction(recommendation.id_places, 'share'); showToastMessage();}}
                    className={interactionStates[recommendation.id_places].share ? "activeIn" : ""}
                  />
                </div>
              </div>
            ))}
          </div>
        ): (
          <div className="recommendations-container3">
            {allrec.map((recommendation) => (
              <div key={recommendation.id_places} className="recommendation-card2">
                <Link to={`/MainPage/recommendation/${recommendation.id_places}`}>
                  <h3>{recommendation.name}</h3>
                </Link>
                <h3>{recommendation.departmentName}</h3>
                <p>{recommendation.description}</p>
                <div className="rating-stars">{renderRatingStars(recommendation.rating)}</div>
                <img src={recommendation.image} alt={recommendation.name} />

                <div className="interaction-icons">
                  <FontAwesomeIcon
                    icon={faHeart}
                    onClick={() => toggleInteraction(recommendation.id_places, 'like')}
                    className={interactionStates[recommendation.id_places].like ? "activeIn" : ""}
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
                      setShowComment(true);
                    }}
                    className={interactionStates[recommendation.id_places].comment ? "activeIn" : ""}
                  />
                  <FontAwesomeIcon
                    icon={faShare}
                    onClick={() => {toggleInteraction(recommendation.id_places, 'share'); showToastMessage();}}
                    className={interactionStates[recommendation.id_places].share ? "activeIn" : ""}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showRating && (
        <div className="rating-modal">
          <button className="close-button" onClick={() => setShowRating(false)}>×</button>
          <Rating selectedPlaceId={selectedCommentPlaceId} />
        </div>
      )}
      {showComment && (
          <Comment selectedPlaceId={selectedCommentPlaceId} />
      )}
      <div className="pagination">
        {(searchResults.length > 0 || searchTerm === '') &&(
          Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? 'activePage' : ''}
            >
              {index + 1}
            </button>
          )))
        }
      </div>
    </div>
  );
}

export default Recomendations;