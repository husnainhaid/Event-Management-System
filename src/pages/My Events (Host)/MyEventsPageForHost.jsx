import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserEvents, deleteEvent } from "../../services/eventService";
import EventCard from "../../components/events/EventCard";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
import "../Events/Events.css";
import "./MyEvents.css";

function MyEvents() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUserEvents();
            setEvents(data);
        } catch (err) {
            setAlert({
                type: "error",
                message: err.response?.data?.message || err.message || "Failed to load your events.",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user?.role !== "host") {
            navigate("/events");
            return;
        }

        fetchEvents();
    }, [user, navigate, fetchEvents]);

    const handleEdit = (eventId) => {
        navigate(`/edit/${eventId}`);
    };

    const handleDelete = async (eventId) => {
        const confirmed = window.confirm("Are you sure you want to delete this event?");
        if (!confirmed) return;

        setDeletingId(eventId);
        try {
            await deleteEvent(eventId);
            setEvents((prev) => prev.filter((evt) => evt._id !== eventId));
            setAlert({
                type: "success",
                message: "Event deleted successfully.",
            });
        } catch (err) {
            setAlert({
                type: "error",
                message: err.response?.data?.message || err.message || "Failed to delete event.",
            });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="events-page page">
            <div className="events-page__header">
                <h1 className="section-title">My Events</h1>
                <p className="section-sub">
                    You have created {events.length} event{events.length !== 1 ? "s" : ""}
                </p>
            </div>

            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            {loading ? (
                <Loader fullScreen message="Loading your events…" />
            ) : events.length === 0 ? (
                <div className="events-page__empty">
                    <p className="events-page__empty-icon">🎪</p>
                    <h3>No events yet</h3>
                    <p>Create your first event to get started.</p>

                    <button
                        className="btn btn-primary"
                        style={{ marginTop: 16 }}
                        onClick={() => navigate("/create")}
                    >
                        + Create Event
                    </button>
                </div>
            ) : (

                <div className="events-page__grid">
                    {events.map((evt) => (
                        <EventCard
                            key={evt._id}
                            event={evt}
                            showActions
                            deleting={deletingId === evt._id}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

            )}
        </div>
    );
}

export default MyEvents;