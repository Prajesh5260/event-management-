import React, { useState } from 'react';
import '../styles/GalleryPage.css';

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'weddings', 'corporate', 'birthdays', 'concerts'];

  const gallery = [
    { id: 1, category: 'weddings', title: 'Elegant Wedding', image: '/images/elegant wedding.jfif' },
    { id: 2, category: 'corporate', title: 'Tech Conference', image: '/images/tech-summit.jpg' },
    { id: 3, category: 'birthdays', title: 'Birthday Bash', image: '/images/bd party 1.jpg' },
    { id: 4, category: 'concerts', title: 'Music Festival', image: '/images/music-festival.jpg' },
    { id: 5, category: 'weddings', title: 'Garden Events', image: '/images/garden events.jpg' },
    { id: 6, category: 'corporate', title: 'Product Launch', image: '/images/startup-networking.jpg' },
    { id: 7, category: 'birthdays', title: 'Kids Party', image: '/images/janmadin.jpg' },
    { id: 8, category: 'concerts', title: 'Jazz Night', image: '/images/jazz-concert.jpg' },
    { id: 9, category: 'weddings', title: 'Beach Wedding', image: '/images/beach wedding.jpg' },
    { id: 10, category: 'corporate', title: 'Team Building', image: '/images/hero-professional.jpg' },
    { id: 11, category: 'birthdays', title: 'Sweet 16', image: '/images/bd party 2.jfif' },
    { id: 12, category: 'concerts', title: 'Rock Concert', image: '/images/music-festival.jpg' }
  ];

  const filteredGallery = selectedCategory === 'all' 
    ? gallery 
    : gallery.filter(item => item.category === selectedCategory);

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="container">
          <h1 className="page-title">Event Gallery</h1>
          <p className="page-subtitle">
            Browse through our portfolio of successful events
          </p>
        </div>
      </section>

      <section className="gallery-content">
        <div className="container">
          <div className="gallery-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`gallery-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {filteredGallery.map(item => (
              <div key={item.id} className="gallery-item">
                <div className="gallery-image">
                  <img src={item.image} alt={item.title} className="gallery-img" />
                </div>
                <div className="gallery-overlay">
                  <h3>{item.title}</h3>
                  <span className="gallery-category">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredGallery.length === 0 && (
            <div className="no-results">
              <p>No items found in this category</p>
            </div>
          )}
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Polished Events made our wedding day absolutely perfect! Every detail was handled with care and professionalism."
              </p>
              <div className="testimonial-author">
                <strong>Sarah & John</strong>
                <span>Wedding - June 2025</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Our corporate event was a huge success thanks to their meticulous planning and execution. Highly recommended!"
              </p>
              <div className="testimonial-author">
                <strong>Tech Innovators Inc.</strong>
                <span>Corporate Event - August 2025</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "The birthday party they organized for my daughter was magical. She and all her friends had an amazing time!"
              </p>
              <div className="testimonial-author">
                <strong>Maria Rodriguez</strong>
                <span>Birthday Party - September 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;