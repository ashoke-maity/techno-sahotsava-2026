import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from '../pages/Home';
import Events from '../pages/Events';
import Sponsors from '../pages/Sponsors';
import Developers from '../pages/Developers';
import Results from '../pages/Results';
import CollegeRepRegistration from '../pages/CollegeRepRegistration';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ScrollHandler() {
  const { pathname } = useLocation();

  // Track scroll position when actively on a page
  useEffect(() => {
    const handleScroll = () => {
      // Only care about preserving scroll state for the home page
      if (pathname === '/') {
        sessionStorage.setItem('homeScrollPos', window.scrollY.toString());
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // On mount/pathname change
  useEffect(() => {
    if (pathname === '/') {
      const savedPos = sessionStorage.getItem('homeScrollPos');
      if (savedPos) {
        // Try scrolling immediately, and also with a delay to account for Lenis/DOM layout
        window.scrollTo({ top: parseInt(savedPos, 10), behavior: 'instant' });
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedPos, 10), behavior: 'instant' });
        }, 150);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else {
      // Scroll to the top for all other pages
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 100);
    }
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/hall-of-fame" element={<Results />} />
        <Route path="/college-rep-registration" element={<CollegeRepRegistration />} />
      </Routes>
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  )
}

export default App