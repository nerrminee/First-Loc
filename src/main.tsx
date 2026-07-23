import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { RentalDataProvider } from './context/RentalDataContext'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider><RentalDataProvider><App /></RentalDataProvider></AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
