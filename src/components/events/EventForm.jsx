import React, { useState } from "react";
import Alert from "../common/Alert";
import { CATEGORIES } from "../../utils/constants";
import { validateEventForm } from "../../utils/validators";

const EMPTY_FORM = {
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    city: "",
    country: "Ireland",
    price: 0,
    capacity: 50,
    image: "",
    tags: "",
};


function Field({ label, name, type = "text", placeholder = "", min, step, form, errors, onChange }) {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                value={form[name]}
                onChange={onChange}
                placeholder={placeholder}
                min={min}
                step={step}
                aria-invalid={!!errors[name]}
            />
            {errors[name] && <span className="form-error">{errors[name]}</span>}
        </div>
    );
}

function EventForm({ initialData = {}, onSubmit, loading = false }) {
    const [form, setForm] = useState({ ...EMPTY_FORM, ...initialData });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
       
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");
        const errs = validateEventForm(form);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        try {
            await onSubmit({
                ...form,
                price: Number(form.price) || 0,
                capacity: Number(form.capacity) || 50,
                tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
            });
        } catch (err) {
            setSubmitError(err.message || "Something went wrong. Please try again.");
        }
    };
}
