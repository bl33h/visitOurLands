import './Login.css'
import '/src/Components/texts.css'
import '/src/Components/display.css'
import { useState, useEffect } from 'react'
import { supabase } from '../../client'
import { useHistory } from 'react-router-dom'
import bcrypt from 'bcryptjs';
import welcomeJagui from '../../assets/welcome.png'
function Login() {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([])
  const [user, setUser] = useState({ username: '', password: '', logged_in: false, role:'' })
  let { username, password, role } = ''
  let succesfull_login = false
  const history = useHistory()
  
  useEffect(() => {
    window.localStorage.setItem('LOGIN_STATUS', JSON.stringify(user))
  }, [user])
  useEffect(() => {
    fetchPosts()
  }, [])
  const handleKeyDown = (event) => {
    if (event.key === 'Enter'){
      check_login()
    }
  }
  const evaluate_login = () => {
    if (succesfull_login) {
      setTimeout(() => {
        history.push('/MainPage')
      }, 1500)
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
        const storedHashedPassword = users[while_counter].password;
        if (username == users[while_counter].username && (bcrypt.compareSync(password, storedHashedPassword) || password == users[while_counter].password  )) {
          (password == users[while_counter].password)
          succesfull_login = true
          setError('');
          role = users[while_counter].role
          setUser({ username: username, password: password, logged_in: true, role: role })
        } else {
          while_counter++
          setError('Usuario o contraseña incorrectos');
        }
      }
    }
    else{
      setError('Ingrese el nombre de usuario y la contraseña');

    }
    evaluate_login()
  }

  function handleCheckboxChange() {
    setMostrarContrasena(!mostrarContrasena);
  }
  return (
    <div className="root2" >
      <div className="welcome-jagui-container">
        <img className="welcome-jagui" src={welcomeJagui} alt="welcome Jagui" />
      </div>
      <div className="container">
      
        <h1>Usuario:</h1>
        <input id="input-username" data-testid="input-usernam" className="input-login" onClick={fetchPosts} onKeyDown={handleKeyDown}></input>
          
        <h1>Contraseña:</h1>
        <input type={mostrarContrasena ? 'text' : 'password'}  id="input-password" data-testid="input-p" className="input-login" onClick={fetchPosts} onKeyDown={handleKeyDown}></input>
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <p>Mostrar contraseña</p>
          <input type="checkbox" id="mostrar-contrasena"  onChange={handleCheckboxChange} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="login-button" data-testid="login-button" onClick={check_login}>INICIAR SESION</button>
        <br></br><h2>¿Aún no tienes una cuenta?</h2>
        <button className="signin-button" onClick={sign_in}>REGISTRATE</button>
        </div>
      </div>
  )
}
export default Login