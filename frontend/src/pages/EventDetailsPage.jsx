import React, { useState, useEffect } from 'react';
import '../styles/EventDetailsPage.css';
import { useToast } from '../components/Toast';
import { API_BASE_URL } from '../utils/api';
import { getEventImage } from '../utils/imageMap';

const EventDetailsPage = ({ setCurrentPage }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [event, setEvent] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const id = localStorage.getItem('preselectEvent');
    if (id) loadEvent(id);
  }, []);

  const loadEvent = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${id}`);
      const data = await res.json();
      if (res.ok && data.event) {
        setEvent({
          ...data.event,
          highlights: data.event.highlights || [],
          schedule: data.event.schedule || [],
        });
      } else {
        toast(data.message || 'Event not found', 'error');
      }
    } catch (err) {
      toast('Error loading event', 'error');
      console.error(err);
    }
  };

  const handleBookNow = () => {
    try {
      localStorage.setItem('preselectEvent', String(event.id));
    } catch (err) {
      console.error('Error setting preselectEvent:', err);
    }
    setCurrentPage('booking');
  };

  const handleIncrement = () => {
    if (ticketCount < 10) setTicketCount(ticketCount + 1);
  };

  const handleDecrement = () => {
    if (ticketCount > 1) setTicketCount(ticketCount - 1);
  };

  const totalPrice = event ? event.price * ticketCount : 0;

  if (!event) {
    return <p>Loading event...</p>;
  }

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
              {(() => {
                let img = getEventImage(event.eventType);
                if (event.imageUrl) {
                  const url = event.imageUrl.startsWith('http') ? event.imageUrl : `${API_BASE_URL}${event.imageUrl}`;
                  img = encodeURI(url);
                }
                return <img src={img} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />;
              })()}
            </div>
            
            <div className="hero-info">
              <span className="event-category-detail">{event.category}</span>
              <h1 className="event-title-detail">{event.title}</h1>
              
              <div className="event-meta-detail">
                <div className="meta-item-detail">
                  <span className="meta-icon-detail">📅</span>
                  <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                </div>
                {event.startTime && (
                <div className="meta-item-detail">
                  <span className="meta-icon-detail">🕒</span>
                  <span>{event.startTime}{event.endTime ? ' - ' + event.endTime : ''}</span>
                </div>
                )}
                <div className="meta-item-detail">
                  <span className="meta-icon-detail">📍</span>
                  <span>{event.location}</span>
                </div>
                <div className="meta-item-detail">
                  <span className="meta-icon-detail">👥</span>
                  <span>{event.Bookings ? event.Bookings.length : (event.attendees || '-')} attending</span>
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

              {event.highlights.length > 0 && (
                <div className="details-section">
                  <h2>Event Highlights</h2>
                  <ul className="highlights-list">
                    {event.highlights.map((highlight, index) => (
                      <li key={index}>✓ {highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {event.schedule.length > 0 && (
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
              )}

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
                  <span className="price-amount">NPR{event.price}</span>
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
                  <span className="total-amount">NPR{totalPrice}</span>
                </div>

                <button className="btn-primary btn-book" onClick={handleBookNow}>
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