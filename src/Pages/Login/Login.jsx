import './Login.css'
import { useState } from 'react';

function Login() {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  function handleCheckboxChange() {
    setMostrarContrasena(!mostrarContrasena);
  }
  return (
    <div className="login-root" >
      <div className="login-guest-container"></div>
      <div className="login-container-root">
        <div className="login-container">
          <div className="login-labels">Username:</div>
          <input id="input-username"  className="input-login"></input>
          
          <div className="login-labels">Password:</div>
          <input type={mostrarContrasena ? 'text' : 'password'}  id="input-password" className="input-login"></input>
          <label htmlFor="mostrar-contrasena">Mostrar contraseña</label>
          <input type="checkbox" id="mostrar-contrasena" onChange={handleCheckboxChange} />

          <button className="login-button">INICIAR SESION</button>
          <h2>¿Aún no tienes una cuenta?</h2>
          <button className="signin-button">REGISTRATE</button>
        </div>
      </div>
    </div>
  )
}

export default Login
