import { useState } from 'react';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import { supabase } from '/src/client';
import "./edit.css";
import { useHistory } from 'react-router-dom'; // Import useHistory hook

function EditRecommendations({ recommendation, onSave, onCancelEdit }) {
  const [editedRecommendation, setEditedRecommendation] = useState({
    name: recommendation.name,
    description: recommendation.description,
    rating: recommendation.rating,
    image: recommendation.image,
  });

  const history = useHistory(); // Initialize useHistory

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
        onSave(data[0]); // Updated recommendation data returned from Supabase

        // Redirect to recommendations page after saving
        history.push('./Profile'); // Replace '/recommendations' with the actual path to your recommendations page
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
