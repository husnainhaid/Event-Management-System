import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getEventById, updateEvent } from "../../services/eventService";
import EventForm from "../../components/events/EventForm";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";

function EditEvent() {

 const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
useEffect(() => {
        getEventById(id)
            .then((evt) => {
                
                if (evt.organizerId !== user?.id) {
                    navigate("/events");
                    return;
                }
                setEvent(evt);
            })
            .catch(() => navigate("/events"))
            .finally(() => setLoading(false));
    }, [id, user, navigate]);

    const handleSubmit = async (data) => {
        setSaving(true);
        try {
            await updateEvent(id, data, user.id);
            navigate(`/events/${id}`);
        } catch (err) {
            setError(err.message);
            setSaving(false);
        }
    };

    if (loading) return <Loader fullScreen message="Loading event…" />;

    return (
        <div className="create-event page">
            <div className="create-event__header">
                <span className="create-event__icon">✏️</span>
                <h1 className="section-title">Edit Event</h1>
                <p className="section-sub">Update the details for: <strong>{event?.title}</strong></p>
            </div>
            {error && <Alert type="error" message={error} onClose={() => setError("")} />}
            <div className="create-event__body card">
                {event && (
                    <EventForm
                        initialData={{
                            ...event,
                            tags: Array.isArray(event.tags) ? event.tags.join(", ") : event.tags || "",
                        }}
                        onSubmit={handleSubmit}
                        loading={saving}
                    />
                )}
            </div>
        </div>
    );



}
export default EditEvent;