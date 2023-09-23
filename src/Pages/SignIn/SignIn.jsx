import React, { useState } from 'react';
import { supabase } from '../../client';
import { useHistory } from 'react-router-dom';
import './SignIn.css';
import '/src/Components/texts.css';
import '/src/Components/display.css';
import jagui from '../../assets/jagui.png'

function SignIn() {
  const [mostrarContrasena1, setMostrarContrasena1] = useState(false);
  const [mostrarContrasena2, setMostrarContrasena2] = useState(false);
  const [user, setUser] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'Turista',
    email: '',
  });
  const [error, setError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    specialChar: false,
  });
  const history = useHistory();

  function handleCheckboxChange1() {
    setMostrarContrasena1(!mostrarContrasena1);
    setMostrarContrasena2(!mostrarContrasena2);
  }

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  const evaluate_signin = async () => {
    const { data } = await supabase.from('users').select('*');
    const userExists = data.some((userData) => userData.username === user.username);
    if (!userExists) {
      setError('Su usuario ha sido creado con éxito!');
      createUser();
      setTimeout(() => {
        history.push('/');
      }, 2000);
    } else {
      setError('El usuario ya existe.');
    }
  };

  async function createUser() {
    const { username, password, role, email } = user;
    
    try {
      await supabase.from('users').insert([{ username, password, role, email }]);
      setUser({ username: '', password: '', confirmPassword: '', email: '' });
      fetchPosts(); // Optional: You can fetch the updated users list after creating a new user.
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Ocurrió un error al crear el usuario.');
    }
  }

  async function fetchPosts() {
    const { data } = await supabase.from('users').select();
    setUser({ ...user, username: '', password: '', confirmPassword: '', email: '' });
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const lengthRequirement = password.length >= 5;
    const specialCharRequirement = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    setPasswordRequirements({
      length: lengthRequirement,
      specialChar: specialCharRequirement,
    });
    return lengthRequirement && specialCharRequirement;
  };

  const check_signIn = () => {
    const { username, password, confirmPassword, email } = user;

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Ingrese un correo electrónico válido.');
      return;
    }

    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 5 caracteres y contener caracteres especiales.');
      return;
    }

    evaluate_signin();
  };

  return (
    <div className="root">
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      <img className="jagui" src={jagui} alt="logo" /> 
        <h3>¡Únete a Visita Nuestras Tierras!</h3>
      </div>
      <div className="container">
        {error && <p >{error}</p>}
        <br></br>
        {!passwordMatch && <p style={{ color: 'red' }}>Las contraseñas no coinciden.</p>}

        <h1>Correo electrónico:</h1>
        <input
          id="input-correo"
          data-testid="input-correo"
          type="email"
          className="input-login"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        ></input>
        <h1>Usuario:</h1>
        <input
          id="input-username"
          data-testid="input-username"
          className="input-login"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        ></input>
        <h1>Contraseña:</h1>
        <input
          type={mostrarContrasena1 ? 'text' : 'password'}
          id="input-password"
          data-testid="input-password"
          className="input-login"
          value={user.password}
          onChange={(e) => {
            setUser({ ...user, password: e.target.value });
            validatePassword(e.target.value);
          }}
        ></input>
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
        <input
          type={mostrarContrasena2 ? 'text' : 'password'}
          id="input-confirm-password"
          data-testid="input-confirm-password"
          className="input-login"
          value={user.confirmPassword}
          onChange={(e) => {
            setUser({ ...user, confirmPassword: e.target.value });
            setPasswordMatch(true);
          }}
        ></input>
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <p>Mostrar contraseñas</p>
          <input type="checkbox" id="mostrar-contrasena" onChange={handleCheckboxChange1} className="input-checkbox" />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <input type="checkbox" id="input-role" className="input-checkbox" onChange={handleOnChange} />
          <p>Soy dueño de un lugar turístico</p>
        </div>

        <br></br>
        <button className="sign-in-button" data-testid="registro-button" onClick={check_signIn}>
          REGISTRARME
        </button>
        <button className="log-in-button" onClick={() => history.push('/Login')}>
          INICIAR SESIÓN
        </button>
      </div>
    </div>
  );
}

export default SignIn;
