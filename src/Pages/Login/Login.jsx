import './Login.css'
import '/src/Components/texts.css'
import '/src/Components/display.css'
import { useState, useEffect } from 'react'
import { supabase } from '../../client'
import { useHistory } from 'react-router-dom'

function Login() {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [users, setUsers] = useState([])
  const [user, setUser] = useState({ username: '', password: '', logged_in: false, role:'' })
  let { username, password, role } = ''
  let succesfull_login = false
  const history = useHistory()

  useEffect(() => {
    console.log('writing', user)
    window.localStorage.setItem('LOGIN_STATUS', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    fetchPosts()
    //history.push('//')
  }, [])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter'){
      check_login()
    }
  }

  const evaluate_login = () => {
    if (succesfull_login) {    
      setTimeout(() => {
        history.push('/Map') 
      }, 3000)
    } 
  }

  const sign_in = () => {
    history.push('/SignIn')
  }

  async function fetchPosts() {
    const { data } = await supabase.from('users').select()
    setUsers(data)
  }

  const check_login = () => {
    succesfull_login = false
    username = document.getElementById('input-username').value
    password = document.getElementById('input-password').value
    if(!((username==='')&&(password===''))){
      let while_counter = 0
      while ((while_counter < users.length) && (succesfull_login == false)) {
        if ((username == users[while_counter].username) && (password == users[while_counter].password)) {
          succesfull_login = true
          role = users[while_counter].role
          setUser({ username: username, password: password, logged_in: true, role: role })
        } else {
          while_counter++
        }
      }
    }
    evaluate_login()
  }


  function handleCheckboxChange() {
    setMostrarContrasena(!mostrarContrasena);
  }
  return (
    <div className="root" >
      <div className="container">
        <img className="welcome-jagui" src="../src/assets/welcome.png"/>
        
        <h1>Username:</h1>
        <input id="input-username"  className="input-login" onClick={fetchPosts} ></input>
          
        <h1>Password:</h1>
        <input type={mostrarContrasena ? 'text' : 'password'}  id="input-password" className="input-login" onClick={fetchPosts} ></input>

        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <p>Mostrar contraseña</p>
          <input type="checkbox" id="mostrar-contrasena" onChange={handleCheckboxChange} />
        </div>
        
        <button className="login-button" onClick={check_login}>INICIAR SESION</button>
        <br></br><h2>¿Aún no tienes una cuenta?</h2>
        <button className="signin-button" onClick={sign_in}>REGISTRATE</button>
        </div>
      </div>
  )
}

export default Login
