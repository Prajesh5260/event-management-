import React, { useState, useEffect } from 'react';
import '../styles/GalleryPage.css';

const API_BASE_URL = 'http://localhost:5000/api';

export default function MyBookingsPage({ setCurrentPage }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Please login to view your bookings');
      setTimeout(() => setCurrentPage('login'), 2000);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/bookings/user/my-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.bookings) {
        setBookings(data.bookings);
      } else {
        setError(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error fetching bookings. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const token = localStorage.getItem('token');

    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancelingId(bookingId);
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Booking cancelled successfully!');
        fetchBookings();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to cancel booking');
      }
    } catch (err) {
      setError('Error cancelling booking. Please try again.');
      console.error('Cancel error:', err);
    } finally {
      setCancelingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = `status-badge status-${status.toLowerCase()}`;
    const statusIcon = {
      Pending: '⏳',
      Confirmed: '✓',
      Cancelled: '✕',
    };

    return (
      <span className={statusClass}>
        {statusIcon[status] || ''} {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="gallery-page">
      <div className="gallery-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>My Bookings</h1>
          <p>Manage and track all your event and service bookings</p>
        </div>
      </div>

      <div className="gallery-container">
        <div className="bookings-wrapper">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {loading ? (
            <div className="loading-message">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <h2>No bookings yet</h2>
              <p>Start planning your event by creating a booking!</p>
              <button
                onClick={() => setCurrentPage('booking')}
                className="cta-button"
              >
                Make a Booking
              </button>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div>
                      <h3 className="booking-title">
                        {booking.bookingType} Booking
                      </h3>
                      <p className="booking-type">
                        {booking.Event?.eventName || booking.Service?.serviceName || 'N/A'}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="label">Type:</span>
                      <span className="value">{booking.bookingType}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Quantity:</span>
                      <span className="value">{booking.quantity}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Preferred Date:</span>
                      <span className="value">
                        {formatDate(booking.preferredDate)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Total Price:</span>
                      <span className="value price">${booking.totalPrice}</span>
                    </div>
                    {booking.notes && (
                      <div className="detail-row full">
                        <span className="label">Notes:</span>
                        <span className="value">{booking.notes}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="label">Booked On:</span>
                      <span className="value">
                        {formatDate(booking.createdAt)}
                      </span>
                    </div>
                  </div>

                  {booking.status !== 'Cancelled' && (
                    <div className="booking-actions">
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancelingId === booking.id}
                      >
                        {cancelingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="bookings-footer">
            <button
              onClick={() => setCurrentPage('home')}
              className="back-home-btn"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
