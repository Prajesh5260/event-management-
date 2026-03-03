import React, { useEffect, useState } from 'react';
import { useToast } from '../components/Toast';
import '../styles/AdminDashboard.css';
import { apiFetch } from '../utils/api';

export default function AdminDashboard({ setCurrentPage }) {
  const [tab, setTab] = useState('users');

  // Users
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);

  // Events
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', description: '', location: '', eventDate: '', budget: '' });

  // Bookings
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    if (tab === 'events') fetchEvents();
    if (tab === 'bookings') fetchBookings();
  }, [tab]);

  // Users
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await apiFetch('/admin/users');
      if (res.ok) setUsers(res.data.users || []);
      else console.error('Failed to fetch users', res);
    } catch (err) {
      console.error('Network error fetching users', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const viewUser = async (id) => {
    try {
      const res = await apiFetch(`/admin/users/${id}`);
      if (res.ok) setSelectedUser(res.data.user);
      else console.error('Failed to fetch user', res);
    } catch (err) {
      console.error('Network error fetching user', err);
    }
  };

  const updateUser = async (id, payload) => {
    try {
      const res = await apiFetch(`/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) fetchUsers();
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Events
  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const res = await apiFetch('/events');
      if (res.ok) setEvents(res.data.events || []);
      else console.error('Failed to fetch events', res);
    } catch (err) {
      console.error('Network error fetching events', err);
    } finally {
      setEventsLoading(false);
    }
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        // Update
        const res = await apiFetch(`/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventForm),
        });
        if (res.ok) {
          fetchEvents();
          setEditingEvent(null);
          setEventForm({ title: '', description: '', location: '', eventDate: '', budget: '' });
          toast('Event updated successfully', 'success');
        } else {
          toast(res.data?.message || 'Failed to update event', 'error');
        }
      } else {
        // Create
        const res = await apiFetch('/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventForm),
        });
        if (res.ok) {
          fetchEvents();
          setEventForm({ title: '', description: '', location: '', eventDate: '', budget: '' });
          toast('Event created successfully', 'success');
        } else {
          toast(res.data?.message || 'Failed to create event', 'error');
        }
      }
    } catch (err) {
      toast(err.message || 'Network error', 'error');
      console.error(err);
    }
  };

  const editEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      location: event.location || '',
      eventDate: event.eventDate ? event.eventDate.split('T')[0] : '',
      budget: event.budget || '',
    });
  };

  const deleteEvent = async (id) => {
    try {
      const res = await apiFetch(`/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEvents();
        toast('Event deleted', 'success');
      } else toast(res.data?.message || 'Failed to delete', 'error');
    } catch (err) {
      toast('Network error', 'error');
    }
  };

  // Bookings
  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      const res = await apiFetch('/admin/bookings');
      if (res.ok) setBookings(res.data.bookings || []);
      else console.error('Failed to fetch bookings', res);
    } catch (err) {
      console.error('Network error fetching bookings', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const res = await apiFetch(`/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchBookings();
      else toast(res.data?.message || 'Failed to update', 'error');
    } catch (err) {
      toast('Network error', 'error');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-tabs">
          <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Users</button>
          <button className={tab === 'events' ? 'active' : ''} onClick={() => setTab('events')}>Events</button>
          <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>Bookings</button>
        </div>
      </div>

      <div className="admin-content">
        {tab === 'users' && (
          <div className="admin-section users">
            <h2>Users</h2>
            {usersLoading ? <p>Loading...</p> : (
              <div className="users-grid">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Admin</th>
                      <th>Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>{u.email}</td>
                        <td>{u.isAdmin ? 'Yes' : 'No'}</td>
                        <td>{u.isActive ? 'Yes' : 'No'}</td>
                        <td>
                          <button onClick={() => viewUser(u.id)}>View</button>
                          <button onClick={() => updateUser(u.id, { isAdmin: !u.isAdmin })}>{u.isAdmin ? 'Demote' : 'Promote'}</button>
                          <button onClick={() => updateUser(u.id, { isActive: !u.isActive })}>{u.isActive ? 'Disable' : 'Enable'}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {selectedUser && (
                  <div className="user-details">
                    <h3>User Details</h3>
                    <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Phone:</strong> {selectedUser.phone || '—'}</p>
                    <h4>Bookings</h4>
                    <ul>
                      {selectedUser.Bookings && selectedUser.Bookings.length ? selectedUser.Bookings.map(b => (
                        <li key={b.id}>{b.bookingType} — {b.status} — {b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : '—'}</li>
                      )) : <li>No bookings</li>}
                    </ul>
                    <button onClick={() => setSelectedUser(null)}>Close</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'events' && (
          <div className="admin-section events">
            <h2>Events</h2>
            <div className="event-actions">
              <button onClick={() => { setEditingEvent(null); setEventForm({ title: '', description: '', location: '', eventDate: '', budget: '' }); }}>Add Event</button>
            </div>

            <div className="event-form">
              <form onSubmit={saveEvent}>
                <input placeholder="Title" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} required />
                <input placeholder="Location" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} required />
                <input type="date" placeholder="Date" value={eventForm.eventDate} onChange={e => setEventForm({ ...eventForm, eventDate: e.target.value })} required />
                <input placeholder="Budget" value={eventForm.budget} onChange={e => setEventForm({ ...eventForm, budget: e.target.value })} />
                <textarea placeholder="Description" value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} />
                <button type="submit">{editingEvent ? 'Update Event' : 'Create Event'}</button>
                {editingEvent && <button type="button" onClick={() => { setEditingEvent(null); setEventForm({ title: '', description: '', location: '', eventDate: '', budget: '' }); }}>Cancel</button>}
              </form>
            </div>

            {eventsLoading ? <p>Loading events...</p> : (
              <table className="events-table">
                <thead>
                  <tr><th>Title</th><th>Date</th><th>Location</th><th>Budget</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {events.map(ev => (
                    <tr key={ev.id}>
                      <td>{ev.title}</td>
                      <td>{ev.eventDate ? ev.eventDate.split('T')[0] : '—'}</td>
                      <td>{ev.location}</td>
                      <td>{ev.budget || '—'}</td>
                      <td>
                        <button onClick={() => editEvent(ev)}>Edit</button>
                        <button onClick={() => deleteEvent(ev.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'bookings' && (
          <div className="admin-section bookings">
            <h2>Bookings</h2>
            {bookingsLoading ? <p>Loading...</p> : (
              <table>
                <thead>
                  <tr><th>User</th><th>Type</th><th>Event/Service</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td>{b.User ? `${b.User.firstName} ${b.User.lastName}` : '—'}</td>
                      <td>{b.bookingType}</td>
                      <td>{b.Event ? b.Event.title : (b.Service ? b.Service.serviceName : '—')}</td>
                      <td>{b.status}</td>
                      <td>{b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : '—'}</td>
                      <td>
                        <select defaultValue={b.status} onChange={(e) => updateBookingStatus(b.id, e.target.value)}>
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
