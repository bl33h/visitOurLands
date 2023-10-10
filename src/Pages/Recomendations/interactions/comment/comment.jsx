import React, { useState, useEffect } from 'react';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import { supabase } from '../../../../client';
import './comment.css';

function Comment({ selectedPlaceId }) {
  const [placeInfo, setPlaceInfo] = useState({});
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null);

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
  }, [selectedPlaceId]);

  useEffect(() => {
    // Obtener el usuario del localStorage
    const userJSON = window.localStorage.getItem('LOGIN_STATUS');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
    }
  }, []);

  async function saveComment() {
    if (comment.trim() === '') return;

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
        .from('comments')
        .insert([
          {
            id_places: selectedPlaceId,
            username: user.username,
            message: comment.trim(),
          },
        ])
        .single();

        if (error) {
          console.error('Error al guardar el comentario:', error);
        } else {
        console.log('Comentario guardado:', data);
        setComment('');
      }
    } catch (error) {
        console.error('Error al guardar el comentario:', error);
    }
  }

  return (
    <div className="root">
      <div className="container">
        <h2>Escribe tu comentario</h2>
        <p>A: {placeInfo.name}</p>
        <textarea
          className="write-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribe aquí..."
        />
        <button className="save-comment" onClick={saveComment}>Guardar</button>
      </div>
    </div>
  );
}

export default Comment;