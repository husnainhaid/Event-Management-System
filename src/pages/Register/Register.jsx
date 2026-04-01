import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Alert from "../../components/common/Alert";
import { validateEmail, validatePassword, getPasswordStrength } from "../../utils/validators";
import "../Login/Login.css";
import "./Register.css";

function Register() {
             const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const strength = getPasswordStrength(form.password);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
        if (fieldErrors[e.target.name]) setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Full name is required";
        const emailErr = validateEmail(form.email);
        if (emailErr) errs.email = emailErr;
        const passErr = validatePassword(form.password);
        if (passErr) errs.password = passErr;
        if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }

        setLoading(true);
        try {
            await register({ name: form.name, email: form.email, password: form.password });
            navigate("/");
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };
}

export default Register;