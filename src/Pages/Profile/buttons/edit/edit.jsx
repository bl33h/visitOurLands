import React, { useState } from 'react';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import { useHistory } from 'react-router-dom'
import { supabase } from '../../../../client';
import "./edit.css";

function EditRecommendations({ recommendation, onSave, onCancelEdit }) {
  const [editedRecommendation, setEditedRecommendation] = useState({
    name: recommendation.name,
    description: recommendation.description,
    rating: recommendation.rating,
    image: recommendation.image,
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // New state for showing success message
  const [selectedStars, setSelectedStars] = useState(editedRecommendation.rating);
  const [hoveredStars, setHoveredStars] = useState(editedRecommendation.rating);
  const history = useHistory();

    // Handle input changes
  function handleInputChange(event) {
    const { name, value } = event.target;
    // If the field is 'rating', convert the value to a number
    const parsedValue = name === 'rating' ? parseInt(value, 10) : value;
    setEditedRecommendation((prevRecommendation) => ({
      ...prevRecommendation,
      [name]: parsedValue,
    }));
  }

    // Handle click on the star rating
  const handleRatingClick = (event) => {
    const value = parseInt(event.target.getAttribute("data-value"), 10);
    setSelectedStars(value);
  };

    // Handle hover over the star rating
  const handleRatingHover = (event) => {
    const value = parseInt(event.target.getAttribute("data-value"), 10);
    setHoveredStars(value);
  };

    // Handle leaving the star rating
  const handleRatingLeave = () => {
    setHoveredStars(0);
  };

    // Handle saving the edited recommendation
  async function handleSaveClick() {
    editedRecommendation.rating = selectedStars;
    console.log('edit:', editedRecommendation);
    try {
      const { data, error } = await supabase
        .from('places')
        .update(editedRecommendation)
        .eq('id_places', recommendation.id_places);
  
      if (error) {
        console.error('Error al actualizar la recomendación:', error);
      } else {
        onSave(editedRecommendation); // Pass the updated recommendation to the onSave function
        setShowSuccessMessage(true);
      }
    } catch (error) {
      console.error('Error al actualizar la recomendación:', error);
    }
  }

  // Handle canceling the edit
  function handleCancelClick() {
    onCancelEdit();
  }

  return (
    <div className="edit-recommendations-container">
      <h2 className="title">Editar Recomendación</h2>
      {showSuccessMessage && <p>¡Recomendación editada correctamente!</p>}
      <form className="editing">
        <label className="Placename">
          Nombre del lugar: {editedRecommendation.name}
        </label>
        <label className="other">
          Descripción:
          <textarea
            data-testid="input-description"
            className="descriptionPlace"
            name="description"
            value={editedRecommendation.description}
            onChange={handleInputChange}
          />
        </label>
        <label className="other">
          Rating:
          <div className="cont-rating">
            <div className="ec-stars-wrapper">
              <a
                href="#"
                data-value="1"
                title="Votar con 1 estrellas"
                onClick={handleRatingClick}
                onMouseEnter={handleRatingHover}
                onMouseLeave={handleRatingLeave}
                className={hoveredStars >= 1 || selectedStars >= 1 ? "filled" : ""}
              >
                &#9733;
              </a>
              <a
                href="#"
                data-value="2"
                title="Votar con 2 estrellas"
                onClick={handleRatingClick}
                onMouseEnter={handleRatingHover}
                onMouseLeave={handleRatingLeave}
                className={hoveredStars >= 2 || selectedStars >= 2 ? "filled" : ""}
              >
                &#9733;
              </a>
              <a
                href="#"
                data-value="3"
                title="Votar con 3 estrellas"
                onClick={handleRatingClick}
                onMouseEnter={handleRatingHover}
                onMouseLeave={handleRatingLeave}
                className={hoveredStars >= 3 || selectedStars >= 3 ? "filled" : ""}
              >
                &#9733;
              </a>
              <a
                href="#"
                data-value="4"
                title="Votar con 4 estrellas"
                onClick={handleRatingClick}
                onMouseEnter={handleRatingHover}
                onMouseLeave={handleRatingLeave}
                className={hoveredStars >= 4 || selectedStars >= 4 ? "filled" : ""}
              >
                &#9733;
              </a>
              <a
                href="#"
                data-value="5"
                title="Votar con 5 estrellas"
                onClick={handleRatingClick}
                onMouseEnter={handleRatingHover}
                onMouseLeave={handleRatingLeave}
                className={hoveredStars >= 5 || selectedStars >= 5 ? "filled" : ""}
              >
                &#9733;
              </a>
            </div>
          </div>
        </label>
        <label className="other">
          Imagen:
          <input
            data-testid="input-image"
            className="input-edit"
            type="text"
            name="image"
            value={editedRecommendation.image}
            onChange={handleInputChange}
          />
        </label>

        <div className="action-buttons">
          <button type="button" className="save-button" onClick={handleSaveClick}>Guardar</button>
          <button type="button" className="cancel-button" onClick={handleCancelClick}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default EditRecommendations;