import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import EventsPage from './pages/EventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Homepage setCurrentPage={setCurrentPage} />;
      case 'about': return <AboutPage />;
      case 'services': return <ServicesPage />;
      case 'gallery': return <GalleryPage />;
      case 'contact': return <ContactPage />;
      case 'events': return <EventsPage setCurrentPage={setCurrentPage} />;
      case 'event-details': return <EventDetailsPage setCurrentPage={setCurrentPage} />;
      default: return <Homepage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;