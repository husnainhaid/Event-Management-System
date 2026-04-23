import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getEventStats, getUserEvents, deleteEvent } from "../../services/eventService";
import { getEventAttendees } from "../../services/bookingService";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
import { formatDateShort, formatPrice } from "../../utils/formatters";
import "./HostDashboard.css";

function HostDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const [expandedEventId, setExpandedEventId] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [attendeesLoading, setAttendeesLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const [s, evts] = await Promise.all([
                getEventStats(),
                getUserEvents(),
            ]);
            setStats(s);
            setEvents(evts);
        } catch (err) {
            console.error(err);
            setAlert({
                type: "error",
                message: err.response?.data?.message || "Failed to load dashboard.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id || user?.id) load();
    }, [user?._id, user?.id]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEvent(id);
            setAlert({ type: "success", message: "Event deleted successfully." });

            if (expandedEventId === id) {
                setExpandedEventId(null);
                setAttendees([]);
            }

            await load();
        } catch (err) {
            setAlert({
                type: "error",
                message: err.response?.data?.message || err.message,
            });
        }
    };

    const handleToggleAttendees = async (eventId) => {
        if (expandedEventId === eventId) {
            setExpandedEventId(null);
            setAttendees([]);
            return;
        }

        setExpandedEventId(eventId);
        setAttendeesLoading(true);

        try {
            const data = await getEventAttendees(eventId);
            setAttendees(data);
        } catch (err) {
            console.error(err);
        } finally {
            setAttendeesLoading(false);
        }
    };

    const statCards = stats
        ? [
            { label: "Total Events", value: stats.totalEvents, emoji: "🎪", color: "var(--primary-light)" },
            { label: "Total Attendees", value: stats.totalAttendees.toLocaleString(), emoji: "👥", color: "var(--accent)" },
            { label: "Upcoming", value: stats.upcomingEvents, emoji: "📅", color: "#10b981" },
            { label: "Free Events", value: stats.freeEvents, emoji: "🎉", color: "#f59e0b" },
            { label: "Categories", value: stats.categories, emoji: "🗂️", color: "#8b5cf6" },
        ]
        : [];

    return (
        <div className="dashboard page">
            <div className="dashboard__header">
                <div>
                    <h1 className="section-title">📊 Dashboard</h1>
                    <p className="section-sub">
                        Welcome back, <strong>{user?.name}</strong>! Manage your events below.
                    </p>
                </div>
                <Link to="/create" className="btn btn-primary">
                    + Create Event
                </Link>
            </div>

            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                    autoClose={4000}
                />
            )}

            {loading ? (
                <Loader fullScreen message="Loading dashboard…" />
            ) : (
                <>
                    {/* Stats */}
                    <div className="dashboard__stats">
                        {statCards.map((s) => (
                            <div key={s.label} className="dashboard__stat card">
                                <span className="dashboard__stat-emoji">{s.emoji}</span>
                                <p className="dashboard__stat-value" style={{ color: s.color }}>
                                    {s.value}
                                </p>
                                <p className="dashboard__stat-label">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Events Table */}
                    <div className="card dashboard__table-wrap">
                        <div className="dashboard__table-header">
                            <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>
                                🎪 My Events ({events.length})
                            </h2>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
                                Click <strong>👥 Attendees</strong> on any event to see who has booked it.
                            </p>
                        </div>

                        {events.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                                <p style={{ fontSize: "2rem" }}>📭</p>
                                <p>You haven't created any events yet.</p>
                                <Link to="/create" className="btn btn-primary" style={{ marginTop: 16 }}>
                                    Create Your First Event
                                </Link>
                            </div>
                        ) : (
                            <div className="dashboard__table-scroll">
                                <table className="dashboard__table">
                                    <thead>
                                        <tr>
                                            <th>Event</th>
                                            <th>Date</th>
                                            <th>Price</th>
                                            <th>Bookings</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map((evt) => (
                                            <React.Fragment key={evt._id}>
                                                <tr
                                                    className={
                                                        expandedEventId === evt._id
                                                            ? "dashboard__table-row--active"
                                                            : ""
                                                    }
                                                >
                                                    <td>
                                                        <div className="dashboard__table-event">
                                                            <img
                                                                src={
                                                                    evt.image ||
                                                                    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=80&q=60"
                                                                }
                                                                alt={evt.title}
                                                                className="dashboard__table-thumb"
                                                            />
                                                            <span>{evt.title}</span>
                                                        </div>
                                                    </td>

                                                    <td>{formatDateShort(evt.date)}</td>
                                                    <td>{formatPrice(evt.price)}</td>

                                                    <td>
                                                        <span className="badge badge-primary" style={{ fontSize: "0.75rem" }}>
                                                            {evt.attendees || 0} / {evt.capacity}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="dashboard__table-actions">
                                                            <button
                                                                className={`dashboard__table-btn ${expandedEventId === evt._id
                                                                        ? "attendees-active"
                                                                        : "attendees"
                                                                    }`}
                                                                onClick={() => handleToggleAttendees(evt._id)}
                                                            >
                                                                👥 Attendees
                                                            </button>

                                                            <button
                                                                className="dashboard__table-btn view"
                                                                onClick={() => navigate(`/events/${evt._id}`)}
                                                            >
                                                                View
                                                            </button>

                                                            <button
                                                                className="dashboard__table-btn edit"
                                                                onClick={() => navigate(`/edit/${evt._id}`)}
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                className="dashboard__table-btn delete"
                                                                onClick={() => handleDelete(evt._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {expandedEventId === evt._id && (
                                                    <tr className="dashboard__attendees-row">
                                                        <td colSpan={5}>
                                                            <div className="dashboard__attendees-panel">
                                                                <h3>
                                                                    👥 Attendees for <em>{evt.title}</em>
                                                                </h3>

                                                                {attendeesLoading ? (
                                                                    <Loader size="sm" message="Loading attendees…" />
                                                                ) : attendees.length === 0 ? (
                                                                    <p>No bookings yet for this event.</p>
                                                                ) : (
                                                                    attendees.map((b) => (
                                                                        <div key={b._id} className="dashboard__attendee-card">
                                                                            <div>{b.userName}</div>
                                                                            <div>{b.userEmail}</div>
                                                                            <div>{formatPrice(b.price)}</div>
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default HostDashboard;