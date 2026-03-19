import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);


    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        setMenuOpen(false);
        navigate("/");
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
            <div className="navbar__inner">
                <Link to="/" className="navbar__logo" onClick={closeMenu}>
                    <span className="navbar__logo-icon">⚡</span>
                    <span className="navbar__logo-text">EventPro</span>
                </Link>
                <nav className="navbar__links">
                    <NavLink to="/" className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`} end>
                        Home
                    </NavLink>
                    <NavLink to="/events" className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}>
                        Browse Events
                    </NavLink>
                    {isAuthenticated && (
                        <>
                            {user?.role === "admin" && (
                                <NavLink to="/create" className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}>
                                    + Create Event
                                </NavLink>
                            )}
                            <NavLink to="/bookings" className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}>
                                My Bookings
                            </NavLink>
                            {user?.role === "admin" && (
                                <NavLink to="/dashboard" className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}>
                                    Dashboard
                                </NavLink>
                            )}
                        </>
                    )}
                </nav>
                <div className="navbar__auth">
                    {isAuthenticated ? (
                        <div className="navbar__user" ref={dropdownRef}>
                            <button
                                className="navbar__avatar-btn"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                aria-label="User menu"
                            >  <img src={user?.avatar} alt={user?.name} className="navbar__avatar" />
                                <span className="navbar__username">{user?.name?.split(" ")[0]}</span>
                                <span className="navbar__chevron">{dropdownOpen ? "▲" : "▼"}</span>
                                
                                
                                </button>
                        </div>

                    ) : (
                        <div className="navbar__auth-buttons">


                        </div>
                    )}
                </div>




            </div>
        </header>


    );
}

export default Navbar;
