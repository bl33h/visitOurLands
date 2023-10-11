import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../client';
import './RecommendationPage.css';

function RecommendationPage() {
  const { recommendationId } = useParams();
  const [recommendationData, setRecommendationData] = useState(null);
  const [comments, setComments] = useState(null);
  const [relatedRecommendations, setRelatedRecommendations] = useState([]);
  const [reviews, setReviews] = useState(null);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    async function fetchRecommendationData() {
      try {
        const { data, error } = await supabase
          .from('places')
          .select('*')
          .eq('id_places', recommendationId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const { data: departmentData, error: departmentError } = await supabase
            .from('departments')
            .select('name')
            .eq('id_departments', data.id_departments)
            .single();

          if (departmentData) {
            data.departmentName = departmentData.name;
          }

          setRecommendationData(data);
        }
      } catch (error) {
        console.error('Error al cargar los detalles de la recomendación:', error);
      }
    }
    async function fetchComments() {
        try {
          const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('id_places', recommendationId);
      
          if (error) {
            throw error;
          }
      
          if (data) {
            setComments(data);
          }
        } catch (error) {
          console.error('Error al cargar los comentarios:', error);
        }
      }
      

    fetchRecommendationData();
    fetchComments();
  }, [recommendationId]);

  useEffect(() => {
    async function fetchRelatedRecommendations() {
      try {
        const { data: relatedData, error: relatedError } = await supabase
          .from('places')
          .select('*')
          .eq('id_departments', recommendationData.id_departments)
          .neq('id_places', recommendationId)
          .limit(5)
          .order('rating', { ascending: false });

        if (relatedError || !relatedData || relatedData.length === 0) {
          const { data: bestData, error: bestError } = await supabase
            .from('places')
            .select('*')
            .neq('id_places', recommendationId)
            .limit(5)
            .order('rating', { ascending: false });

          if (bestError) {
            throw bestError;
          }

          if (bestData) {
            setRelatedRecommendations(bestData);
          }
        } else {
          setRelatedRecommendations(relatedData);
        }
      } catch (error) {
        console.error('Error al cargar las recomendaciones relacionadas:', error);
      }
    }

    if (recommendationData) {
      fetchRelatedRecommendations();
    }
  }, [recommendationData, recommendationId]);

  useEffect(() => {
    async function fetchInitialRating() {
      // Realiza una consulta a la tabla de places para obtener el rating inicial
      const { data, error } = await supabase
        .from('places')
        .select('rating')
        .eq('id_places', recommendationId);
    
      if (error) {
        console.error('Error al obtener el rating inicial:', error);
        return 0; // Valor por defecto si hay un error
      }
    
      return data[0].rating || 0; // Devuelve el rating inicial o 0 si no se encuentra
    }
    
    async function fetchReviewsAndAverageRating() {
      const initialRating = await fetchInitialRating();
    
      // Realiza una consulta a la tabla de calificaciones y reseñas
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('id_places', recommendationId);
    
      if (error) {
        console.error('Error al obtener las reseñas:', error);
        return;
      }
    
      // Calcula el promedio de las calificaciones teniendo en cuenta el rating inicial
      const totalRatings = data.length;
      const sumOfRatings = data.reduce((sum, review) => sum + review.rate, initialRating);
      const averageRating = totalRatings > 0 ? sumOfRatings / (totalRatings + 1) : initialRating;
    
      // Actualiza el estado con las reseñas y el promedio
      setReviews(data);
      setAverageRating(averageRating);

      // Actualiza el valor de avg_rating en la base de datos
      const { error: updateError } = await supabase
      .from('places')
      .update({ avg_rating: averageRating })
      .eq('id_places', recommendationId);

      if (updateError) {
        console.error('Error al actualizar avg_rating en la base de datos:', updateError);
      }
    }
    fetchInitialRating();
    fetchReviewsAndAverageRating();
  },[recommendationId]);

  function renderRatingStarsWithAverage(rating) {
    const stars = [];
    const totalStars = 5;
    const averageRating = parseFloat(rating); // Convierte el rating en un número decimal
  
    for (let i = 1; i <= totalStars; i++) {
      if (i <= averageRating) {
        stars.push(<i key={i} className="fas fa-star filled-star"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star empty-star"></i>);
      }
    }
  
    return (
      <div className="rating-stars">
        <span className="average-rating">{averageRating.toFixed(1)}</span>
        {stars}
      </div>
    );
  }
  

  return (
    <div className="recommendation-page">
        <div className="recommendation-details">
        {recommendationData ? (
          <>
            <h1>{recommendationData.name}</h1>
            <h2>{recommendationData.departmentName}</h2>
            <p>{recommendationData.description}</p>
            <img src={recommendationData.image} alt={recommendationData.name} />
          </>
        ) : (
          <p>Cargando...</p>
        )}
        <div className="rating-container">
          <span className="rating-text">Promedio:</span>
          {renderRatingStarsWithAverage(averageRating)}
        </div>
        {comments && (
        <div className="comments-container">
            <h2>Comentarios</h2>
            <ul>
            {comments.map((comment) => (
                <li key={comment.id_comments}>
                <p>{comment.username}: {comment.message}</p>
                </li>
            ))}
            </ul>
        </div>
        )}
      </div>

      <div className="related-recommendations">
        {relatedRecommendations.length > 0 ? (
          <>
            <h2>Tal vez te interesen estos lugares turísticos:</h2>
            <ul>
              {relatedRecommendations.map((related) => (
                <li key={related.id_places}>
                  <a href={`/MainPage/recommendation/${related.id_places}`}>{related.name}</a>
                  <img src={related.image} alt={related.name} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
          <p>No se encontraron lugares turísticos relacionados. Aquí hay algunas recomendaciones populares:</p>
          <ul>
            {relatedRecommendations.map((best) => (
              <li key={best.id_places}>
                <Link to={`/recommendation/${best.id_places}`}>{best.name}</Link>
                <img src={best.image} alt={best.name} />
              </li>
            ))}
          </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default RecommendationPage;
