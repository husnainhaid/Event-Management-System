import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createEvent } from "../../services/eventService";
import EventForm from "../../components/events/EventForm";
import "./CreateEvent.css";

function CreateEvent() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {
        setLoading(true);
        try {
            const event = await createEvent(data, user.id);
            navigate(`/events/${event.id}`);
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
            <div className="create-event__body card">
                <EventForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );


}
export default CreateEvent;
