import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
    return (
        <div className="notfound">
            <div className="notfound__orb notfound__orb--1" />
            <div className="notfound__orb notfound__orb--2" />

            <div className="notfound__content">
                <div className="notfound__code">
                    <span className="notfound__four">4</span>
                    <span className="notfound__zero">0</span>
                    <span className="notfound__four">4</span>
                </div>
                <h1 className="notfound__title">Page Not Found</h1>
                <p className="notfound__sub">
                    Looks like this page took the night off. It might have been moved,
                    deleted, or maybe it never existed in the first place.
                </p>
                <div className="notfound__actions">
                    <Link to="/" className="btn btn-primary">← Go Home</Link>
                    <Link to="/events" className="btn btn-outline">Browse Events</Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
