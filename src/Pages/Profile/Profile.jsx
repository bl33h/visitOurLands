// Importing necessary styles and libraries
import { useState, useEffect } from 'react';
import './Profile.css';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import profileImage from '../../assets/profile.png';
import { supabase } from '../../client';
import edit from '../../assets/1.png';
import like from '../../assets/3.png';
import EditButton from './buttons/edit/EditButton';
import LikeButton from './buttons/like/LikeButton';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";

// Main Profile component
function Profile() {
  // State variables to store user-related data
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState({});
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [showInitialInfo, setShowInitialInfo] = useState(true); // State to show/hide initial recommendations
  const [showEditButton, setShowEditButton] = useState(false);
  const [showLikeButton, setShowLikeButton] = useState(false);
  const [image, setImage] = useState();
  const [userData, setUserData] = useState({
    username: '',
    imageUrl: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useState(null);

  // Event handler for clicking on the profile image
  const handleImageClick = () => {
    inputRef.current.click();
  }

  // Event handler for changing the profile image
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file)); // Display the selected image
    setImage(file);
  }

  // Function to handle image upload
  const handleImageUpload = async () => {
    if (image && !uploading) { // Avoid uploading if an image is already being uploaded
      setUploading(true);

      const imageName = uuidv4();
      const folderName = 'images';
      const imagePath = `${folderName}/${imageName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('ProfilePictures')
          .upload(imagePath, image);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
        } else {
          console.log('Image uploaded successfully:', imagePath);

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
            console.error('Error updating image URL in the user database:', updateError);
          } else {
            console.log('Image URL updated in the user database.');
          }
        }
      } catch (error) {
        console.error('Error in handleImageUpload:', error);
      } finally {
        setUploading(false); // Mark the upload as complete
      }
    }
  }

  useEffect(() => {
    // Local storage
    const browserData = window.localStorage.getItem('LOGIN_STATUS');
    if (browserData !== null) {
      setUser(JSON.parse(browserData));
    }
  }, []);

  // useEffect to fetch user data when the component mounts
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get user information from the 'users' table based on the username
        const { data, error } = await supabase
          .from('users')
          .select('images, role')
          .eq('username', user.username)
          .single();

        if (error) {
          console.error('Error fetching user information:', error);
        } else {
          // Update the image URL and role if they exist in the database
          if (data && data.images) {
            setUserData({ ...userData, imageUrl: data.images });
          }
          setUserRole(data?.role || 'tourist');
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      }
    }

    if (user.username) {
      fetchUserData();
    }
  }, [user.username]);

  // useEffect to fetch user recommendations
  useEffect(() => {
    async function fetchUserRecommendations() {
      setLoadingRecommendations(true);

      let query = supabase.from('places').select('*');

      // If the user is an 'admin', do not apply author restrictions
      if (userRole !== 'admin') {
        query = query.eq('author', user.username);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recommendations:', error);
      } else {
        setUserRecommendations(data);
      }
      setLoadingRecommendations(false);
    }

    if (user.username) {
      fetchUserRecommendations();
    }
  }, [user.username, userRole]);

  // Function to render rating stars based on the given rating
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

  // Event handler for clicking the Edit button on a recommendation
  function handleEditRecommendationClick(recommendationId) {
    if (showInitialInfo === true) {
      setShowEditButton(true);
      setShowInitialInfo(false); // Hide initial recommendations when clicking Edit
    } else {
      setShowEditButton(false);
      setShowInitialInfo(true); // Show initial recommendations when clicking Cancel
    }
  }
  // Render the main Profile component

  return (
    <div className="root">
      <div className="profile-container">
        <div className="info">
          <div className="image-container-profile">
            <div onClick={handleImageClick}>
              {userData.imageUrl ? (
                // Display the database image if it exists
                <img id="profile-picture" src={userData.imageUrl} alt="Profile" className="image-display"/>
              ) : selectedImage ? (
                // Display the selected image if there is no image in the database
                <img id="profile-picture" src={selectedImage} alt="Profile" className="image-display"/>
              ) : (
                // If there is no profile picture or selected image, display a default one
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
          {/* Edit Button */}
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

          {/* Like Button */}
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
      </div>

        {showLikeButton && <LikeButton />}

        {/* Display EditButton if showEditButton is true */}
        {showEditButton && (
          <EditButton
            recommendations={userRecommendations}
            onEditRecommendationClick={handleEditRecommendationClick}
            setShowEditButton={setShowEditButton}
            setShowInitialInfo={setShowInitialInfo}
          />
        )}
      {/* Display initial recommendations if showInitialInfo is true */}
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
  );
}

export default Profile;