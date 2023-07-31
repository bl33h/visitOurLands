import { useState, useEffect } from 'react';
import { supabase } from '../../client';
import './TopRec.css';

function TopRec(){
    const [user, setUser] = useState({});
    const [loadingRecommendations, setLoadingRecommendations] = useState(true);
    const [userRecommendations, setUserRecommendations] = useState([]);
    const [departmentName, setDepartmentName] = useState('');

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

    return(
        <div className="RecDiv">
            <h1 className="Header">¡Estos son los lugares mejor valorados!</h1>
            <div className="user-recommendations">
            {loadingRecommendations ? (
            <p>Cargando recomendaciones...</p>
            ) : userRecommendations.length === 0 ? (
            <p>Aún no hay recomendaciones para mostrar</p>
            ) : (
            <div className="recommendations-container">
                {userRecommendations.map((recommendation) => (
                <div key={recommendation.id_places} className="recommendation-card2">
                    <h3>{recommendation.name}</h3>
                    <h3>{recommendation.departmentName}</h3>
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

export default TopRec;