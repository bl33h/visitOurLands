import { useState, useEffect} from 'react'
import './Profile.css'
import '/src/Components/texts.css'
import '/src/Components/display.css'
import profileImage from '../../assets/profile.png'
import edit from '../../assets/1.png'
import save from '../../assets/2.png'
import like from '../../assets/3.png'

function Profile(){
    const [user, setUser] = useState({})

    useEffect(() => {
        const browser_data = window.localStorage.getItem('LOGIN_STATUS')
        if (browser_data !== null) setUser(JSON.parse(browser_data))
      }, [])

    return(
        <div className="root">
            <div className="container">
                <div className="info">
                    <img id="profile-picture" src={profileImage} />
                    <div className="column">
                        <h1 className="username">{user.username}</h1>
                        <p className="description">{user.role}</p>
                    </div>
                </div>

                <div id="edit" className="buttons">
                    <button className="each-button" 
                        style={{
                            backgroundImage: `url(${edit})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                        onClick={() => {
                            //colocar la accion
                        }}>
                    </button>

                    <button id="save" className="each-button" 
                        style={{
                            backgroundImage: `url(${save})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                        onClick={() => {
                            //colocar la accion
                        }}>
                    </button>

                    <button id="like" className="each-button" 
                        style={{
                            backgroundImage: `url(${like})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                        onClick={() => {
                            //colocar la accion
                        }}>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Profile