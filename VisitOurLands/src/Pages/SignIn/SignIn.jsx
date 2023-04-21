//import { useState, useEffect } from 'react'
//import { useHistory } from 'react-router-dom'
import './SignIn.css'

function SignIn() {
    
  return (
    <div className="signin-root" >
      <div className="sign-in-container">
        <div className="login-labels">Username:</div>
        <input id="input-username"  className="input-login"></input>
        <div className="login-labels">Password:</div>
        <input id="input-password" className="input-login"></input>
        <div className="login-labels">Confirm password:</div>
        <input id="input-confirm-password"  className="input-login"></input>
        <button className="sign-in-button" >
          Sign in
        </button>
        <button className="login-button-link"  >
          Back to Login
        </button>
      </div>
    </div>
  )
}

export default SignIn
