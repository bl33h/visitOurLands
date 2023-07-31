import { useState } from 'react';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import { supabase } from '/src/client';
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
    setEditedRecommendation((prevRecommendation) => ({
      ...prevRecommendation,
      [name]: value,
    }));
  }

  async function handleSaveClick() {
    try {
      const { data, error } = await supabase
        .from('places')
        .update(editedRecommendation)
        .eq('id_places', recommendation.id_places);

      if (error) {
        console.error('Error al actualizar la recomendación:', error);
      } else {
        onSave(); // Hide the form after saving
        setShowSuccessMessage(true); // Show success message
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
            className="descriptionPlace"
            name="description"
            value={editedRecommendation.description}
            onChange={handleInputChange}
          />
        </label>
        <label className="other">
          Rating:
          <input
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
