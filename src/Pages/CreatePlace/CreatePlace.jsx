import { useState, useEffect } from 'react';
import { supabase } from '../../client';
import './CreatePlace.css'

function CreatePlace() {
  const [listDepartments, setDepartments] = useState([])
  const [placeData, setPlaceData] = useState({
    name: '',
    description: '',
    rating: 0,
    department: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchPosts()
}, [])

  async function fetchPosts() {
    await fetchPost()
  }

  async function fetchPost() {
    const { data } = await supabase.from('departments').select()
    setDepartments(data)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPlaceData({ ...placeData, [name]: value });
  };

  const handleRatingChange = (event) => {
    const rating = parseInt(event.target.value);
    setPlaceData({ ...placeData, rating });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Realizar la inserción del lugar en la base de datos (usando supabase)
    await supabase.from('places').insert([placeData]);
    // Reiniciar los datos del lugar después de la inserción exitosa
    setPlaceData({
      name: '',
      description: '',
      rating: 0,
      department: '',
      imageUrl: ''
    });
  };

  return (
    <div className="container-CreatePlace">
      <h1>Crear un nuevo lugar</h1>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="name" className="label">Nombre:</label>
        <input
          type="text"
          id="name"
          name="name" 
          className="name"
          value={placeData.name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="description" className="label">Descripción corta:</label>
        <textarea
          id="description"
          name="description" 
          className="description-place"
          value={placeData.description}
          onChange={handleInputChange}
          required
        ></textarea>

        <label htmlFor="rating" className="label">Rating:</label>
        <input
          type="number"
          id="rating"
          name="rating" 
          className="rating"
          min="1"
          max="5"
          value={placeData.rating}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="departments" className="label">Departamento:</label>
          <select id="departments" className="select-department" >
            <>
            <option className="label" value="department-option" >Seleccione una opción </option>
            {listDepartments&&(
            <>
            {listDepartments.map(e=> (
            <>
            <option value ={e.name}>{e.name}</option>
            </>))}
            </>)}
            </>
          </select>

        <label htmlFor="imageUrl" className="label">Link de la imagen:</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl" 
          className="imageUrl"
          value={placeData.imageUrl}
          onChange={handleInputChange}
          required
        />

        <button type="submit" className="submit">Crear lugar</button>
      </form>
    </div>
  );
}

export default CreatePlace;
