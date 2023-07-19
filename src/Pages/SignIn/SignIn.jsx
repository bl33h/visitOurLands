import { useState, useEffect } from 'react'
import { supabase } from '../../client'
import { useHistory } from 'react-router-dom'
import './SignIn.css'
import '/src/Components/texts.css'
import '/src/Components/display.css'

function SignIn() {
  const [mostrarContrasena1, setMostrarContrasena1] = useState(false);
  const [mostrarContrasena2, setMostrarContrasena2] = useState(false);
  const [users, setUsers] = useState([])
  const [user, setUser] = useState({ username: '', password_entry: '', role: '', email: '' })
  const [error, setError] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  let { username, password, role, email } = ''
  let UserUnsigned = true
  const [isChecked, setIsChecked] = useState(false)
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    specialChar: false
  });
  const history = useHistory()

  useEffect(() => {
    console.log('writing', user)
    window.localStorage.setItem('LOGIN_STATUS', JSON.stringify(user))
  }, [user])


  function handleCheckboxChange1(){
    setMostrarContrasena1(!mostrarContrasena1)
    setMostrarContrasena2(!mostrarContrasena2);
  }

  const handleOnChange = () => {
    setIsChecked(!isChecked)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const evaluate_signin = () => {
    if (UserUnsigned) {
      setError('Su usuario ha sido creado con éxito!')
      createUser()
      setTimeout(() => {
        history.push('/')
      }, 2000)
    } else {
      setError('El usuario ya existe.')
    }
  }

  async function fetchPosts() {
    const { data } = await supabase.from('users').select()
    setUsers(data)
  }

  async function createUser() {
    await supabase.from('users').insert([{ username, password, role, email }]).single()
    setUser({ username: username, password_entry: password, role: role, email: email })
    fetchPosts()
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    const lengthRequirement = password.length >= 5
    const specialCharRequirement = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    setPasswordRequirements({
      length: lengthRequirement,
      specialChar: specialCharRequirement
    })
    return lengthRequirement && specialCharRequirement
  }

  const check_signIn = () => {
    UserUnsigned = true
    if (!(document.getElementById('input-username') == null)) {
      username = document.getElementById('input-username').value
      password = document.getElementById('input-password').value
      email = document.getElementById('input-correo').value
      if (isChecked == true) {
        role = 'Dueño'
      } else {
        role = 'Turista'
      }
      const confirmPasswordInput = document.getElementById('input-confirm-password');

      if (password !== confirmPassword) {
        setPasswordMatch(false);
        confirmPasswordInput.focus();
        return;
      }
      if (!validateEmail(email)) {
        setError('Ingrese un correo electrónico válido.')
        return
      }

      if (!validatePassword(password)) {
        setError('La contraseña debe tener al menos 5 caracteres y contener caracteres especiales.')
        return
      }

      let while_counter = 0
      while (while_counter < users.length && UserUnsigned == true) {
        if (username == users[while_counter].username) {
          UserUnsigned = false
        } else {
          while_counter++
        }
      }
    }
    console.log('succesfullSignInVar', UserUnsigned.toString())
    evaluate_signin()
  }

  return (
    <div className="root" >
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <img className="jagui" src="/src/assets/jagui.png"/>
        <h3>¡Únete a Visita Nuestras Tierras!</h3>
      </div>
      <div className="container">
        {error && <p>{error}</p>}
        <br></br>
        {!passwordMatch && <p style={{ color: 'red' }}>Las contraseñas no coinciden.</p>}

        <h1>Correo electrónico:</h1>
        <input id="input-correo" type="email" className="input-login" onClick={fetchPosts}></input>
        <h1>Usuario:</h1>
        <input id="input-username"  className="input-login" onClick={fetchPosts}></input>
        <h1>Contraseña:</h1>
        <input type={mostrarContrasena1 ? 'text' : 'password'} id="input-password" className="input-login" onClick={fetchPosts} onChange={(e) => validatePassword(e.target.value)} ></input>
        {passwordRequirements.length && passwordRequirements.specialChar && (
          <p style={{ color: 'green' }}>La contraseña cumple con los requisitos.</p>
        )}
        {!passwordRequirements.length && (
          <p style={{ color: 'black', fontWeight: 'bold' }}>La contraseña debe tener al menos 5 caracteres.</p>
        )}
        {!passwordRequirements.specialChar && (
          <p style={{ color: 'black', fontWeight: 'bold' }}>La contraseña debe contener caracteres especiales.</p>
        )}
        <h1>Confirmar contraseña:</h1>
        <input type={mostrarContrasena2 ? 'text' : 'password'} id="input-confirm-password"  className="input-login" onClick={fetchPosts}  onChange={(e) => {setConfirmPassword(e.target.value); setPasswordMatch(true);}}></input>
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <p>Mostrar contraseñas</p>
          <input type="checkbox" id="mostrar-contrasena" onChange={handleCheckboxChange1} className="input-checkbox"/>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <input type="checkbox" id="input-role" className="input-checkbox" onChange={handleOnChange}/>
          <p>Soy dueño de un lugar turístico</p>
        </div>

        <br></br>
        <button className="sign-in-button" onClick={check_signIn}>REGISTRARME</button>
        <button className="log-in-button" onClick={() => history.push('/Login')}>INICIAR SESIÓN</button>
      </div>
    </div>
  )
}

export default SignIn
