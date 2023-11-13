// Import necessary libraries and styles
import React, { useState, useEffect } from 'react';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import { supabase } from '../../../../client';
import './comment.css';

// Define a functional component named "Comment" that takes a "selectedPlaceId" prop
function Comment({ selectedPlaceId }) {
  // Define and initialize state variables using the useState hook
  const [placeInfo, setPlaceInfo] = useState({});
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null);
  const [isCommentOpen, setIsCommentOpen] = useState(true);

  // useEffect hook with a dependency array to fetch place information when "selectedPlaceId" changes
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
    setIsCommentOpen(true); // Open the comment window
  }, [selectedPlaceId]);

  // useEffect hook to get user information from localStorage
  useEffect(() => {
    const userJSON = window.localStorage.getItem('LOGIN_STATUS');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
    }
  }, []);

  // Function to save a comment to the database
  async function saveComment() {
    if (comment.trim() === '') return;

    if (!user || !user.username) {
      console.error('Invalid user or user without a username.');
      return;
    }

    if (!selectedPlaceId) {
      console.error('Place ID not found.');
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
        
        console.log('Comment saved:', data);
        setComment('');
        setIsCommentOpen(false); // Close the comment window
      
      } catch (error) {
      console.error('Error saving the comment:', error);
    }
  }

  // Render the component if "isCommentOpen" is true, otherwise return null
  return isCommentOpen ? (
    <div className="comment-container">
      <h2>Escribe tu comentario</h2>
      <p>A: {placeInfo.name}</p>
      <textarea
        className="write-comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Escribe aquí..."
      />
      <button className="save-comment" onClick={saveComment}>Guardar</button>
      <button className="close-button" onClick={() => setIsCommentOpen(false)}>×</button>
    </div>
  ) : null;
}

// Export the "Comment" component as the default export
export default Comment;