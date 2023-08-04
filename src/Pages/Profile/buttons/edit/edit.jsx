import React, { useState } from 'react';
import '/src/Components/texts.css';
import '/src/Components/display.css';
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

  function handleInputChange(event) {
    const { name, value } = event.target;
    // Si el campo es 'rating', convierte el valor a un número
    const parsedValue = name === 'rating' ? parseInt(value, 10) : value;
    setEditedRecommendation((prevRecommendation) => ({
      ...prevRecommendation,
      [name]: parsedValue,
    }));
  }

  async function handleSaveClick() {
    console.log('edit:', editedRecommendation)
    try {
      const { data, error } = await supabase
        .from('places')
        .update(editedRecommendation)
        .eq('id_places', recommendation.id_places);

      if (error) {
        console.error('Error al actualizar la recomendación:', error);
      } else {
        onSave(); 
        setShowSuccessMessage(true); 
        // Reload the page after saving
        window.location.reload();
      }
    } catch (error) {
      console.error('Error al actualizar la recomendación:', error);
    }
  }


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
          <input
            data-testid="input-rating"
            className="input-edit"
            type="number"
            name="rating"
            value={editedRecommendation.rating}
            onChange={handleInputChange}
          />
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