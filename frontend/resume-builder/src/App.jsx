import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import {Toaster} from "react-hot-toast"
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Home/Dashboard'
import EditResume from './pages/ResumeUpdate/EditResume'

const App = () => {
  return (
    <>
      <div>
        <Router>
          <Routes>
            {/* default Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/resume/:resumeId' element={<EditResume />} />
          </Routes>
        </Router>
      </div>

      <Toaster 
        toastOptions={{
          className:'',
          style:{
            fontSize: "13px"
          },
        }}
      />
    </>
  )
}

export default App
