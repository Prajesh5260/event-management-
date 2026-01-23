import React from 'react';

const Footer = ({ setCurrentPage }) => {
  return (
    <footer className="app-footer" style={{padding: '1rem 0', textAlign: 'center'}}>
      <div className="container">
        <p style={{margin: 0}}>© {new Date().getFullYear()} Polished Events</p>
        <div style={{marginTop: '0.5rem'}}>
          <button onClick={() => setCurrentPage && setCurrentPage('contact')} className="link-button">Contact</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
