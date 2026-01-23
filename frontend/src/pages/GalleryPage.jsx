import React, { useState } from 'react';
import '../styles/GalleryPage.css';

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'weddings', 'corporate', 'birthdays', 'concerts'];

  const gallery = [
    { id: 1, category: 'weddings', title: 'Elegant Wedding', emoji: '💒' },
    { id: 2, category: 'corporate', title: 'Tech Conference', emoji: '💼' },
    { id: 3, category: 'birthdays', title: 'Birthday Bash', emoji: '🎂' },
    { id: 4, category: 'concerts', title: 'Music Festival', emoji: '🎵' },
    { id: 5, category: 'weddings', title: 'Garden Wedding', emoji: '🌸' },
    { id: 6, category: 'corporate', title: 'Product Launch', emoji: '🚀' },
    { id: 7, category: 'birthdays', title: 'Kids Party', emoji: '🎈' },
    { id: 8, category: 'concerts', title: 'Jazz Night', emoji: '🎺' },
    { id: 9, category: 'weddings', title: 'Beach Wedding', emoji: '🏖️' },
    { id: 10, category: 'corporate', title: 'Team Building', emoji: '👥' },
    { id: 11, category: 'birthdays', title: 'Sweet 16', emoji: '🎉' },
    { id: 12, category: 'concerts', title: 'Rock Concert', emoji: '🎸' }
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
                  <span className="gallery-emoji">{item.emoji}</span>
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