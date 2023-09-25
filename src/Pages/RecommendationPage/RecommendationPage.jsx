import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../client';
import './RecommendationPage.css';

function RecommendationPage() {
  const { recommendationId } = useParams();
  const [recommendationData, setRecommendationData] = useState(null);
  const [comments, setComments] = useState(null);
  const [relatedRecommendations, setRelatedRecommendations] = useState([]);

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

  return (
    <div className="recommendation-page">
        <div className="recommendation-details">
        {recommendationData ? (
          <>
            <h1>{recommendationData.name}</h1>
            <p>{recommendationData.description}</p>
            <img src={recommendationData.image} alt={recommendationData.name} />
          </>
        ) : (
          <p>Cargando...</p>
        )}
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
          <><p>No se encontraron lugares turísticos relacionados. Aquí hay algunas recomendaciones populares:</p><ul>
                          {relatedRecommendations.map((best) => (
                              <li key={best.id_places}>
                                  <a href={`/MainPage/recommendation/${best.id_places}`}>{best.name}</a>
                                  <img src={best.image} alt={best.name} />
                              </li>
                          ))}
                      </ul></>
        )}
      </div>
    </div>
  );
}

export default RecommendationPage;
