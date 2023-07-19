
import { useState, useEffect } from 'react'
import { useHistory, Route, Switch } from 'react-router-dom'
import { ColorModeContext, useMode } from '/src/Components/theme'
import { CssBaseline, ThemeProvider } from '@mui/material'
import  Sidebar  from '/src/Components/Navbar/Navbar'
import Map from '/src/Pages/Map/Map'
import Profile from '/src/Pages/Profile/Profile'
import CreatePlace from '/src/Pages/CreatePlace/CreatePlace';
import "./MainPage.css"

function MainPage() {
  const [user, setUser] = useState({});
  const [logged_In, set_Logged_In_Status] = useState(false);
  const [user_Authorized, setUserAuthorized] = useState(false);
  const [theme, colorMode] = useMode();
  const [isSidebar] = useState(true);

  const history = useHistory();

  useEffect(() => {
    const browser_data = window.localStorage.getItem('LOGIN_STATUS');
    if (browser_data !== null) {
      setUser(JSON.parse(browser_data));
    }
  }, []);

  useEffect(() => {
    set_Logged_In_Status(user.logged_in);
    setUserAuthorized(user.logged_in && user.user_id !== undefined);
  }, [user]);

  useEffect(() => {
    verify_Login_status();
  }, [user_Authorized]);

  const verify_Login_status = () => {
    if (!user_Authorized) {
      history.push('/Login');
    }
  };

  function UserMainPage() {
    return (
      <div>
        {logged_In ? (
          <div className="app">
            <Sidebar isSidebar={isSidebar} style={{ height: "100vh" }} />
            <main className="content">
              <Switch>
                <Route path="/MainPage/Map">
                  <Map />
                </Route>

                <Route path="/MainPage/Profile">
                  <Profile />
                </Route>

              <Route path="/MainPage/CreatePlace">
                  <CreatePlace />
                </Route>

            </Switch>
          </main>
        </div>
        : <div id="logged-out-status" style={{color: 'red'}} > Signing out...</div>}
      </div>
    );
  }

  function UserUnauthorized() {
    return (
      <>
        <div>You are not authorized... </div>
        <div>Signing out...</div>
      </>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="main-page">
          {user_Authorized ? <UserMainPage /> : <UserUnauthorized />}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default MainPage;
