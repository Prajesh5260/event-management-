import React, { useState } from 'react';
import '../styles/EventDetailsPage.css';

const EventDetailsPage = ({ setCurrentPage }) => {
  const [ticketCount, setTicketCount] = useState(1);

  const event = {
    title: 'Summer Music Festival 2026',
    date: 'July 15, 2026',
    time: '2:00 PM - 10:00 PM',
    location: 'Central Park, New York',
    category: 'Music',
    price: 45,
    attendees: 245,
    organizer: 'Events Plus Inc.',
    description: 'Join us for an unforgettable summer music festival featuring top artists from around the world. Experience live performances, food trucks, and amazing vibes in the heart of Central Park.',
    highlights: [
      'Live performances by 20+ artists',
      'Food and beverage vendors',
      'VIP lounge access available',
      'Photo opportunities',
      'Merchandise booths'
    ],
    schedule: [
      { time: '2:00 PM', activity: 'Gates Open' },
      { time: '3:00 PM', activity: 'Opening Act' },
      { time: '5:00 PM', activity: 'Main Performance 1' },
      { time: '7:00 PM', activity: 'Main Performance 2' },
      { time: '9:00 PM', activity: 'Headliner' }
    ]
  };

  const handleIncrement = () => {
    if (ticketCount < 10) setTicketCount(ticketCount + 1);
  };

  const handleDecrement = () => {
    if (ticketCount > 1) setTicketCount(ticketCount - 1);
  };

  const totalPrice = event.price * ticketCount;

  return (
    <div className="event-details-page">
      <section className="details-hero">
        <div className="container">
          <button 
            className="back-btn"
            onClick={() => setCurrentPage('events')}
          >
            ← Back to Events
          </button>
          
          <div className="hero-content-details">
            <div className="hero-image-detail">
              <div className="image-placeholder-detail">🎵</div>
            </div>
            
            <div className="hero-info">
              <span className="event-category-detail">{event.category}</span>
              <h1 className="event-title-detail">{event.title}</h1>
              
              <div className="event-meta-detail">
                <div className="meta-item-detail">
                  <span className="meta-icon-detail">📅</span>
                  <span>{event.date}</span>
                </div>
                <div className="meta-item-detail">
                  <span className="meta-icon-detail">🕒</span>
                  <span>{event.time}</span>
                </div>
                <div className="meta-item-detail">
                  <span className="meta-icon-detail">📍</span>
                  <span>{event.location}</span>
                </div>
                <div className="meta-item-detail">
                  <span className="meta-icon-detail">👥</span>
                  <span>{event.attendees} attending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="details-content">
        <div className="container">
          <div className="details-grid">
            <div className="details-main">
              <div className="details-section">
                <h2>About This Event</h2>
                <p>{event.description}</p>
              </div>

              <div className="details-section">
                <h2>Event Highlights</h2>
                <ul className="highlights-list">
                  {event.highlights.map((highlight, index) => (
                    <li key={index}>✓ {highlight}</li>
                  ))}
                </ul>
              </div>

              <div className="details-section">
                <h2>Event Schedule</h2>
                <div className="schedule-list">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="schedule-item">
                      <span className="schedule-time">{item.time}</span>
                      <span className="schedule-activity">{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="details-section">
                <h2>Location</h2>
                <div className="location-map">
                  <div className="map-placeholder">
                    🗺️ {event.location}
                  </div>
                </div>
              </div>
            </div>

            <div className="details-sidebar">
              <div className="booking-card">
                <h3>Book Tickets</h3>
                
                <div className="price-section">
                  <span className="price-label">Price per ticket</span>
                  <span className="price-amount">${event.price}</span>
                </div>

                <div className="quantity-selector">
                  <span className="quantity-label">Number of tickets</span>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={handleDecrement}
                      disabled={ticketCount <= 1}
                    >
                      −
                    </button>
                    <span className="quantity-display">{ticketCount}</span>
                    <button 
                      className="quantity-btn"
                      onClick={handleIncrement}
                      disabled={ticketCount >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="total-section">
                  <span className="total-label">Total</span>
                  <span className="total-amount">${totalPrice}</span>
                </div>

                <button className="btn-primary btn-book">
                  Book Now
                </button>

                <div className="organizer-info">
                  <p className="organizer-label">Organized by</p>
                  <p className="organizer-name">{event.organizer}</p>
                </div>
              </div>

              <div className="share-card">
                <h4>Share this event</h4>
                <div className="share-buttons">
                  <button className="share-btn">📘 Facebook</button>
                  <button className="share-btn">🐦 Twitter</button>
                  <button className="share-btn">📧 Email</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetailsPage;