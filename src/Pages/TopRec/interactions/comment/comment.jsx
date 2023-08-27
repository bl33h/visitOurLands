import React, { useState } from 'react';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import { supabase } from '../../../../client';
import 'comment.css'

function Comment(){

    const [placeInfo, setPlaceInfo] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        async function fetchPlaceInfo() {
          if (selectedPlaceId) {
            const { data, error } = await supabase
              .from('places')
              .select('name, description, image')
              .eq('id', selectedPlaceId)
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

    if (!placeInfo) {
        return <div>Loading...</div>;        
    }

    async function saveComment() {
        if (comment.trim() === '') return;
    
        const { data, error } = await supabase
          .from('comments')
          .insert([{ place_id: selectedPlaceId, comment }])
          .single();
    
        if (error) {
          console.error('Error saving comment:', error);
        } else {
          console.log('Comment saved:', data);
          setComment('');
        }
    }
    
    return(
        <div className="root">
            <div className="container">
                <h2>Sección de comentarios</h2>
                <h3>{placeInfo.name}</h3>
                <p>{placeInfo.description}</p>
                <img src={recommendation.image} alt={recommendation.name} />
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escribe tu comentario..."
                />
                <button onClick={saveComment}>Guardar comentario</button>
            </div>
        </div>
    );
}

export default Comment;