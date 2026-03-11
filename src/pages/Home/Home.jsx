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
      
    return (
           <div className="home">
               <section className="hero">
                 <div className="hero__bg" />    
                  <div className="hero__content">
                    <span className="hero__tag">🇮🇪 Ireland's Event Platform</span>
                    <h1 className="hero__title">
                        Discover &amp; Create<br />
                        <span className="hero__gradient">Unforgettable Events</span>
                    </h1>
                    <p className="hero__sub">
                        From tech conferences to music festivals — find the perfect event,
                        book your spot, and create memories that last a lifetime.
                    </p>
                    <div className="hero__actions">
                        <Link to="/events" className="btn btn-primary hero__btn">
                            🔍 Explore Events
                        </Link>
                        <Link to="/register" className="btn btn-outline hero__btn">
                            ✨ Get Started Free
                        </Link>
                    </div>

                    
                    {weather && (
                        <div className="hero__weather">
                            <span className="hero__weather-icon">{weather.icon}</span>
                            <div>
                                <p className="hero__weather-temp">{weather.temperature}{weather.unit} · {weather.condition}</p>
                                <p className="hero__weather-city">📍 Dublin, Ireland · Live weather via Open-Meteo API</p>
                            </div>
                            <div className="hero__weather-details">
                                <span>💨 {weather.windspeed} km/h</span>
                                <span>💧 {weather.humidity}%</span>
                            </div>
                        </div>
                    )}
                </div> 
               </section>
           
           </div>

      );

}

export default Home;