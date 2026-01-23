import React from 'react';
import '../styles/HomePage.css';

const HomePage = ({ setCurrentPage }) => {
  const services = [
    {
      icon: '🎉',
      title: 'Wedding Events',
      description: 'Make your special day unforgettable with our comprehensive wedding planning services, from venue selection to decoration.',
      color: '#E8E3F3'
    },
    {
      icon: '🎂',
      title: 'Birthday Parties',
      description: 'Celebrate birthdays in style with customized themes, entertainment, and catering options for all ages.',
      color: '#E8F5E8'
    },
    {
      icon: '🏢',
      title: 'Corporate Events',
      description: 'Professional event management for conferences, seminars, team building activities, and corporate gatherings.',
      color: '#FFE8E8'
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Event planning made easier for everyone
            </h1>
            <p className="hero-description">
              Polished Events provides guidance and vendors for a variety of event types 
              including weddings, birthday parties, corporate events, and family reunions.
            </p>
            
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Start Your Search"
                className="search-input"
              />
            </div>
          </div>

          <div className="hero-image-section">
            <div className="rating-badge">
              <div className="rating-icon">⭐</div>
              <div className="rating-content">
                <div className="rating-title">5 Star</div>
                <div className="rating-subtitle">Based on 420 reviews</div>
              </div>
            </div>

            <div className="hero-image-placeholder">
              <div className="image-text">Event Planning Professional</div>
            </div>

            <div className="stats-card">
              <div className="stat-item">
                <div className="stat-icon red">🎯</div>
                <div className="stat-content">
                  <div className="stat-value">72%</div>
                  <div className="stat-label">Customer Target</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon yellow">⭐</div>
                <div className="stat-content">
                  <div className="stat-value">96%</div>
                  <div className="stat-label">Sales Target</div>
                </div>
              </div>
            </div>

            <div className="decorative-line"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2 className="section-title">Our Services</h2>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="service-card"
              style={{ backgroundColor: service.color }}
            >
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="cta-section">
          <button 
            className="btn-primary"
            onClick={() => setCurrentPage('services')}
          >
            View All Services
          </button>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="featured-section">
        <h2 className="section-title">Upcoming Events</h2>
        <div className="events-preview">
          <div className="event-card">
            <div className="event-image-placeholder">Music Festival 2026</div>
            <div className="event-info">
              <h3>Summer Music Festival</h3>
              <p>📅 July 15, 2026 • 📍 Central Park</p>
              <button 
                className="btn-secondary"
                onClick={() => setCurrentPage('events')}
              >
                View Details
              </button>
            </div>
          </div>
          <div className="event-card">
            <div className="event-image-placeholder">Tech Conference</div>
            <div className="event-info">
              <h3>Tech Innovation Summit</h3>
              <p>📅 August 20, 2026 • 📍 Convention Center</p>
              <button 
                className="btn-secondary"
                onClick={() => setCurrentPage('events')}
              >
                View Details
              </button>
            </div>
          </div>
          <div className="event-card">
            <div className="event-image-placeholder">Food Festival</div>
            <div className="event-info">
              <h3>International Food Festival</h3>
              <p>📅 September 5, 2026 • 📍 Downtown Square</p>
              <button 
                className="btn-secondary"
                onClick={() => setCurrentPage('events')}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;