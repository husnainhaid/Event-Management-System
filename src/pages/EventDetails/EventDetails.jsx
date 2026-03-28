import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEventById } from "../../services/eventService";
import { bookEvent, cancelBooking, hasUserBooked } from "../../services/bookingService";
import { getWeatherForLocation } from "../../services/externalApiService";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
import { formatDate, formatTime, formatPrice, getAvailability } from "../../utils/formatters";
import { CATEGORIES } from "../../utils/constants";
import "./EventDetails.css";

function EventDetails() {
   const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alreadyBooked, setAlreadyBooked] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [weather, setWeather] = useState(null);
    const [alert, setAlert] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);
        
    useEffect(() => {
        async function load() {
            try {
                const evt = await getEventById(id);
                setEvent(evt);

                if (isAuthenticated && user) {
                    const { getUserBookings } = await import("../../services/bookingService");
                    const bookings = await getUserBookings(user.id);
                    const existing = bookings.find((b) => b.eventId === id && b.status === "confirmed");
                    if (existing) {
                        setAlreadyBooked(true);
                        setBookingId(existing.id);
                    }
                }

                // Load weather for the event location
                const wx = await getWeatherForLocation(evt.lat || 53.3498, evt.lng || -6.2603);
                setWeather(wx);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id, isAuthenticated, user]);
    
    const handleBook = async () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: { pathname: `/events/${id}` } } });
            return;
        }
        setBookingLoading(true);
        try {
            const booking = await bookEvent(event, user);

            setAlreadyBooked(true);
            setBookingId(booking.id);
            setAlert({ type: "success", message: "🎉 Booking confirmed! Check My Bookings to view it." });
        } catch (err) {
            setAlert({ type: "error", message: err.message });
        } finally {
            setBookingLoading(false);
        }
    };

}