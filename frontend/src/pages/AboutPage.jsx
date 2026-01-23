import React from 'react';
import '../styles/AboutPage.css';

const AboutPage = () => {
  const stats = [
    { number: '500+', label: 'Events Completed' },
    { number: '1000+', label: 'Happy Clients' },
    { number: '50+', label: 'Expert Team Members' },
    { number: '10+', label: 'Years Experience' }
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'Founder & CEO', emoji: '👩‍💼' },
    { name: 'Michael Chen', role: 'Event Director', emoji: '👨‍💼' },
    { name: 'Emily Rodriguez', role: 'Creative Lead', emoji: '👩‍🎨' },
    { name: 'David Kim', role: 'Operations Manager', emoji: '👨‍💻' }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Excellence',
      description: 'We strive for perfection in every detail of your event'
    },
    {
      icon: '🤝',
      title: 'Trust',
      description: 'Building lasting relationships through reliability and transparency'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Creative solutions that make your event unique and memorable'
    },
    {
      icon: '❤️',
      title: 'Passion',
      description: 'We love what we do and it shows in every event we create'
    }
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1 className="page-title">About Polished Events</h1>
          <p className="page-subtitle">
            Creating unforgettable moments through exceptional event planning
          </p>
        </div>
      </section>

      <section className="about-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2015, Polished Events began with a simple mission: to transform ordinary 
                gatherings into extraordinary experiences. What started as a small team of passionate 
                event planners has grown into a full-service event management company.
              </p>
              <p>
                Over the years, we've had the privilege of creating thousands of memorable events, 
                from intimate family celebrations to large-scale corporate conferences. Our dedication 
                to excellence and attention to detail has made us one of the most trusted names in 
                event planning.
              </p>
              <p>
                Today, we continue to innovate and push boundaries, bringing fresh ideas and 
                professional execution to every event we undertake. Your vision is our inspiration, 
                and your satisfaction is our success.
              </p>
            </div>
            <div className="story-image">
              <div className="image-placeholder">Our Team in Action</div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">{member.emoji}</div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section-about">
        <div className="container">
          <h2>Ready to Start Planning?</h2>
          <p>Let's create something amazing together</p>
          <button className="btn-primary">Get Started</button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;