import { useState } from 'react';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import { supabase } from '/src/client';
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
      <h2>Editar Recomendación</h2>
      <form>
        <label>
          Nombre: {editedRecommendation.name}
        </label>
        <label>
          Descripción:
          <textarea
            name="description"
            value={editedRecommendation.description}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Rating:
          <input
            type="number"
            name="rating"
            value={editedRecommendation.rating}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Imagen:
          <input
            type="text"
            name="image"
            value={editedRecommendation.image}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handleSaveClick}>Guardar</button>
        <button type="button" onClick={handleCancelClick}>Cancelar</button>
      </form>
    </div>
  );
}

export default EditRecommendations;
