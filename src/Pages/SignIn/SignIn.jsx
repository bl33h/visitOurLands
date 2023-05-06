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
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <img className="jagui" src="/src/assets/jagui.png"/>
        <h3>¡Únete a Visita Nuestras Tierras!</h3>
      </div>
      <div className="sign-in-container">
        <h1>Correo electrónico:</h1>
        <input id="input-correo"  className="input-login"></input>
        <h1>Usuario:</h1>
        <input id="input-username"  className="input-login"></input>
        <h1>Contraseña:</h1>
        <input type={mostrarContrasena1 ? 'text' : 'password'} id="input-password" className="input-login"></input>
        <h1>Confirmar contraseña:</h1>
        <input type={mostrarContrasena2 ? 'text' : 'password'} id="input-confirm-password"  className="input-login"></input>

        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <p>Mostrar contraseñas</p>
          <input type="checkbox" id="mostrar-contrasena" onChange={handleCheckboxChange1} className="input-checkbox"/>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <input type="checkbox" id="input-role" className="input-checkbox"/>
          <p>Soy dueño de un lugar turístico</p>
        </div>

        <br></br>
        <button className="sign-in-button">REGISTRARME</button>
      </div>
    </div>
  )
}

export default SignIn
