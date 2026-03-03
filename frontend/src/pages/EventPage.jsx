import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/Toast';
import '../styles/EventPage.css';
import { apiFetch, API_BASE_URL } from '../utils/api';
import { getEventImage } from '../utils/imageMap';

const EventsPage = ({ setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const hasShownError = useRef(false);

  const categories = ['all', 'Wedding', 'Birthday', 'Anniversary', 'Corporate', 'Other'];

  // fetch events from API so admin-created ones appear for users
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await apiFetch('/events');
        if (res.ok && res.data?.events) {
          setEvents(res.data.events);
        } else {
          if (!hasShownError.current) {
            toast(res.data?.message || 'Failed to load events', 'error');
            hasShownError.current = true;
          }
        }
      } catch (err) {
        if (!hasShownError.current) {
          toast('Network error loading events', 'error');
          hasShownError.current = true;
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      event.eventType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="events-page">
      <section className="events-hero">
        <div className="container">
          <h1 className="page-title">Upcoming Events</h1>
          <p className="page-subtitle">Discover and book amazing events happening near you</p>
        </div>
      </section>

      <section className="events-content">
        <div className="container">
          <div className="events-filters">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-events"
              />
            </div>

            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p>Loading events...</p>
          ) : filteredEvents.length === 0 ? (
            <div className="no-results">
              <p>No events found matching your criteria</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map(event => {
              const dateObj = new Date(event.eventDate);
              const dateStr = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
              const timeStr = event.startTime || event.endTime
                ? `${event.startTime || ''}${event.endTime ? ' - ' + event.endTime : ''}`
                : '';
              // use eventType to pick varied defaults
              let img = getEventImage(event.eventType);
              if (event.imageUrl) {
                const url = event.imageUrl.startsWith('http') ? event.imageUrl : `${API_BASE_URL}${event.imageUrl}`;
                img = encodeURI(url);
              }
              const attendees = event.Bookings ? event.Bookings.length : '-';

              return (
                <div key={event.id} className="event-card-full">
                  <div className="event-image-full">
                    <img src={img} alt={event.title} className="event-img-full" />
                  </div>
                  <div className="event-details">
                    <span className="event-category">{event.eventType}</span>
                    <h3 className="event-title">{event.title}</h3>
                    
                    <div className="event-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span>{dateStr}</span>
                      </div>
                      {timeStr && (
                        <div className="meta-item">
                          <span className="meta-icon">🕒</span>
                          <span>{timeStr}</span>
                        </div>
                      )}
                      <div className="meta-item">
                        <span className="meta-icon">📍</span>
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="event-footer">
                      <div className="event-info-bottom">
                        {event.budget && <span className="event-price">NPR{event.budget}</span>}
                        <span className="event-attendees">👥 {attendees}</span>
                      </div>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          localStorage.setItem('preselectEvent', event.id);
                          setCurrentPage('event-details');
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;