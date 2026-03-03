import React, { useState, useEffect } from 'react';
import '../styles/GalleryPage.css';
import { apiFetch, API_BASE_URL } from '../utils/api';
import { useToast } from '../components/Toast';

export default function MyBookingsPage({ setCurrentPage }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const toast = useToast();
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast('Please login to view your bookings', 'error');
      setTimeout(() => setCurrentPage('login'), 2000);
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch('/bookings/user/my-bookings');

      if (res.ok && res.data?.bookings) {
        setBookings(res.data.bookings);
      } else {
        toast(res.data?.message || 'Failed to fetch bookings', 'error');
      }
    } catch (err) {
      toast(err.message || 'Error fetching bookings. Please try again.', 'error');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const token = localStorage.getItem('token');

    // confirmation is handled via inline prompt

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
        toast('Booking cancelled successfully!', 'success');
        fetchBookings();
      } else {
        toast(data.message || 'Failed to cancel booking', 'error');
      }
    } catch (err) {
      toast('Error cancelling booking. Please try again.', 'error');
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
                      <span className="value price">NPR{booking.totalPrice}</span>
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
                      {confirmCancelId === booking.id ? (
                        <>
                          <button
                            className="cancel-btn"
                            onClick={() => {
                              handleCancelBooking(booking.id);
                              setConfirmCancelId(null);
                            }}
                            disabled={cancelingId === booking.id}
                          >
                            {cancelingId === booking.id ? 'Cancelling...' : 'Yes, cancel'}
                          </button>
                          <button
                            className="secondary-btn"
                            onClick={() => setConfirmCancelId(null)}
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <button
                          className="cancel-btn"
                          onClick={() => setConfirmCancelId(booking.id)}
                          disabled={cancelingId === booking.id}
                        >
                          Cancel Booking
                        </button>
                      )}
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
