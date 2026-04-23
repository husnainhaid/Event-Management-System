import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./EventCard.css";

function EventCard({
  event,
  showActions = false,
  onEdit,
  onDelete,
  deleting = false,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isHost = user?.role === "host";

  const handleView = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <article className="event-card card">
      <div className="event-card__media" onClick={handleView}>
        <img
          src={
            event.image ||
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=60"
          }
          alt={event.title}
          className="event-card__image"
        />
      </div>

      <div className="event-card__body">
        <div className="event-card__main" onClick={handleView}>
          <h3 className="event-card__title">{event.title}</h3>

          <p className="event-card__meta">
            📅 {event.date} • ⏰ {event.time}
          </p>

          <p className="event-card__meta">
            📍 {event.venue}, {event.city}
          </p>

          <p className="event-card__price">
            {Number(event.price) === 0 ? "Free" : `€${event.price}`}
          </p>
        </div>

        {showActions && isHost && (
          <div className="event-card__actions">
            <button
              type="button"
              className="event-card__action event-card__action--edit"
              onClick={() => onEdit?.(event._id)}
            >
              Edit
            </button>

            <button
              type="button"
              className="event-card__action event-card__action--delete"
              onClick={() => onDelete?.(event._id)}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default EventCard;