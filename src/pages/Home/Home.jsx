import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFeaturedEvents } from "../../services/eventService";
import { getWeatherForLocation, getTicketmasterEvents } from "../../services/externalApiService";
import EventCard from "../../components/events/EventCard";
import Loader from "../../components/common/Loader";
import "./Home.css";

function Home(){
    const [featured, setFeatured] = useState([]);
    const [weather, setWeather] = useState([]);
    const [tmEvents, setTmEvents] = useState([]);
    const [loading, setLoading] = useState(true);
}

useEffect(() => {
        async function loadData() {
            try {
                const [evts, wx, tm] = await Promise.all([
                    getFeaturedEvents(),
                    getWeatherForLocation(53.3498, -6.2603), 
                    getTicketmasterEvents("Dublin", 4),
                ]);
                setFeatured(evts);
                setWeather(wx);
                setTmEvents(tm);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const stats = [
        { value: "500+", label: "Events Listed", emoji: "🎪" },
        { value: "20K+", label: "Happy Attendees", emoji: "😊" },
        { value: "50+", label: "Cities Covered", emoji: "🌍" },
        { value: "100%", label: "Free to Use", emoji: "🎉" },
    ];


export default Home;