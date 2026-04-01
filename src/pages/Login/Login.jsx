import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Alert from "../../components/common/Alert";
import { validateEmail } from "../../utils/validators";
import "./Login.css";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailErr = validateEmail(form.email);
        if (emailErr) { setError(emailErr); return; }
        if (!form.password) { setError("Password is required"); return; }

        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card card">
                {/* Decorative top bar */}
                <div className="auth-card__top" />

                <div className="auth-card__header">
                    <span className="auth-card__icon">⚡</span>
                    <h1 className="auth-card__title">Welcome back</h1>
                    <p className="auth-card__sub">Log in to your EventPro account</p>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError("")} />}

                <form onSubmit={handleSubmit} noValidate className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="auth-form__pass-wrap">
                            <input
                                id="password"
                                name="password"
                                type={showPass ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="auth-form__pass-toggle"
                                onClick={() => setShowPass((p) => !p)}
                                aria-label="Toggle password visibility"
                            >
                                {showPass ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                        {loading ? "Logging in…" : "Log In →"}
                    </button>
                </form>

              
                <div className="auth-card__demo">
                    <p>🧪 <strong>Demo:</strong> Register any account to get started</p>
                </div>

                <p className="auth-card__switch">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Sign up free
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
