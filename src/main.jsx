import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {HashRouter} from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
      <App />
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)
