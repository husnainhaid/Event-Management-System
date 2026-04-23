import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/eventService";
import EventForm from "../../components/events/EventForm";
import Alert from "../../components/common/Alert";
import "./CreateEvent.css";

function CreateEvent() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (data) => {
        setLoading(true);
        setError("");

        try {
            const event = await createEvent(data);
            navigate(`/events/${event._id}`);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to create event.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-event page">
            <div className="create-event__header">
                <span className="create-event__icon">🎪</span>
                <h1 className="section-title">Create New Event</h1>
                <p className="section-sub">Fill in the details below to publish your event to EventPro</p>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError("")} />}

            <div className="create-event__body card">
                <EventForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
}

export default CreateEvent;