import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
function Footer() {
   const currentYear = new Date().getFullYear();
    return (
         <footer className="footer">
             <div className="footer__inner">

                <div className="footer__brand">
                    <Link to="/" className="footer__logo">⚡ EventPro</Link>
                    <p className="footer__tagline">
                        The modern platform for creating and managing
                        unforgettable events.
                    </p>
                </div>
                  <div className="footer__col">
                    <h4 className="footer__col-title">Platform</h4>
                    <Link to="/events" className="footer__link">Browse Events</Link>
                    <Link to="/create" className="footer__link">Create Event</Link>
                    <Link to="/bookings" className="footer__link">My Bookings</Link>
                </div>

                <div className="footer__col">
                    <h4 className="footer__col-title">Account</h4>
                    <Link to="/login" className="footer__link">Login</Link>
                    <Link to="/register" className="footer__link">Sign Up</Link>
                    <Link to="/dashboard" className="footer__link">Dashboard</Link>
                </div>

                <div className="footer__col">
                    <h4 className="footer__col-title">Connect</h4>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer__link">GitHub</a>
                    <a href="mailto:info@eventpro.com" className="footer__link">Contact Us</a>
                </div>

             </div>
         </footer>
    );

}

export default Footer;
