import React from 'react';
import '../styles/Contact.css';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Have questions? Reach out and we'll help plan your event.</p>
          <form className="contact-form">
            <input type="text" placeholder="Your name" />
            <input type="email" placeholder="Your email" />
            <textarea placeholder="Message" />
            <button className="btn-primary">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
