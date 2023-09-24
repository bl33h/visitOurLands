import { useState, useEffect } from 'react'
import './HomePage.css'

const HomePage = () => {
  const [user, setUser] = useState({})

  useEffect(() => {
    const browser_data = window.localStorage.getItem('LOGIN_STATUS')
    if (browser_data !== null) setUser(JSON.parse(browser_data))
  }, [])

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'grid', 
      alignContent: 'center',
      backgroundImage: 'url(https://imgs.search.brave.com/6HV16SSn7-_dAEtMJAFBe7hOdDD0NbDKPKaL6LWo4As/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTcz/NDY3MjQzL2VzL2Zv/dG8vYS1qb3VybmV5/LWFjcm9zcy1sYWtl/LWF0aXRsYW4tYnkt/a2F5YWsuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPXVTLVph/R3luWjhBd3hta3hI/RDRRTjUwY1plMzBV/YkxWUkJQZVVLMjFl/d0U9)',
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      }}>
        <h1 className="main-title" >Welcome back, {user.username}!</h1>
        <p className="role-message"  >You signed in as {user.role}</p>
    </div>
  )
}

export default HomePage