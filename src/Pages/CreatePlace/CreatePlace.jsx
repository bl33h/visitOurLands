import { useState, useEffect, useRef} from 'react';
import { supabase } from '../../client';
import './CreatePlace.css'

function CreatePlace() {
  const selectRef = useRef(null);
  const [listDepartments, setDepartments] = useState([])
  const [placesData, setPlacesData] = useState([])
  const [user, setUser] = useState({})
  const [placeData, setPlaceData] = useState({
    id_places: 0,
    name: '',
    description: '',
    rating: 0,
    department: 0,
    imageUrl: ''
  });

  useEffect(() => {
    fetchPosts()
    const browser_data = window.localStorage.getItem('LOGIN_STATUS')
    if (browser_data !== null) setUser(JSON.parse(browser_data))
}, [])

  async function fetchPosts() {
    await fetchPost()
    await fetchPost2()
  }

  async function fetchPost() {
    const { data } = await supabase.from('departments').select()
    setDepartments(data)
  }

  async function fetchPost2() {
    const { data } = await supabase.from('places').select()
    setPlacesData(data)
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
    // Obtener el valor seleccionado del elemento <select> a través de la referencia
    const departmentValue = selectRef.current.value;
    console.log(departmentValue);
  
    // Obtener el nombre de usuario del estado user
    const username = user.username;
  
    const place = {
      id_places: placesData.length + 1,
      name: document.getElementById('name-id').value,
      description: document.getElementById('description-id').value,
      rating: document.getElementById('rating-id').value,
      department: departmentValue,
      imageUrl: document.getElementById('imageUrl-id').value,
      author: username, // Agregar el nombre de usuario como 'author' en el objeto place
    };
  
    // Realizar la inserción del lugar en la base de datos (usando supabase)
    const { data, error } = await supabase.from('places').insert([
      {
        id_places: place.id_places,
        name: place.name,
        description: place.description,
        rating: place.rating,
        id_departments: departmentValue,
        image: place.imageUrl,
        author: place.author, // Insertar el nombre de usuario en la columna 'author'
      },
    ]);
  
    if (error) {
      console.error('Error al insertar el lugar:', error);
    } else {
      console.log('Lugar insertado exitosamente:', place);
      // Limpiar los campos después de la inserción exitosa
      setPlaceData({
        name: '',
        description: '',
        rating: 0,
        department: 0,
        imageUrl: '',
      });
    }
  };


  return (
    <div className="container-CreatePlace">
      <h1>Crear un nuevo lugar</h1>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="name" className="label">Nombre:</label>
        <input
          type="text"
          id="name-id"
          name="name"
          className="name"
          value={placeData.name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="description" className="label">Descripción corta:</label>
        <textarea
          id="description-id"
          name="description"
          className="description-place"
          value={placeData.description}
          onChange={handleInputChange}
          required
        ></textarea>

        <label htmlFor="rating" className="label">Rating:</label>
        <input
          type="number"
          id="rating-id"
          name="rating"
          className="rating"
          min="1"
          max="5"
          value={placeData.rating}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="departments" className="label">Departamento:</label>
            <select id="departments-id" className="select-department" ref={selectRef}>
              <>
              <option className="label" value="" >Seleccione una opción </option>
              {listDepartments &&
              <>
                {listDepartments.map(e => (
                  <option key={e.id_departments} value={e.id_departments}>{e.name}</option>
                ))}
              </>
            }
              </>
            </select>

        <label htmlFor="imageUrl" className="label">Link de la imagen:</label>
        <input
          type="text"
          id="imageUrl-id"
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
