import React, { useState } from 'react';
import '../styles/EventPage.css';

const EventsPage = ({ setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'music', 'corporate', 'food', 'sports', 'education'];

  const events = [
    {
      id: 1,
      title: 'Summer Music Festival 2026',
      date: 'July 15, 2026',
      time: '2:00 PM - 10:00 PM',
      location: 'Central Park, New York',
      category: 'music',
      price: '$45',
      attendees: 245,
      image: '/images/music-festival.jpg'
    },
    {
      id: 2,
      title: 'Tech Innovation Summit',
      date: 'August 20, 2026',
      time: '9:00 AM - 5:00 PM',
      location: 'Convention Center',
      category: 'corporate',
      price: '$120',
      attendees: 180,
      image: '/images/tech-summit.jpg'
    },
    {
      id: 3,
      title: 'International Food Festival',
      date: 'September 5, 2026',
      time: '11:00 AM - 8:00 PM',
      location: 'Downtown Square',
      category: 'food',
      price: '$25',
      attendees: 320,
      image: '/images/food-festival.jpg'
    },
    {
      id: 4,
      title: 'Startup Networking Night',
      date: 'July 25, 2026',
      time: '6:00 PM - 9:00 PM',
      location: 'Innovation Hub',
      category: 'corporate',
      price: '$35',
      attendees: 95,
      image: '/images/startup-networking.jpg'
    },
    {
      id: 5,
      title: 'Jazz Evening Concert',
      date: 'August 10, 2026',
      time: '7:00 PM - 11:00 PM',
      location: 'Blue Note Club',
      category: 'music',
      price: '$55',
      attendees: 150,
      image: '/images/jazz-concert.jpg'
    },
    {
      id: 6,
      title: 'Marathon Championship',
      date: 'September 15, 2026',
      time: '6:00 AM - 2:00 PM',
      location: 'City Streets',
      category: 'sports',
      price: '$30',
      attendees: 420,
      image: '/images/marathon.jpg'
    },
    {
      id: 7,
      title: 'Digital Marketing Workshop',
      date: 'July 30, 2026',
      time: '10:00 AM - 4:00 PM',
      location: 'Business Center',
      category: 'education',
      price: '$85',
      attendees: 60,
      image: '/images/marketing-workshop.jpg'
    },
    {
      id: 8,
      title: 'Wine Tasting Experience',
      date: 'August 5, 2026',
      time: '5:00 PM - 9:00 PM',
      location: 'Vineyard Estate',
      category: 'food',
      price: '$75',
      attendees: 85,
      image: '/images/food-festival.jpg'
    },
    {
      id: 9,
      title: 'Rock Concert Extravaganza',
      date: 'September 20, 2026',
      time: '6:00 PM - 11:00 PM',
      location: 'Arena Stadium',
      category: 'music',
      price: '$65',
      attendees: 550,
      image: '/images/music-festival.jpg'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
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

          <div className="events-grid">
            {filteredEvents.map(event => (
              <div key={event.id} className="event-card-full">
                <div className="event-image-full">
                  <img src={event.image} alt={event.title} className="event-img-full" />
                </div>
                <div className="event-details">
                  <span className="event-category">{event.category}</span>
                  <h3 className="event-title">{event.title}</h3>
                  
                  <div className="event-meta">
                    <div className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span>{event.date}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">🕒</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="event-footer">
                    <div className="event-info-bottom">
                      <span className="event-price">{event.price}</span>
                      <span className="event-attendees">👥 {event.attendees} attending</span>
                    </div>
                    <button 
                      className="btn-primary"
                      onClick={() => setCurrentPage('event-details')}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="no-results">
              <p>No events found matching your criteria</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;