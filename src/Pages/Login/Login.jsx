import './Login.css'
import '/src/Components/texts.css'
import '/src/Components/display.css'
import { useState } from 'react';
import Joi from 'joi'

import {
  useApi,
} from '@hooks'

const schema = Joi.object({
  username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
  password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})

const Login = () => {
  const data = useApi()
  console.log("data",data)
  const { loading, handleRequest } = useApi()
  const form = schema

  const postLogin = async (username, password) => {
    const response = await handleRequest('POST', '/login', {
      username,
      password
    })
    if (response.success){
      console.log(response)
    }

  }
  const handleLogin = () => {
    console.log('handle login')
    if (form.validate()) {
      postLogin(form.values.username, form.values.password)
    }
  }

  
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
        
        <button className="login-button" onClick={handleLogin} loading={loading} >INICIAR SESION</button>
        <br></br><h2>¿Aún no tienes una cuenta?</h2>
        <button className="signin-button">REGISTRATE</button>
        </div>
      </div>
  )
}

export default Login
