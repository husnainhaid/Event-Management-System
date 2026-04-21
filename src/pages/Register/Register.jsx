import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Alert from "../../components/common/Alert";
import {
  validateEmail,
  validatePassword,
  getPasswordStrength,
} from "../../utils/validators";
import "../Login/Login.css";
import "./Register.css";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("attendee");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const strength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) errs.name = "Full name is required";

    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;

    const passErr = validatePassword(form.password);
    if (passErr) errs.password = passErr;

    if (!form.confirm.trim()) {
      errs.confirm = "Please confirm your password";
    } else if (form.password !== form.confirm) {
      errs.confirm = "Passwords do not match";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: accountType,
      });
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div
          className={`auth-card__top ${
            accountType === "host" ? "auth-card__top--host" : ""
          }`}
        />

        <div className="auth-role-selector">
          <button
            type="button"
            className={`auth-role-btn ${
              accountType === "attendee" ? "auth-role-btn--active" : ""
            }`}
            onClick={() => {
              setAccountType("attendee");
              setError("");
            }}
          >
            Attendee Sign Up
          </button>

          <button
            type="button"
            className={`auth-role-btn auth-role-btn--host ${
              accountType === "host"
                ? "auth-role-btn--active auth-role-btn--host-active"
                : ""
            }`}
            onClick={() => {
              setAccountType("host");
              setError("");
            }}
          >
            Host Sign Up
          </button>
        </div>

        <div className="auth-card__header">
          <span className="auth-card__icon">🚀</span>
          <h1 className="auth-card__title">
            {accountType === "host"
              ? "Create your host account"
              : "Create your account"}
          </h1>
          <p className="auth-card__sub">
            {accountType === "host"
              ? "Start hosting and managing events on EventPro"
              : "Join thousands of event-goers on EventPro"}
          </p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label htmlFor="name">
              {accountType === "host" ? "Host / Organizer Name" : "Full Name"}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder={
                accountType === "host" ? "Your brand or full name" : "John Smith"
              }
              autoComplete="name"
            />
            {fieldErrors.name && (
              <span className="form-error">{fieldErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {fieldErrors.email && (
              <span className="form-error">{fieldErrors.email}</span>
            )}
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
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                autoComplete="new-password"
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

            {form.password && (
              <div className="auth-form__strength">
                <div className="auth-form__strength-bar">
                  <div
                    className="auth-form__strength-fill"
                    style={{
                      width: `${(strength.score / 5) * 100}%`,
                      background: strength.color,
                    }}
                  />
                </div>
                <span
                  className="auth-form__strength-label"
                  style={{ color: strength.color }}
                >
                  Strength: {strength.label}
                </span>
              </div>
            )}

            {fieldErrors.password && (
              <span className="form-error">{fieldErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
            {fieldErrors.confirm && (
              <span className="form-error">{fieldErrors.confirm}</span>
            )}
          </div>

          <div className="register__terms">
            <p>
              By registering, you agree to EventPro's{" "}
              <span style={{ color: "var(--primary-light)" }}>
                Terms of Service
              </span>{" "}
              and{" "}
              <span style={{ color: "var(--primary-light)" }}>
                Privacy Policy
              </span>
              .
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading
              ? "Creating account…"
              : accountType === "host"
              ? "Create Host Account →"
              : "Create Account →"}
          </button>
        </form>

        <p className="auth-card__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;