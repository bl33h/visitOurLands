import Page from './Pages'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <Page />
      </BrowserRouter>
    </div>
  )
}

export default App
