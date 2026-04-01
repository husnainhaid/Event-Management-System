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
}