import { useState, useEffect } from 'react'
//import { useHistory } from 'react-router-dom'
import './SignIn.css'

function SignIn() {
  const [isChecked, setIsChecked] = useState(false)
    
  return (
    <div className="signin-root" >
      <div className="sign-in-container">
        <h1>¡Únete a Visita Nuestras Tierras!</h1>
      <div className="login-labels">Correo electrónico:</div>
        <input id="input-correo"  className="input-login"></input>
        <div className="login-labels">Usuario:</div>
        <input id="input-username"  className="input-login"></input>
        <div className="login-labels">Contraseña:</div>
        <input type='password' id="input-password" className="input-login"></input>
        <div className="login-labels">Confirmar contraseña:</div>
        <input type='password' id="input-confirm-password"  className="input-login"></input>
        <label className="checkbox-label">
          <input
            type="checkbox"
            id="input-role"
            hecked={isChecked.toString()}
            className="input-checkbox"
          />Soy dueño de un lugar turístico
        </label>
        <button className="sign-in-button">REGISTRARME</button>
      </div>
    </div>
  )
}

export default SignIn
