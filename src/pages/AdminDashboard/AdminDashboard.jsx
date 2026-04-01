import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getEventStats, getUserEvents, deleteEvent } from "../../services/eventService";
import { getEventAttendees } from "../../services/bookingService";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
import { formatDateShort, formatPrice } from "../../utils/formatters";
import "./AdminDashboard.css";

function AdminDashboard() {
                    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    
    const [expandedEventId, setExpandedEventId] = useState(null);
    const [attendees, setAttendees] = useState([]); 
    const [attendeesLoading, setAttendeesLoading] = useState(false);

     const load = async () => {
        setLoading(true);
        try {
            const [s, evts] = await Promise.all([
                getEventStats(),
                getUserEvents(user.id),
            ]);
            setStats(s);
            setEvents(evts);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [user.id]); 

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEvent(id, user.id);
            setAlert({ type: "success", message: "Event deleted successfully." });
            if (expandedEventId === id) setExpandedEventId(null);
            await load();
        } catch (err) {
            setAlert({ type: "error", message: err.message });
        }
    };

    const handleToggleAttendees = async (eventId) => {
        
        if (expandedEventId === eventId) {
            setExpandedEventId(null);
            setAttendees([]);
            return;
        }
        setExpandedEventId(eventId);
        setAttendeesLoading(true);
        try {
            const data = await getEventAttendees(eventId);
            setAttendees(data);
        } catch (err) {
            console.error(err);
        } finally {
            setAttendeesLoading(false);
        }
    };
    const statCards = stats
        ? [
            { label: "Total Events", value: stats.totalEvents, emoji: "🎪", color: "var(--primary-light)" },
            { label: "Total Attendees", value: stats.totalAttendees.toLocaleString(), emoji: "👥", color: "var(--accent)" },
            { label: "Upcoming", value: stats.upcomingEvents, emoji: "📅", color: "#10b981" },
            { label: "Free Events", value: stats.freeEvents, emoji: "🎉", color: "#f59e0b" },
            { label: "Categories", value: stats.categories, emoji: "🗂️", color: "#8b5cf6" },
        ]
        : [];
        return(
                  <div className="dashboard page">
                    
                  </div>


        );

}