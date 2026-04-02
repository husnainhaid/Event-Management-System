import React from "react";
import { Link } from "react-router-dom";
import { formatDateShort, formatTime, formatPrice, getAvailability, truncate } from "../../utils/formatters";
import { CATEGORIES } from "../../utils/constants";
import "./EventCard.css";

function EventCard({ event }) {
    if (!event) return null;
   
 const { id, title, description, image, date, time, location, city, category, price, capacity, attendees } = event;
    const avail = getAvailability(capacity, attendees);
    const catObj = CATEGORIES.find((c) => c.value === category);
    const catEmoji = catObj?.emoji || "🎪";
    const catLabel = catObj?.label || category;

    return (
        <Link to={`/events/${id}`} className="event-card" aria-label={`View details for ${title}`}>
           
            <div className="event-card__img-wrap">
                <img
                    src={image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80"}
                    alt={title}
                    className="event-card__img"
                    loading="lazy"
                />
                <div className="event-card__overlay" />
               
                <span className="event-card__cat badge badge-primary">
                    {catEmoji} {catLabel}
                </span>
               
                <span className={`event-card__price ${price === 0 ? "event-card__price--free" : ""}`}>
                    {formatPrice(price)}
                </span>
            </div>

          
            <div className="event-card__body">
                <h3 className="event-card__title">{title}</h3>
                <p className="event-card__desc">{truncate(description, 90)}</p>

                <div className="event-card__meta">
                    <span className="event-card__meta-item">
                        📅 {formatDateShort(date)} {time && `· ${formatTime(time)}`}
                    </span>
                    <span className="event-card__meta-item">📍 {city || location}</span>
                </div>

                
                <div className="event-card__capacity">
                    <div className="event-card__capacity-bar">
                        <div
                            className="event-card__capacity-fill"
                            style={{ width: `${Math.min(avail.pct, 100)}%`, background: avail.color }}
                        />
                    </div>
                    <span className="event-card__capacity-label" style={{ color: avail.color }}>
                        {avail.label}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default EventCard;
