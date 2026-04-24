import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyBookings, cancelBooking } from "../../services/bookingService";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
import { formatDate, formatTime, formatPrice } from "../../utils/formatters";
import "./MyBookings.css";

function MyBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getMyBookings();

            data.sort((a, b) => {
                if (a.status !== b.status) return a.status === "confirmed" ? -1 : 1;
                return new Date(a.event?.date) - new Date(b.event?.date);
            });

            setBookings(data);
        } catch (err) {
            setAlert({
                type: "error",
                message: err.response?.data?.message || err.message || "Failed to load bookings.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) load();
    }, [user?.id]);

    const handleCancel = async (bookingId) => {
        try {
            await cancelBooking(bookingId);
            setAlert({ type: "info", message: "Booking cancelled successfully." });
            await load();
        } catch (err) {
            setAlert({
                type: "error",
                message: err.response?.data?.message || err.message || "Failed to cancel booking.",
            });
        }
    };

    const confirmed = bookings.filter((b) => b.status === "confirmed");
    const cancelled = bookings.filter((b) => b.status === "cancelled");

    return (
        <div className="bookings-page page">
            <h1 className="section-title">My Bookings</h1>
            <p className="section-sub">Manage all your event registrations in one place</p>

            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                    autoClose={4000}
                />
            )}

            {loading ? (
                <Loader fullScreen message="Loading your bookings…" />
            ) : bookings.length === 0 ? (
                <div className="bookings-page__empty">
                    <p style={{ fontSize: "4rem" }}>🎟️</p>
                    <h3>No bookings yet</h3>
                    <p>You haven't booked any events. Explore events and register today!</p>
                    <Link to="/events" className="btn btn-primary" style={{ marginTop: 20 }}>
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div>
                    {confirmed.length > 0 && (
                        <div className="bookings-page__section">
                            <h2 className="bookings-page__section-title">
                                ✅ Confirmed ({confirmed.length})
                            </h2>
                            <div className="bookings-page__grid">
                                {confirmed.map((b) => (
                                    <BookingCard key={b._id} booking={b} onCancel={handleCancel} />
                                ))}
                            </div>
                        </div>
                    )}

                    {cancelled.length > 0 && (
                        <div className="bookings-page__section">
                            <h2
                                className="bookings-page__section-title"
                                style={{ color: "var(--text-muted)" }}
                            >
                                ❌ Cancelled ({cancelled.length})
                            </h2>
                            <div className="bookings-page__grid">
                                {cancelled.map((b) => (
                                    <BookingCard key={b._id} booking={b} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function BookingCard({ booking, onCancel }) {
    const event = booking.event;

    if (!event) return null;

    const isCancelled = booking.status === "cancelled";
    const isPast = event.date && new Date(event.date) < new Date();

    return (
        <div className={`booking-card card ${isCancelled ? "booking-card--cancelled" : ""}`}>
            <div className="booking-card__img-wrap">
                <img
                    src={
                        event.image ||
                        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=70"
                    }
                    alt={event.title}
                    className="booking-card__img"
                    loading="lazy"
                />

                <span className={`booking-card__status ${isCancelled ? "cancelled" : isPast ? "past" : "upcoming"}`}>
                    {isCancelled ? "Cancelled" : isPast ? "Completed" : "Upcoming"}
                </span>
            </div>

            <div className="booking-card__body">
                <h3 className="booking-card__title">
                    <Link to={`/events/${event._id}`}>{event.title}</Link>
                </h3>

                <p className="booking-card__meta">
                    📅 {formatDate(event.date)} {event.time && `· ${formatTime(event.time)}`}
                </p>

                <p className="booking-card__meta">
                    📍 {event.venue}, {event.city}
                </p>

                <p className="booking-card__meta">
                    💶 {formatPrice(booking.price)}
                </p>

                <p
                    className="booking-card__meta"
                    style={{ marginTop: 4, fontSize: "0.72rem", color: "var(--text-muted)" }}
                >
                    Booked on {new Date(booking.createdAt).toLocaleDateString("en-IE")}
                </p>

                <div className="booking-card__actions">
                    <Link
                        to={`/events/${event._id}`}
                        className="btn btn-outline"
                        style={{ fontSize: "0.8rem", padding: "8px 16px" }}
                    >
                        View Event
                    </Link>

                    {!isCancelled && !isPast && onCancel && (
                        <button
                            className="booking-card__cancel-btn"
                            onClick={() => onCancel(booking._id)}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyBookings;