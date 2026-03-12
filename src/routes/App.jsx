import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home';
import Events from '../pages/Events';
import Sponsors from '../pages/Sponsors';
import Developers from '../pages/Developers';
import Results from '../pages/Results';
import CollegeRepRegistration from '../pages/CollegeRepRegistration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/hall-of-fame" element={<Results />} />
        <Route path="/college-rep-registration" element={<CollegeRepRegistration />} />
      </Routes>
    </Router>
  )
}

export default App