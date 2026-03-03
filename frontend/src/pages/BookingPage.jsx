import React, { useState, useEffect } from 'react';
import '../styles/EventPage.css';
import { apiFetch } from '../utils/api';
import { useToast } from '../components/Toast';

export default function BookingPage({ setCurrentPage }) {
  const [bookingType, setBookingType] = useState('Event');
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchEvents();
    fetchServices();

    // Check for preselected event (from Event Details 'Book Now')
    try {
      const pre = localStorage.getItem('preselectEvent');
      if (pre) {
        setSelectedEvent(String(pre));
        localStorage.removeItem('preselectEvent');
      }
    } catch (err) {
      console.error('Error reading preselectEvent:', err);
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await apiFetch('/events');
      if (res.ok && res.data?.events) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  }; 

  const fetchServices = async () => {
    try {
      const res = await apiFetch('/services');
      if (res.ok && res.data?.services) {
        setServices(res.data.services);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  }; 

  const handleBook = async (e) => {
    e.preventDefault();
    // clear is handled via toast

    const token = localStorage.getItem('token');
    if (!token) {
      toast('Please login to make a booking', 'error');
      setTimeout(() => setCurrentPage('login'), 1500);
      return;
    }

    if (!preferredDate) {
      toast('Please select a preferred date', 'error');
      return;
    }

    if (bookingType === 'Event' && !selectedEvent) {
      toast('Please select an event', 'error');
      return;
    }

    if (bookingType === 'Service' && !selectedService) {
      toast('Please select a service', 'error');
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        bookingType,
        quantity: parseInt(quantity),
        preferredDate,
        notes,
      };

      if (bookingType === 'Event') {
        bookingData.eventId = selectedEvent;
      } else {
        bookingData.serviceId = selectedService;
      }

      try {
        const res = await apiFetch('/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        });

        if (!res.ok) {
          toast(res.data?.message || 'Booking failed', 'error');
          return;
        }

        toast('Booking created successfully! Redirecting to your bookings...', 'success');
        setTimeout(() => {
          setCurrentPage('my-bookings');
        }, 1500);
      } catch (err) {
        toast(err.message || 'Booking network error. Please try again.', 'error');
        console.error('Booking network error:', err);
        return;
      }
    } catch (err) {
      toast('Error creating booking. Please try again.', 'error');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedItemPrice = () => {
    if (bookingType === 'Event') {
      const event = events.find((e) => String(e.id) === String(selectedEvent));
      return event ? event.budget || event.price || 0 : 0;
    } else {
      const service = services.find((s) => String(s.id) === String(selectedService));
      return service ? service.price || 0 : 0;
    }
  };

  const totalPrice = (getSelectedItemPrice() * quantity).toFixed(2);

  return (
    <div className="event-page">
      <div className="event-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Book Your Event or Service</h1>
          <p>Reserve your perfect celebration or service with just a few clicks</p>
        </div>
      </div>

      <div className="event-details-container">
        <div className="booking-form-wrapper">
          <div className="booking-form-card">
            <h2 className="form-title">Make a Booking</h2>


            <form onSubmit={handleBook} className="booking-form">
              {/* Booking Type Selection */}
              <div className="form-group">
                <label htmlFor="booking-type">What would you like to book?</label>
                <div className="booking-type-selector">
                  <button
                    type="button"
                    className={`type-btn ${bookingType === 'Event' ? 'active' : ''}`}
                    onClick={() => {
                      setBookingType('Event');
                      setSelectedEvent('');
                    }}
                  >
                    📅 Event
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${bookingType === 'Service' ? 'active' : ''}`}
                    onClick={() => {
                      setBookingType('Service');
                      setSelectedService('');
                    }}
                  >
                    🎁 Service
                  </button>
                </div>
              </div>

              {/* Event Selection */}
              {bookingType === 'Event' && (
                <div className="form-group">
                  <label htmlFor="event-select">Select an Event</label>
                  <select
                    id="event-select"
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">-- Choose an event --</option>
                    {events.map((event) => (
                      <option key={event.id} value={String(event.id)}>
                        {event.title} (NPR{event.budget})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Service Selection */}
              {bookingType === 'Service' && (
                <div className="form-group">
                  <label htmlFor="service-select">Select a Service</label>
                  <select
                    id="service-select"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">-- Choose a service --</option>
                    {services.map((service) => (
                      <option key={service.id} value={String(service.id)}>
                        {service.serviceName} - {service.category} (NPR{service.price})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity */}
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {/* Preferred Date */}
              <div className="form-group">
                <label htmlFor="preferred-date">Preferred Date</label>
                <input
                  id="preferred-date"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {/* Notes */}
              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-input textarea"
                  placeholder="Tell us about your preferences or special requests..."
                  rows="4"
                ></textarea>
              </div>

              {/* Price Summary */}
              <div className="price-summary">
                <div className="summary-row">
                  <span>Unit Price:</span>
                  <span>NPR{getSelectedItemPrice()}</span>
                </div>
                <div className="summary-row">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Price:</span>
                  <span>NPR{totalPrice}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Processing Booking...' : 'Complete Booking'}
              </button>

              {/* Back Link */}
              <p className="back-link">
                <span
                  onClick={() => setCurrentPage('events')}
                  style={{ cursor: 'pointer', color: '#B2AA8E', fontWeight: '600' }}
                >
                  ← Back to Events
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
