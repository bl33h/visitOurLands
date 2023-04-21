import './Login.css'

function Login() {
  return (
    <div className="login-root" >
      <div className="login-guest-container"></div>
      <div className="login-container-root">
        <div className="login-container">
          <h1>Username:</h1>
          <input id="input-username"  className="input-login"></input>
          
          <h1>Password:</h1>
          <input type='password' id="input-password" className="input-login"></input>          
          
          <button className="login-button">INICIAR SESION</button>
          <h2>¿Aún no tienes una cuenta?</h2>
          <button className="signin-button">REGISTRATE</button>
        </div>
      </div>
    </div>
  )
}

export default Login
