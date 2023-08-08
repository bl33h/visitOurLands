import { useState, useEffect, useRef} from 'react';
import { supabase } from '../../client';
import './CreatePlace.css'
import { Print, Upload } from '@mui/icons-material';
import { v4 as uuidv4 } from "uuid";


function CreatePlace() {
  const MAX_DESCRIPTION_LENGTH = 280;
  const selectRef = useRef(null);
  const [urlimage, setImageUrl] = useState('');
  const[ PlacesImages, setPlacesImages] = useState([]);
  const [listDepartments, setDepartments] = useState([]);
  const [placesData, setPlacesData] = useState([]);
  const [user, setUser] = useState({});
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [image, setImage] = useState(); 
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

  //Funcion para obtener la imagen
  async function getImage() {
    const { data, error } = await supabase
      .storage
      .from('PlacesImages')
      .list(placeData?.id_places + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" }
      });
    if (data !== null) {
      setPlacesImages(data); 
    } else {
      alert("Error al cargar la imagen");
      console.log(error);
    }
  } 
  
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
    // Obtener el valor seleccionado del elemento <select> a través de la referencia
    const departmentValue = selectRef.current.value;
    console.log(departmentValue);
  
    // Obtener el nombre de usuario del estado user
    const username = user.username;
  
    const place = {
      id_places: placesData.length + 1,
      name: document.getElementById('name-id').value,
      description: document.getElementById('description-id').value,
      rating: selectedStars,
      department: departmentValue,
      imageUrl: document.getElementById('imageUrl-id').value,
      author: username, // Agregar el nombre de usuario como 'author' en el objeto place
    };

    //Funcion para subir la imagen y colocarle una ruta
  async function uploadImage(e){
    let file = e.target.files[0];
    console.log(file);
    setImage(file);
  }

  async function onPressButton(){
    console.log(image);
    if (!image) {
      console.log("Debes seleccionar una imagen primero.");
      setImageLoaded(false)
    }
    //Subir la imagen al bucket
    var temp = placesData.length + 1 + uuidv4();
    const { data, error } = await supabase
      .storage
      .from('PlacesImages')
      .upload(temp, image)

    console.log(placesData.length + 1);
    console.log(temp);
    setImageUrl(temp)
    
    if(data){
      getImage();
      
    } else {
      console.log(error);
    }
  }
  
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
      setSelectedStars(0);
      setHoveredStars(0);
      selectRef.current.value = "";
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
          maxLength={MAX_DESCRIPTION_LENGTH} // Limitar la descripción a 280 caracteres
          required
        ></textarea>

        {placeData.description.length >= MAX_DESCRIPTION_LENGTH && (
                  <p className="description-warning">
                    Ha alcanzado el máximo de caracteres permitidos (280).
                  </p>
                )}
        <label htmlFor="rating" className="label">Rating:</label>
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
        <div className="label" >
          <input id="id_ImageUrl" name="ImageUrl" type="file" accept="image/png, image/jpg, image/jpeg" onChange={(e) => uploadImage(e)}/>
        </div>
        <br></br>
        <button type="submit" className="submit">Crear lugar</button>
      </form>
    </div>
  );
}

export default CreatePlace;