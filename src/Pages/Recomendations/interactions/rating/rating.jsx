import React, { useState, useEffect } from 'react';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import { supabase } from '../../../../client';
import './rating.css';

function Rating({ selectedPlaceId }) {
  const [placeInfo, setPlaceInfo] = useState({});
  const [rate, setRate] = useState('');
  const [user, setUser] = useState(null);
  const [selectedStars, setSelectedStars] = useState(0); // Inicializar selectedStars como 0
  const [isRatingOpen, setisRatingOpen] = useState(true);

  useEffect(() => {
    async function fetchPlaceInfo() {
      if (selectedPlaceId) {
        const { data, error } = await supabase
          .from('places')
          .select('name, description, image')
          .eq('id_places', selectedPlaceId)
          .single();

        if (error) {
          console.error('Error fetching place info:', error);
        } else {
          setPlaceInfo(data);
        }
      }
    }

    fetchPlaceInfo();
    setisRatingOpen(true);
  }, [selectedPlaceId]);

  useEffect(() => {
    const userJSON = window.localStorage.getItem('LOGIN_STATUS');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
    }
  }, []);

  async function saveRating() {
    if (selectedStars === 0) return; // Verificar si no se ha seleccionado una calificación

    if (!user || !user.username) {
      console.error('Usuario no válido o sin nombre.');
      return;
    }

    if (!selectedPlaceId) {
      console.error('ID de lugar no encontrado.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ratings')
        .insert([
          {
            id_places: selectedPlaceId,
            username: user.username,
            rate: selectedStars, // Guardar la calificación como un número entero
          },
        ])
        .single();

      if (error) {
        console.error('Error al guardar la calificación:', error);
      } else {
        setSelectedStars(0);
        setisRatingOpen(false);
      }
    } catch (error) {
      console.error('Error al guardar la calificación:', error);
    }
  }

  const handleRatingClick = (event) => {
    const value = parseInt(event.target.getAttribute('data-value'), 10);
    setSelectedStars(value);
  };

  const stars = [1, 2, 3, 4, 5].map((value) => (
    <a
      key={value}
      href="#"
      data-value={value}
      title={`Votar con ${value} estrellas`}
      onClick={handleRatingClick}
      className={`ec-stars-item ${selectedStars >= value ? 'filled' : ''}`}
    >
      &#9733;
    </a>
  ));

  return isRatingOpen ? (
    <div className="raiting">
      <h2>Califica con estrellas</h2>
      <p>A: {placeInfo.name}</p>
      <div className="ec-stars-wrapper">{stars}</div>
      <button className="save-rating" onClick={saveRating}>Guardar</button>    </div>
  ) : null;
}

export default Rating;
