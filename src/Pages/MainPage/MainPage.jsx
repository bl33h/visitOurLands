import { useState, useEffect } from 'react'
import { useHistory, Route, Switch } from 'react-router-dom'
import { ColorModeContext, useMode } from '/src/Components/theme'
import { CssBaseline, ThemeProvider } from '@mui/material'
import  Sidebar  from '/src/Components/Navbar/Navbar'
import Map from '/src/Pages/Map/Map'
import Profile from '/src/Pages/Profile/Profile'
import Recomendations from '/src/Pages/Recomendations/Recomendations'
import CreatePlace from '/src/Pages/CreatePlace/CreatePlace';
import TopRec from '/src/Pages/TopRec/TopRec';
import HomePage from './HomePage/HomePage'
import RecommendationPage from '../RecommendationPage'
import "./MainPage.css"

function MainPage() {
  const [user, setUser] = useState({})
  const [logged_In, set_Logged_In_Status] = useState(false)
  const [user_Authorized, setUserAuthorized] = useState(false)
  const [theme, colorMode] = useMode()
  const [isSidebar] = useState(true);
  const history = useHistory()
  useEffect(() => {
    const browser_data = window.localStorage.getItem('LOGIN_STATUS')
    if (browser_data !== null) setUser(JSON.parse(browser_data))
  }, [])
  useEffect(() => {
    set_Logged_In_Status(user.logged_in)
    setUserAuthorized((user.logged_in))
  }, [user])
  const verify_Loggin_status = () => {
    if(!(user.user_id===undefined)){
      if((!logged_In)&&(logged_In!=undefined)){
        setTimeout(() => {
          history.push('/Login')
          history.go(0)
        }, [3000])
      }
    }
  }
  function UserMainPage() {
    return(
      <div>
        {logged_In ?
        <div className="app" >
          <Sidebar isSidebar={isSidebar} style={{height: "100vh"}}/>
          <main className="content">
            <Switch>
              <Route path="/MainPage/Map">
                <Map/>
              </Route>
              <Route path="/MainPage/Profile">
                <Profile/>
              </Route>

              <Route path="/MainPage/Recomendations">
                <Recomendations/>
              </Route>

              <Route path="/MainPage/CreatePlace">
                  <CreatePlace />
                </Route>
              
              <Route path="/MainPage/TopRec">
                <TopRec/>
              </Route>

              <Route path="/MainPage/recommendation/:recommendationId">
                <RecommendationPage />
            </Route>

              <Route path="/MainPage/">
                <HomePage/>
              </Route>
            </Switch>
          </main>
        </div>
        : <div id="logged-out-status" style={{color: 'red'}} > Signing out...</div>}
      </div>
    )
  }
  function UserUnauthorized() {
    verify_Loggin_status()
    return (
      <>
        <div>You are not authorized... </div>
        <div>Signing out...</div>
      </>
    )
  }
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="main-page" >
          {user_Authorized ? <UserMainPage /> : <UserUnauthorized/> }
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
export default MainPage