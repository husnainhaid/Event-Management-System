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

            
                <div className="hero__orb hero__orb--1" />
                <div className="hero__orb hero__orb--2" />
                <div className="hero__orb hero__orb--3" />
            </section>

            
            <section className="home__stats">
                {stats.map((s) => (
                    <div key={s.label} className="home__stat-card">
                        <span className="home__stat-emoji">{s.emoji}</span>
                        <p className="home__stat-value">{s.value}</p>
                        <p className="home__stat-label">{s.label}</p>
                    </div>
                ))}
            </section>

           
            <section className="home__section page">
                <div className="home__section-header">
                    <div>
                        <h2 className="section-title">⭐ Featured Events</h2>
                        <p className="section-sub">Hand-picked events happening near you</p>
                    </div>
                    <Link to="/events" className="btn btn-outline">View All →</Link>
                </div>

                {loading ? (
                    <Loader fullScreen message="Loading events…" />
                ) : (
                    <div className="home__grid">
                        {featured.map((evt) => (
                            <EventCard key={evt.id} event={evt} />
                        ))}
                    </div>
                )}
            </section>

          
            {tmEvents.length > 0 && (
                <section className="home__section home__tm page">
                    <div className="home__section-header">
                        <div>
                            <h2 className="section-title">🎟️ Live Events Near Dublin</h2>
                            <p className="section-sub">Powered by Ticketmaster Discovery API</p>
                        </div>
                    </div>
                    <div className="home__tm-grid">
                        {tmEvents.map((ev) => (
                            <a
                                key={ev.id}
                                href={ev.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="home__tm-card"
                            >
                                {ev.image && (
                                    <img src={ev.image} alt={ev.name} className="home__tm-img" loading="lazy" />
                                )}
                                <div className="home__tm-body">
                                    <p className="home__tm-name">{ev.name}</p>
                                    <p className="home__tm-meta">📅 {ev.date} · {ev.venue}</p>
                                    <p className="home__tm-price badge badge-accent">{ev.priceRange}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            )}

           
            <section className="home__cta">
                <div className="home__cta-inner">
                    <h2>Ready to host your own event?</h2>
                    <p>Create, manage, and promote your event for free — it only takes a minute.</p>
                    <Link to="/register" className="btn btn-primary">
                        🚀 Create Your Event
                    </Link>
                </div>
            </section>
        </div>
    );
    }


export default Home;