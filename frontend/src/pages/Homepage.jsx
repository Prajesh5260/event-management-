import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';

const API_BASE_URL = 'http://localhost:5000/api';

const HomePage = ({ setCurrentPage }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      const data = await response.json();
      
      if (response.ok && data.events) {
        // Get only the first 3 events for homepage preview
        setEvents(data.events.slice(0, 3));
      } else {
        setError('Failed to load events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Error loading events');
    } finally {
      setLoading(false);
    }
  };

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
              <img src="/images/hero-professional.jpg" alt="Event Planning Professional" className="hero-img" />
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
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading events...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>{error}</p>
        ) : events.length > 0 ? (
          <div className="events-preview">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-image-placeholder">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="event-img" />
                  ) : (
                    <div className="event-img-placeholder">📷 No Image</div>
                  )}
                </div>
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p className="event-type">Type: {event.eventType}</p>
                  <p>📅 {new Date(event.eventDate).toLocaleDateString()} • 📍 {event.location}</p>
                  <p className="event-description">{event.description?.substring(0, 60)}...</p>
                  <p className="event-budget">Budget: ${Number(event.budget).toFixed(2)}</p>
                  <button 
                    className="btn-secondary"
                    onClick={() => setCurrentPage('events')}
                  >
                    View All Events
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No events available yet</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;