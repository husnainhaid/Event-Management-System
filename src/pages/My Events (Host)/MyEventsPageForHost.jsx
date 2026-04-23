import React, { useState, useEffect, useCallback } from "react";
import { getUserEvents } from "../../services/eventService";
import EventCard from "../../components/events/EventCard";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../Events/Events.css"; 

function MyEvents() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUserEvents();
            setEvents(data);
        } catch (err) {
            console.error(err);
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

    return (
        <div className="events-page page">
            <div className="events-page__header">
                <h1 className="section-title">My Events</h1>
                <p className="section-sub">
                    You have created {events.length} event{events.length !== 1 ? "s" : ""}
                </p>
            </div>

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
                        <EventCard key={evt._id} event={evt} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyEvents;