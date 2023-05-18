import React from 'react'
import Login from './Login'
import SignIn from './SignIn'
import Profile from './Profile'
import Map from './Map'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
const Page = () => {

    return (
        <Switch>
            <Route path="/SignIn">
                <SignIn />
            </Route>

            <Route path="/Profile">
                <Profile />
            </Route>

            <Route path="/Map">
                <Map />
            </Route>

            <Route path="/">
                <Login/>
            </Route>
        </Switch>
    )
}

export default Page