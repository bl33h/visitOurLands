import { useState, useEffect } from 'react';
import './Profile.css';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import profileImage from '../../assets/profile.png';
import { supabase } from '../../client';
import edit from '../../assets/1.png';
import save from '../../assets/2.png';
import like from '../../assets/3.png';
import EditButton from './buttons/edit/EditButton';
import LikeButton from './buttons/like/LikeButton';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";

function Profile() {
  const [user, setUser] = useState({});
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [showInitialInfo, setShowInitialInfo] = useState(true); // Estado para mostrar/ocultar recomendaciones iniciales
  const [showEditButton, setShowEditButton] = useState(false);
  const [showLikeButton, setShowLikeButton] = useState(false);
  const [urlimage, setImageUrl] = useState('');
  const[ ProfilePictures, setProfilePictures] = useState([]);
  const [image, setImage] = useState(); 
  const [userData, setUserData] = useState({
    username: '',
    imageUrl: ''
  });
  const [selectedImage, setSelectedImage] = useState(null); 
  const [uploading, setUploading] = useState(false); 

  const inputRef = useState(null);

  const handleImageClick = () => {
    inputRef.current.click();

  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file)); // Muestra la imagen seleccionada
    setImage(file);

  }

  const handleImageUpload = async () => {
    if (image && !uploading) { // Evita cargar si ya se está cargando una imagen
      setUploading(true);

      const imageName = uuidv4();
      const folderName = 'images';
      const imagePath = `${folderName}/${imageName}`;

      try {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ProfilePictures')
            .upload(imagePath, image);

          if (uploadError) {
            console.error('Error al cargar la imagen:', uploadError);
          } else {
            console.log('Imagen cargada con éxito:', imagePath);

            const imageUrlResponse = await supabase.storage
              .from('ProfilePictures')
              .getPublicUrl(imagePath);

            const imageUrl = imageUrlResponse.data.publicUrl;
            setUserData({ ...userData, imageUrl });

            const { error: updateError } = await supabase
            .from('users')
            .update({ images: imageUrl })
            .eq('username', user.username);

            if (updateError) {
              console.error('Error al actualizar la URL de la imagen en la base de datos:', updateError);
            } else {
              console.log('URL de imagen actualizada en la base de datos del usuario.');
            }
          }
        } catch (error) {
          console.error('Error en handleImageUpload:', error);
        } finally {
          setUploading(false); // Marca la carga como completa
        }
      }
    }

  useEffect(() => {
    // Local storage
    const browser_data = window.localStorage.getItem('LOGIN_STATUS');
    if (browser_data !== null) {
      setUser(JSON.parse(browser_data));
    }
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Obtén la información del usuario de la tabla 'users' por su nombre de usuario
        const { data, error } = await supabase
          .from('users')
          .select('images')
          .eq('username', user.username)
          .single(); // Obtén solo una fila, ya que se supone que el nombre de usuario es único

        if (error) {
          console.error('Error al obtener la información del usuario:', error);
        } else {
          // Actualiza la URL de la imagen si existe en la base de datos
          if (data && data.images) {
            setUserData({ ...userData, imageUrl: data.images });
          }
        }
      } catch (error) {
        console.error('Error en fetchUserData:', error);
      }
    }

    if (user.username) {
      fetchUserData();
    }
  }, [user.username]);

  useEffect(() => {
    async function fetchUserRecommendations() {
      setLoadingRecommendations(true);
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('author', user.username);

      if (error) {
        console.error('Error al obtener las recomendaciones:', error);
      } else {
        setUserRecommendations(data);
      }
      setLoadingRecommendations(false);
    }

    if (user.username) {
      fetchUserRecommendations();
    }
  }, [user.username]);

  function renderRatingStars(rating) {
    const stars = [];
    const totalStars = 5;

    for (let i = 1; i <= totalStars; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star filled-star"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star empty-star"></i>);
      }
    }

    return stars;
  }

  function handleEditRecommendationClick(recommendationId) {
    setShowEditButton(true);
    setShowInitialInfo(false); // Ocultar recomendaciones iniciales al presionar editar
  }

  return (
    // Foto de Perfil
    <div className="root">
      <div className="container">
        <div className="info">
          <div className="image-container-profile">
            <div onClick={handleImageClick}>
              {userData.imageUrl ? (
                // Muestra la imagen de la base de datos si existe
                <img id="profile-picture" src={userData.imageUrl} alt="Profile" />
              ) : selectedImage ? (
                // Muestra la imagen seleccionada si no hay imagen en la base de datos
                <img id="profile-picture" src={selectedImage} alt="Profile" />
              ) : (
                // Si no tiene foto de perfil ni imagen seleccionada, muestra una predeterminada
                <img id="profile-picture" src={profileImage} alt="Profile" className="image-display" />
              )}
              <input
                type="file"
                ref={inputRef}
                onChange={handleImageChange}
                accept="image/png, image/jpg, image/jpeg"
                style={{ display: "none" }}
                className="image-display"
              />
            </div>
            <button className="image-change-submit" onClick={handleImageUpload}>Subir</button>
          </div>
          <div className="column">
            <h1 className="username">{user.username}</h1>
            <p className="description">{user.role}</p>
          </div>
        </div>

        <div className="buttons-container">
          {/* Botón Editar */}
          <button
            className="each-button"
            data-testid="edit-button"
            style={{
              backgroundImage: `url(${edit})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            onClick={() => handleEditRecommendationClick(null)}
          ></button>
          <button
            id="save"
            className="each-button"
            data-testid="save-button"
            style={{
              backgroundImage: `url(${save})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            onClick={() => {
               // Colocar la acción para mostrar las recomendaciones
            }}
          ></button>

          <button
            id="like"
            className="each-button"
            data-testid="like-button"
            style={{
              backgroundImage: `url(${like})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            onClick={() => {
              setShowLikeButton(!showLikeButton);
            }}
          ></button>
        </div>

        {showLikeButton && <LikeButton />}

        {/* Mostrar EditButton si showEditButton es true */}
        {showEditButton && (
          <EditButton
            recommendations={userRecommendations}
            onEditRecommendationClick={handleEditRecommendationClick}
            setShowEditButton={setShowEditButton}
            setShowInitialInfo={setShowInitialInfo}
          />
        )}
        {/* Mostrar recomendaciones iniciales si showInitialInfo es true */}
        {showInitialInfo && !loadingRecommendations && userRecommendations.length > 0 && (
          <div className="user-recommendations">
            <h2>Tus recomendaciones</h2>
            <div className="recommendations-container">
              {userRecommendations.map((recommendation) => (
                <div key={recommendation.id_places} className="recommendation-card">
                  <Link to={`/MainPage/recommendation/${recommendation.id_places}`}>
                      <h3>{recommendation.name}</h3>
                  </Link>
                  <p>{recommendation.description}</p>
                  <div className="rating-stars">{renderRatingStars(recommendation.rating)}</div>
                  <img src={recommendation.image} alt={recommendation.name} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;