import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home';
import Events from '../pages/Events';
import Sponsors from '../pages/Sponsors';
import Developers from '../pages/Developers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/developers" element={<Developers />} />
      </Routes>
    </Router>
  )
}

export default App