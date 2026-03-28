import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEventById } from "../../services/eventService";
import { bookEvent, cancelBooking, hasUserBooked } from "../../services/bookingService";
import { getWeatherForLocation } from "../../services/externalApiService";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
import { formatDate, formatTime, formatPrice, getAvailability } from "../../utils/formatters";
import { CATEGORIES } from "../../utils/constants";
import "./EventDetails.css";

function EventDetails() {
   const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alreadyBooked, setAlreadyBooked] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [weather, setWeather] = useState(null);
    const [alert, setAlert] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);
        
    useEffect(() => {
        async function load() {
            try {
                const evt = await getEventById(id);
                setEvent(evt);

                if (isAuthenticated && user) {
                    const { getUserBookings } = await import("../../services/bookingService");
                    const bookings = await getUserBookings(user.id);
                    const existing = bookings.find((b) => b.eventId === id && b.status === "confirmed");
                    if (existing) {
                        setAlreadyBooked(true);
                        setBookingId(existing.id);
                    }
                }

                // Load weather for the event location
                const wx = await getWeatherForLocation(evt.lat || 53.3498, evt.lng || -6.2603);
                setWeather(wx);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id, isAuthenticated, user]);
    
    const handleBook = async () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: { pathname: `/events/${id}` } } });
            return;
        }
        setBookingLoading(true);
        try {
            const booking = await bookEvent(event, user);

            setAlreadyBooked(true);
            setBookingId(booking.id);
            setAlert({ type: "success", message: "🎉 Booking confirmed! Check My Bookings to view it." });
        } catch (err) {
            setAlert({ type: "error", message: err.message });
        } finally {
            setBookingLoading(false);
        }
    };
    
    
    const handleCancel = async () => {
        if (!bookingId) return;
        setBookingLoading(true);
        try {
            await cancelBooking(bookingId, user.id);
            setAlreadyBooked(false);
            setBookingId(null);
            setAlert({ type: "info", message: "Booking cancelled successfully." });
        } catch (err) {
            setAlert({ type: "error", message: err.message });
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <Loader fullScreen message="Loading event…" />;
    if (!event) return (
        <div className="page" style={{ textAlign: "center", paddingTop: 80 }}>
            <h2>Event not found</h2>
            <Link to="/events" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Events</Link>
        </div>
    );
    const avail = getAvailability(event.capacity, event.attendees);
    const catObj = CATEGORIES.find((c) => c.value === event.category);
    const isSoldOut = avail.label === "Sold Out";

       return (
        <div className="event-details page">
            {alert && (
                <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} autoClose={5000} />
            )}

           
            <div className="event-details__hero">
                <img src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80"} alt={event.title} />
                <div className="event-details__hero-overlay" />
                <div className="event-details__hero-content">
                    <span className="badge badge-primary" style={{ fontSize: "0.85rem" }}>
                        {catObj?.emoji} {catObj?.label}
                    </span>
                    <h1 className="event-details__title">{event.title}</h1>
                    <p className="event-details__organizer">Organised by {event.organizer}</p>
                </div>
            </div>

            
            <div className="event-details__grid">
                
                <div className="event-details__main">
                    <div className="card">
                        <h2 className="event-details__section-title">About this Event</h2>
                        <p className="event-details__description">{event.description}</p>

                        {event.tags?.length > 0 && (
                            <div className="event-details__tags">
                                {event.tags.map((tag) => (
                                    <span key={tag} className="badge badge-accent">{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                 
                    <div className="card event-details__map-wrap">
                        <h2 className="event-details__section-title">📍 Location</h2>
                        <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: "0.9rem" }}>
                            {event.location}, {event.city}, {event.country}
                        </p>
                        <iframe
                            title="Event location map"
                            className="event-details__map"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location + ", " + event.city)}&output=embed`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

                
                <aside className="event-details__sidebar">
                    
                    <div className="card event-details__booking-card">
                        <div className="event-details__price">
                            <span className="event-details__price-val">{formatPrice(event.price)}</span>
                            {event.price > 0 && <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>per person</span>}
                        </div>

                        <div className="event-details__info-list">
                            <div className="event-details__info-item">
                                <span>📅</span>
                                <div>
                                    <p>{formatDate(event.date)}</p>
                                    {event.time && <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>at {formatTime(event.time)}</p>}
                                </div>
                            </div>
                            <div className="event-details__info-item">
                                <span>📍</span>
                                <p>{event.location}, {event.city}</p>
                            </div>
                            <div className="event-details__info-item">
                                <span>👥</span>
                                <div>
                                    <p style={{ color: avail.color }}>{avail.label}</p>
                                    <div className="event-card__capacity-bar" style={{ marginTop: 6 }}>
                                        <div className="event-card__capacity-fill" style={{ width: `${Math.min(avail.pct, 100)}%`, background: avail.color }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {alreadyBooked ? (
                            <div>
                                <div className="event-details__booked-badge">✅ You're registered!</div>
                                <button
                                    className="btn btn-outline"
                                    style={{ width: "100%", marginTop: 12, color: "var(--danger)", borderColor: "var(--danger)" }}
                                    onClick={handleCancel}
                                    disabled={bookingLoading}
                                >
                                    {bookingLoading ? "Cancelling…" : "Cancel Booking"}
                                </button>
                            </div>
                        ) : (
                            <button
                                className="btn btn-primary"
                                style={{ width: "100%" }}
                                onClick={handleBook}
                                disabled={isSoldOut || bookingLoading}
                            >
                                {bookingLoading ? "Processing…" : isSoldOut ? "Sold Out" : isAuthenticated ? "🎟️ Book Now" : "🔑 Log In to Book"}
                            </button>
                        )}

                        {!isAuthenticated && (
                            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center", marginTop: 10 }}>
                                <Link to="/login" style={{ color: "var(--primary-light)" }}>Log in</Link> or{" "}
                                <Link to="/register" style={{ color: "var(--primary-light)" }}>register</Link> to book this event
                            </p>
                        )}
                    </div>

                   
                    {weather && (
                        <div className="card event-details__weather">
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14 }}>🌤️ Weather at Venue</h3>
                            <div className="event-details__weather-row">
                                <span style={{ fontSize: "2.5rem" }}>{weather.icon}</span>
                                <div>
                                    <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{weather.temperature}{weather.unit}</p>
                                    <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{weather.condition}</p>
                                </div>
                            </div>
                            <div className="event-details__weather-details">
                                <div><span>💨</span><span>{weather.windspeed} km/h</span></div>
                                <div><span>💧</span><span>{weather.humidity}%</span></div>
                            </div>
                            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 12 }}>
                                Data via Open-Meteo API — updated hourly
                            </p>
                        </div>
                    )}

                   
                    <div className="card">
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14 }}>📢 Share this Event</h3>
                        <div style={{ display: "flex", gap: 10 }}>
                            {[
                                { label: "Twitter", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${window.location.href}`, emoji: "🐦" },
                                { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, emoji: "💼" },
                            ].map((s) => (
                                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ flex: 1, fontSize: "0.8rem", padding: "8px 12px" }}>
                                    {s.emoji} {s.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default EventDetails;


