import React from 'react'
import Login from './Login'
import SignIn from './SignIn'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
const Page = () => {

    return (
        <Switch>
            <Route path="/SignIn">
                <SignIn />
            </Route>
            <Route path="/">
                <Login />
            </Route>
        </Switch>
    )
}

// export { navigate }
export default Page