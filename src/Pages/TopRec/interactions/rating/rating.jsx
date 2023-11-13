// Import necessary libraries and styles
import React, { useState, useEffect } from 'react';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import { supabase } from '../../../../client';
import './rating.css';

// Define a functional component named "Rating" that takes a "selectedPlaceId" prop
function Rating({ selectedPlaceId }) {
  // Define and initialize state variables using the useState hook
  const [placeInfo, setPlaceInfo] = useState({});
  const [selectedStars, setSelectedStars] = useState(0); // Initialize selectedStars to 0
  const [user, setUser] = useState(null);
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

  // useEffect hook to get user information from localStorage
  useEffect(() => {
    const userJSON = window.localStorage.getItem('LOGIN_STATUS');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
    }
  }, []);

  // Function to save the user's rating
  async function saveRating() {
    if (selectedStars === 0) return; // Check if no rating has been selected

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
        .from('ratings')
        .insert([
          {
            id_places: selectedPlaceId,
            username: user.username,
            rate: selectedStars, // Save the rating as an integer
          },
        ])
        .single();

      if (error) {
        console.error('Error saving the rating:', error);
      } else {
        setSelectedStars(0); // Reset the selected rating
        setisRatingOpen(false); // Close the rating component
      }
    } catch (error) {
      console.error('Error saving the rating:', error);
    }
  }

  // Function to handle rating clicks
  const handleRatingClick = (event) => {
    const value = parseInt(event.target.getAttribute('data-value'), 10);
    setSelectedStars(value);
  };

  // Create an array of star icons for rating
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
      <button className="save-rating" onClick={saveRating}>Guardar</button>
    </div>
  ) : null;
}

// Export the "Rating" component as the default export
export default Rating;
