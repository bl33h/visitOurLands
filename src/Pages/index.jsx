import React from 'react'
import Login from './Login'
import SignIn from './SignIn'
import Profile from './Profile'
import Map from './Map'
import MainPage from './MainPage'
import CreatePlace from './CreatePlace'
import { Switch, Route, Redirect} from 'react-router-dom'

    return (
        <Switch>
            <Route path="/SignIn">
                <SignIn />
            </Route>

            <Route path="/Profile">
                <Profile />
            </Route>

            <Route path="/Login">
                <Login />
            </Route>

            <Route path="/Map">
                <Map/>
            </Route>

            <Route path="/CreatePlace">
                <CreatePlace />
            </Route>

            <Route path="/MainPage">
                <MainPage />
            </Route>

            <Redirect from="/" to="/Login" />
        </Switch>
    )
}

export default Page