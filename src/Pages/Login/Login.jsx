import './Login.css'
import '/src/Components/texts.css'
import '/src/Components/display.css'
import { useState } from 'react';

function Login() {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  function handleCheckboxChange() {
    setMostrarContrasena(!mostrarContrasena);
  }
  return (
    <div className="root" >
      <div className="container">
        <img className="welcome-jagui" src="/src/assets/welcome.png"/>
        
        <h1>Username:</h1>
        <input id="input-username"  className="input-login"></input>
          
        <h1>Password:</h1>
        <input type={mostrarContrasena ? 'text' : 'password'}  id="input-password" className="input-login"></input>

        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <p>Mostrar contraseña</p>
          <input type="checkbox" id="mostrar-contrasena" onChange={handleCheckboxChange} />
        </div>
        
        <button className="login-button">INICIAR SESION</button>
        <br></br><h2>¿Aún no tienes una cuenta?</h2>
        <button className="signin-button">REGISTRATE</button>
        </div>
      </div>
  )
}

export default Login
