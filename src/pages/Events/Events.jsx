import React, { useState, useEffect, useCallback } from "react";
import { getEvents } from "../../services/eventService";
import EventCard from "../../components/events/EventCard";
import EventFilter from "../../components/events/EventFilter";
import Loader from "../../components/common/Loader";
import "./Events.css";

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("date");

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getEvents({ search, category, sort });
            setEvents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [search, category, sort]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return (
        <div className="events-page page">
            <div className="events-page__header">
                <h1 className="section-title">All Events</h1>
                <p className="section-sub">Discover {events.length} events happening across Ireland and beyond</p>
            </div>

            <EventFilter
                search={search}
                onSearch={setSearch}
                category={category}
                onCategory={setCategory}
                sort={sort}
                onSort={setSort}
            />

            {loading ? (
                <Loader fullScreen message="Loading events…" />
            ) : events.length === 0 ? (
                <div className="events-page__empty">
                    <p className="events-page__empty-icon">🔍</p>
                    <h3>No events found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            ) : (
                <div className="events-page__grid">
                    {events.map((evt) => (
                        <EventCard key={evt.id} event={evt} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Events;
