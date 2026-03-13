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
             </div>
         </footer>
    );

}

