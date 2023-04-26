import { useState } from 'react'
//import { useHistory } from 'react-router-dom'
import './SignIn.css'

function SignIn() {
  const [mostrarContrasena1, setMostrarContrasena1] = useState(false);
  const [mostrarContrasena2, setMostrarContrasena2] = useState(false);
  function handleCheckboxChange1(){
    setMostrarContrasena1(!mostrarContrasena1)
    setMostrarContrasena2(!mostrarContrasena2);
  }

  return (
    <div className="signin-root" >
      <div className="sign-in-container">
        <h1>¡Únete a Visita Nuestras Tierras!</h1>
      <div className="login-labels">Correo electrónico:</div>
        <input id="input-correo"  className="input-login"></input>
        <div className="login-labels">Usuario:</div>
        <input id="input-username"  className="input-login"></input>
        <div className="login-labels">Contraseña:</div>
        <input type={mostrarContrasena1 ? 'text' : 'password'} id="input-password" className="input-login"></input>
        <div className="login-labels">Confirmar contraseña:</div>
        <input type={mostrarContrasena2 ? 'text' : 'password'} id="input-confirm-password"  className="input-login"></input>
        <input type="checkbox" id="mostrar-contrasena" onChange={handleCheckboxChange1} className="input-checkbox" />
        <label htmlFor="mostrar-contrasena" className="checkbox-label">Mostrar contraseñas</label>
        <br></br>
        <button className="sign-in-button">REGISTRARME</button>
      </div>
    </div>
  )
}

export default SignIn
