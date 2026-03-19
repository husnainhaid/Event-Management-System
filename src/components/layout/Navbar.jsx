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
                                          {dropdownOpen && (
                                <div className="navbar__dropdown">
                                    <div className="navbar__dropdown-header">
                                        <img src={user?.avatar} alt={user?.name} />
                                        <div>
                                            <p className="navbar__dropdown-name">{user?.name}</p>
                                            <p className="navbar__dropdown-email">{user?.email}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <Link to="/bookings" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        📋 My Bookings
                                    </Link>
                                    <Link to="/dashboard" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        📊 Dashboard
                                    </Link>
                                    <hr />
                                    <button className="navbar__dropdown-item navbar__dropdown-logout" onClick={handleLogout}>
                                        🚪 Log Out
                                    </button>
                                </div>
                            )}

                        </div>

                    ) : (
                        <div className="navbar__auth-buttons">
                            <Link to="/login" className="btn btn-outline navbar__btn-sm">
                                Log In
                            </Link>
                            <Link to="/register" className="btn btn-primary navbar__btn-sm">
                                Sign Up
                            </Link>

                        </div>
                    )}
                </div>
                <button
                    className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    <span />
                    <span />
                    <span />
                </button>



            </div>
             <div className={`navbar__mobile ${menuOpen ? "navbar__mobile--open" : ""}`}>
                <NavLink to="/" className="navbar__mobile-link" onClick={closeMenu} end>Home</NavLink>
                <NavLink to="/events" className="navbar__mobile-link" onClick={closeMenu}>Browse Events</NavLink>
                {isAuthenticated ? (
                    <>
                        {user?.role === "admin" && (
                            <NavLink to="/create" className="navbar__mobile-link" onClick={closeMenu}>+ Create Event</NavLink>
                        )}
                        <NavLink to="/bookings" className="navbar__mobile-link" onClick={closeMenu}>My Bookings</NavLink>
                        {user?.role === "admin" && (
                            <NavLink to="/dashboard" className="navbar__mobile-link" onClick={closeMenu}>Dashboard</NavLink>
                        )}
                        <hr className="navbar__mobile-divider" />
                        <div className="navbar__mobile-user">
                            <img src={user?.avatar} alt={user?.name} className="navbar__avatar" />
                            <span>{user?.name}</span>
                        </div>
                        <button className="navbar__mobile-link navbar__mobile-logout" onClick={handleLogout}>
                            🚪 Log Out
                        </button>
                    </>
                ) : (
                    <div className="navbar__mobile-auth">
                        <Link to="/login" className="btn btn-outline" onClick={closeMenu}>Log In</Link>
                        <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Sign Up</Link>
                    </div>
                )}
            </div>

        </header>


    );
}

export default Navbar;
