import { useState, useEffect } from 'react';
import { useHistory, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { ColorModeContext, useMode } from '/src/Components/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Sidebar from '/src/Components/Navbar/Navbar';
import Map from '/src/Pages/Map/Map';
import Profile from '/src/Pages/Profile/Profile';
import Recomendations from '/src/Pages/Recomendations/Recomendations';
import CreatePlace from '/src/Pages/CreatePlace/CreatePlace';
import TopRec from '/src/Pages/TopRec/TopRec';
import HomePage from './HomePage/HomePage';
import RecommendationPage from '../RecommendationPage';
import './MainPage.css';

function MainPage() {
  const [user, setUser] = useState({});
  const [, set_Logged_In_Status] = useState(false);
  const [theme, colorMode] = useMode();
  const [isSidebar] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [, setRedirectPath] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const browser_data = window.localStorage.getItem('LOGIN_STATUS');
    if (browser_data !== null) setUser(JSON.parse(browser_data));
  }, []);

  useEffect(() => {
    set_Logged_In_Status(user.logged_in);
  }, [user]);

  useEffect(() => {
    // Si el usuario no está logueado, configura la redirección después de 3 segundos (3000ms)
    if (!user.logged_in) {
      const timer = setTimeout(() => {
        setRedirect(true);
      }, 3000);

      // Limpia el temporizador cuando el componente se desmonta o cuando el usuario se loguea antes del tiempo establecido
      return () => clearTimeout(timer);
    }
  }, [user.logged_in]);

  useEffect(() => {
    if (!user.logged_in) {
      // Only store the URL if the user is not logged in and there's no stored redirect path
      if (!localStorage.getItem('redirectAfterLogin')) {
        localStorage.setItem('redirectAfterLogin', location.pathname);
      }
    } else {
      // If the user is logged in, remove the redirect path from the local storage
      localStorage.removeItem('redirectAfterLogin');
    }
  }, [user.logged_in, location.pathname]);

  useEffect(() => {
    if (!user.logged_in) {
      // Si el usuario no está logueado, establece el enlace al que se redirigirá después del inicio de sesión
      setRedirectPath(localStorage.getItem('redirectAfterLogin'));
    }
  }, [user.logged_in]);

  if (redirect) {
    return <Redirect to="/Login" />;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="main-page">
          {user.logged_in ? ( // Verifica si el usuario está logueado
            <div className="app">
              <Sidebar isSidebar={isSidebar} style={{ height: '100vh' }} />
              <main className="content">
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
            <div id="logged-out-status" style={{ color: 'red' }}>Necesita tener una cuenta para ver la pagina, se le redirigirá al Log in, espere unos segundos...</div>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default MainPage;