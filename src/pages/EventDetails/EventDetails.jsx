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


}