import { useState, useEffect } from 'react'; // Import necessary React hooks
import { useHistory, Route, Switch, Redirect, useLocation } from 'react-router-dom'; // Import routing components
import { ColorModeContext, useMode } from '/src/Components/theme'; // Import color mode context and custom hook
import { CssBaseline, ThemeProvider } from '@mui/material'; // Import MUI components
import Sidebar from '/src/Components/Navbar/Navbar'; // Import custom Sidebar component
import Map from '/src/Pages/Map/Map'; // Import Map component
import Profile from '/src/Pages/Profile/Profile'; // Import Profile component
import Recomendations from '/src/Pages/Recomendations/Recomendations'; // Import Recommendations component
import CreatePlace from '/src/Pages/CreatePlace/CreatePlace'; // Import CreatePlace component
import TopRec from '/src/Pages/TopRec/TopRec'; // Import TopRec component
import HomePage from './HomePage/HomePage'; // Import HomePage component
import RecommendationPage from '../RecommendationPage'; // Import RecommendationPage component
import './MainPage.css'; // Import MainPage stylesheet

// Define the functional component MainPage
function MainPage() {
  const [user, setUser] = useState({}); // State hook to store user data
  const [, set_Logged_In_Status] = useState(false); // State hook for user login status
  const [theme, colorMode] = useMode(); // Custom hook for theme and color mode
  const [isSidebar] = useState(true); // State hook for sidebar visibility
  const [redirect, setRedirect] = useState(false); // State hook for redirection
  const [, setRedirectPath] = useState(null); // State hook for redirection path
  const location = useLocation(); // Hook to access the current URL

  // useEffect hook to fetch user data from local storage when the component mounts
  useEffect(() => {
    const browser_data = window.localStorage.getItem('LOGIN_STATUS');
    if (browser_data !== null) setUser(JSON.parse(browser_data));
  }, []);

  // useEffect hook to update the user login status
  useEffect(() => {
    set_Logged_In_Status(user.logged_in);
  }, [user]);

  // useEffect hook to set redirection after 3 seconds if the user is not logged in
  useEffect(() => {
    if (!user.logged_in) {
      const timer = setTimeout(() => {
        setRedirect(true);
      }, 3000);
      // Clear the timer when the component unmounts or when the user logs in before the set time
      return () => clearTimeout(timer);
    }
  }, [user.logged_in]);

  // useEffect hook to store the redirect path in local storage if the user is not logged in
  useEffect(() => {
    if (!user.logged_in) {
      if (!localStorage.getItem('redirectAfterLogin')) {
        localStorage.setItem('redirectAfterLogin', location.pathname);
      }
    } else {
      localStorage.removeItem('redirectAfterLogin');
    }
  }, [user.logged_in, location.pathname]);

  // useEffect hook to set the redirect path if the user is not logged in
  useEffect(() => {
    if (!user.logged_in) {
      setRedirectPath(localStorage.getItem('redirectAfterLogin'));
    }
  }, [user.logged_in]);

  // Conditional rendering based on user login status for redirection
  if (redirect) {
    return <Redirect to="/Login" />;
  }

  // JSX structure for the MainPage component
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="main-page">
          {user.logged_in ? ( // Check if the user is logged in
            <div className="app">
              {/* Render Sidebar and main content based on user login */}
              <Sidebar isSidebar={isSidebar} style={{ height: '100vh' }} />
              <main className="content">
                {/* Switch to handle routing for different pages */}
                <Switch>
                  <Route path="/MainPage/Map">
                    <Map />
                  </Route>
                  <Route path="/MainPage/Profile">
                    <Profile />
                  </Route>
                  <Route path="/MainPage/Recomendations">
                    <Recomendations />
                  </Route>
                  <Route path="/MainPage/CreatePlace">
                    <CreatePlace />
                  </Route>
                  <Route path="/MainPage/TopRec">
                    <TopRec />
                  </Route>
                  <Route path="/MainPage/recommendation/:recommendationId">
                    <RecommendationPage />
                  </Route>
                  <Route path="/MainPage/">
                    <HomePage />
                  </Route>
                </Switch>
              </main>
            </div>
          ) : (
            <div id="logged-out-status" style={{ color: 'red' }}>You need to have an account to view the page. Redirecting to Log in, please wait...</div>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

// Export the MainPage component as the default export
export default MainPage;
