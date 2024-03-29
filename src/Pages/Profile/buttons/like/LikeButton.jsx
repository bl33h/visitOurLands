import React, { useState, useEffect } from 'react';
import './LikeButton.css';
import { supabase } from '../../../../client';
import { Link } from 'react-router-dom';

function LikeButton() {
  const [user, setUser] = useState({});
  const [likedRecommendations, setLikedRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

    // Effect to fetch user data from local storage on component mount
  useEffect(() => {
    // Local storage
    const browser_data = window.localStorage.getItem('LOGIN_STATUS');
    if (browser_data !== null) {
      setUser(JSON.parse(browser_data));
    }
  }, []);

    // Effect to fetch liked recommendations when the user changes
  useEffect(() => {
    async function fetchLikedRecommendations() {
      setLoading(true);
            // Fetch liked recommendations data from 'likedReviews' table
      const { data: likedReviewsData, error: likedReviewsError } = await supabase
        .from('likedReviews')
        .select('*')
        .eq('username', user.username);

      if (likedReviewsError) {
        console.error('Error al obtener las recomendaciones marcadas como "like":', likedReviewsError);
        setLoading(false);
        return;
      }

      // Get IDs of recommendations marked as "like"
      const likedRecommendationIds = likedReviewsData.map(likedReview => likedReview.id_places);

      // Fetch information of liked recommendations from the 'places' table
      const { data: placesData, error: placesError } = await supabase
        .from('places')
        .select('*')
        .in('id_places', likedRecommendationIds);

      if (placesError) {
        console.error('Error al obtener la información de las recomendaciones desde la tabla "places":', placesError);
        setLoading(false);
        return;
      }

      // Combine information of liked recommendations with information from 'places'
      const likedRecommendationsWithPlaceInfo = likedReviewsData.map(likedReview => {
        const placeInfo = placesData.find(place => place.id_places === likedReview.id_places);
        return {
          ...likedReview,
          ...placeInfo
        };
      });

      setLikedRecommendations(likedRecommendationsWithPlaceInfo);
      setLoading(false);
    }

        // Fetch liked recommendations if the user has a username
    if (user.username) {
      fetchLikedRecommendations();
    }
  }, [user.username]);

    // Render star rating icons based on the given rating
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
    <div className="liked-places">
        <h2>Los lugares que mas te han gustado</h2>
        <div>
        {loading ? (
            <p>Cargando recomendaciones marcadas como "like"...</p>
        ) : likedRecommendations.length === 0 ? (
            <p>No has marcado ninguna recomendación como "like" todavía.</p>
        ) : (
            <div>
            {likedRecommendations.map((recommendation) => (
                <div key={recommendation.id_places} className="liked-recommendation-card">
                <Link to={`/MainPage/recommendation/${recommendation.id_places}`}>
                  <h3>{recommendation.name}</h3>
                </Link>
                <p>{recommendation.description}</p>
                <div className="rating-stars">{renderRatingStars(recommendation.rating)}</div>
                <img src={recommendation.image} alt={recommendation.name} />
                </div>
            ))}
            </div>
        )}
        </div>
    </div>
        
  );
}

export default LikeButton;
