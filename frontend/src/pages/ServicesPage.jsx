import React from 'react';
import '../styles/ServicesPage.css';

const ServicesPage = () => {
  const services = [
    {
      icon: '💍',
      title: 'Wedding Planning',
      description: 'Complete wedding coordination from venue selection to day-of management. We handle every detail to make your special day perfect.',
      features: ['Venue Selection', 'Vendor Coordination', 'Day-of Management', 'Budget Planning'],
      color: '#E8E3F3',
      image: '/images/wedding-planning.jpeg'
    },
    {
      icon: '🎂',
      title: 'Birthday Celebrations',
      description: 'Themed birthday parties for all ages with customized decorations, entertainment, and catering services.',
      features: ['Theme Selection', 'Entertainment', 'Catering', 'Photography'],
      color: '#E8F5E8',
      image: '/images/birthday-celebration.jpeg'
    },
    {
      icon: '🏢',
      title: 'Corporate Events',
      description: 'Professional event management for conferences, seminars, product launches, and team building activities.',
      features: ['Venue Booking', 'Audio/Visual Setup', 'Catering', 'Registration Management'],
      color: '#FFE8E8',
      image: '/images/corporate-events.jpeg'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Family Reunions',
      description: 'Bring families together with well-organized reunions including venue, activities, and meal planning.',
      features: ['Venue Coordination', 'Activity Planning', 'Accommodation Help', 'Photo Services'],
      color: '#FFF4E6',
      image: '/images/family-reunion.jpeg'
    },
    {
      icon: '🎓',
      title: 'Graduation Parties',
      description: 'Celebrate academic achievements with memorable graduation parties and ceremonies.',
      features: ['Venue Setup', 'Decorations', 'Catering', 'Entertainment'],
      color: '#E6F7FF',
      image: '/images/graduation-party.jpeg'
    },
    {
      icon: '🎪',
      title: 'Special Occasions',
      description: 'Custom event planning for anniversaries, engagements, retirement parties, and more.',
      features: ['Custom Planning', 'Decoration', 'Vendor Management', 'Timeline Creation'],
      color: '#F3E8FF',
      image: '/images/special-occasions.jpeg'
    }
  ];

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="container">
          <h1 className="page-title">Our Services</h1>
          <p className="page-subtitle">
            Comprehensive event planning and management services tailored to your needs
          </p>
        </div>
      </section>

      <section className="services-content">
        <div className="container">
          <div className="services-grid-detailed">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="service-card-detailed"
                style={{ backgroundColor: service.color }}
              >
                <div className="service-image">
                  <img src={service.image} alt={service.title} className="service-img" />
                </div>
                <div className="service-icon-large">{service.icon}</div>
                <h3 className="service-title-detailed">{service.title}</h3>
                <p className="service-description-detailed">{service.description}</p>
                
                <div className="service-features">
                  <h4>What's Included:</h4>
                  <ul>
                    {service.features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
                
                <button className="btn-secondary">Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="container">
          <h2 className="section-title">Our Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Consultation</h3>
              <p>We meet to understand your vision, requirements, and budget</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Planning</h3>
              <p>Detailed planning with timeline, vendors, and resource allocation</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Execution</h3>
              <p>Flawless execution with on-site coordination and management</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Follow-up</h3>
              <p>Post-event support and feedback collection</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;