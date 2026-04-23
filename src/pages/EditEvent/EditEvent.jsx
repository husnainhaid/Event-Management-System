import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getEventById, updateEvent } from "../../services/eventService";
import EventForm from "../../components/events/EventForm";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
import "../CreateEvent/CreateEvent.css";

function EditEvent() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadEvent = async () => {
            try {
                const evt = await getEventById(id);

                const hostId =
                    typeof evt.host === "object" && evt.host !== null
                        ? evt.host._id
                        : evt.host;

                if (hostId !== user?.id) {
                    navigate("/events");
                    return;
                }

                setEvent(evt);
            } catch {
                navigate("/events");
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            loadEvent();
        }
    }, [id, user, navigate]);

    const handleSubmit = async (data) => {
        setSaving(true);
        setError("");

        try {
            await updateEvent(id, data);
            navigate(`/events/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to update event.");
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