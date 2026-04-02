import React from "react";
import { Link } from "react-router-dom";
import { formatDate, formatPrice, getAvailability, truncate } from "../../utils/formatters";
import { CATEGORIES } from "../../utils/constants";

function EventCard({ event }) {
    if (!event) return null;
    const avail = getAvailability(event.capacity, event.attendees);
    const catObj = CATEGORIES.find((c) => c.value === event.category);
    return (
        <div className="event-card">
            <Link to={`/events/${event.id}`} className="event-card__img-wrap">
                <img
                    src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80"}
                    alt={event.title}
                    className="event-card__img"
                    loading="lazy"
                />
                {event.isFeatured && <span className="event-card__badge">⭐ Featured</span>}
                <span className="event-card__category">{catObj?.emoji} {catObj?.label}</span>
            </Link>
            <div className="event-card__body">
                <h3 className="event-card__title"><Link to={`/events/${event.id}`}>{event.title}</Link></h3>
                <p className="event-card__desc">{truncate(event.description, 100)}</p>
                <div className="event-card__meta">
                    <span className="event-card__meta-item">📅 {formatDate(event.date)}</span>
                    <span className="event-card__meta-item">📍 {event.city}</span>
                </div>
                <div className="event-card__capacity-bar">
                    <div className="event-card__capacity-fill" style={{ width: `${Math.min(avail.pct, 100)}%`, background: avail.color }} />
                </div>
                <p className="event-card__avail" style={{ color: avail.color }}>{avail.label}</p>
                <div className="event-card__footer">
                    <span className="event-card__price">{formatPrice(event.price)}</span>
                    <Link to={`/events/${event.id}`} className="btn btn-primary event-card__btn">View Details</Link>
                </div>
            </div>
        </div>
    );
}

export default EventCard;
