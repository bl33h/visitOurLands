import React, { useState, useEffect } from 'react'; // Import React and necessary hooks
import bg from '../../../assets/mainBackgrnd.png'; // Import the background image
import './HomePage.css'; // Import the stylesheet for HomePage

// Define the functional component HomePage
const HomePage = () => {
  // State hook to store user data
  const [user, setUser] = useState({});

  // useEffect hook to fetch user data from local storage when component mounts
  useEffect(() => {
    const browser_data = window.localStorage.getItem('LOGIN_STATUS');
    if (browser_data !== null) setUser(JSON.parse(browser_data));
  }, []);

  // JSX structure for the HomePage component
  return (
    <div className='root'>
      {/* Container with background image and styling */}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          alignContent: 'center',
          backgroundImage: `url(${bg})`, // Set background image
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          zIndex: -1
        }}
      >
        {/* Greeting message for the user */}
        <h1 className="main-title">Welcome back, {user.username}!</h1>
        {/* User role message */}
        <p className="role-message">You are assigned as {user.role}</p>
      </div>
    </div>
  );
};

// Export the HomePage component as the default export
export default HomePage;
