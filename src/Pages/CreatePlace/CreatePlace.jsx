import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../client';
import './CreatePlace.css';
import { v4 as uuidv4 } from "uuid";


function CreatePlace() {
  const [newIdValue, setNewIdValue] = useState(0);
  let maxId = 0;
  const MAX_DESCRIPTION_LENGTH = 280;
  const selectRef = useRef(null);
  const [listDepartments, setDepartments] = useState([]);
  const [placesData, setPlacesData] = useState([]);
  const [user, setUser] = useState({});
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [image] = useState();
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

    for (const place of data) {
      if (place.id_places > maxId) {
        maxId = place.id_places;
      }
    }    // Set the newIdValue globally
    setNewIdValue(maxId + 1); // Next available id
    console.log("Global New ID Value:", newIdValue);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPlaceData({ ...placeData, [name]: value });
  };

  const handleRatingClick = (event) => {
    const value = parseInt(event.target.getAttribute("data-value"), 10);
    setSelectedStars(value);
  };

  const handleRatingHover = (event) => {
    const value = parseInt(event.target.getAttribute("data-value"), 10);
    setHoveredStars(value);
  };

  const handleRatingLeave = () => {
    setHoveredStars(0);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Sube la imagen
    onPressButton()
    }

    async function uploadImage(e) {
      let file = e.target.files[0];
    
      if (file) {
        // Generar un nombre único para la imagen
        const imageName = uuidv4(); 
        const folderName = 'images';
        // Construir la ruta completa
        const imagePath = `${folderName}/${imageName}`; 
    
        const { error } = await supabase.storage
          // Reemplaza 'tu_bucket_de_imagenes' con el nombre de tu bucket
          .from('PlacesImages') 
          .upload(imagePath, file);
    
        if (error) {
          console.error('Error al cargar la imagen:', error);
        } else {
          // Usar imagePath en lugar de data.Key
          console.log('Imagen cargada con éxito:', imagePath);
          // Obtener la URL pública de la imagen recién cargada
          const imageUrlResponse = await supabase.storage
            .from('PlacesImages')
            // Usar imagePath en lugar de data.Key
            .getPublicUrl(imagePath);
          // Obtener solo la URL
          const imageUrl = imageUrlResponse.data.publicUrl;
          // Actualizar el estado con la URL de la imagen
          setPlaceData({ ...placeData, imageUrl });
        }
      }
    }
    
    
    async function onPressButton() {
      console.log(image);
      if (!image) {
        console.log("Debes seleccionar una imagen primero.");
      }
    
      // Subir la imagen al bucket
      if (placeData.imageUrl) {
        const { error } = await supabase
          .from('places')
          .insert([
            {
              id_places: newIdValue,
              name: placeData.name,
              description: placeData.description,
              rating: selectedStars,
              id_departments: selectRef.current.value,
              image: placeData.imageUrl, // Usar la URL de la imagen
              author: user.username,
            },
          ]);
    
        if (error) {
          console.error('Error al insertar el lugar:', error);
        } else {
          console.log('Lugar insertado exitosamente:', placeData);
          // Limpiar los campos después de la inserción exitosa
          setPlaceData({
            name: '',
            description: '',
            rating: 0,
            department: 0,
            imageUrl: '',
          });
          setSelectedStars(0);
          setHoveredStars(0);
          selectRef.current.value = '';
        }
      }
    }
    
  return (
    <div className="root">
      <div className="container-CreatePlace">
        <h1 className="h1-create">Crear un nuevo lugar</h1>
        <form className="create-form" onSubmit={handleFormSubmit}>
          <label htmlFor="name" data-testid="nombre-label" className="label">Nombre:</label>
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
            maxLength={MAX_DESCRIPTION_LENGTH} // Limitar la descripción a 280 caracteres
            required
          ></textarea>

          {placeData.description.length >= MAX_DESCRIPTION_LENGTH && (
                    <p className="description-warning">
                      Ha alcanzado el máximo de caracteres permitidos (280).
                    </p>
                  )}
          <label htmlFor="rating" className="label">Rating:</label>
          <div className="cont-rating-create">
            <div className="ec-stars-wrapper">
              <a
                href="#"
                data-value="1"
                title="Votar con 1 estrellas"
                onClick={handleRatingClick}
                onMouseEnter={handleRatingHover}
                onMouseLeave={handleRatingLeave}
                data-testid="rating-stars"
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
                data-testid="rating-stars"
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
                data-testid="rating-stars"
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

          <label htmlFor="imageUrl" className="label">Selecciona tu imagen</label>
          <br></br>
          <div className="label-upload" >
            <input id="id_ImageUrl" name="ImageUrl" type="file" accept="image/png, image/jpg, image/jpeg" onChange={(e) => uploadImage(e)}/>
          </div>
          <br></br>
          <button type="submit" className="submit">Crear lugar</button>
        </form>
      </div>
    </div>
  );
}

export default CreatePlace;
