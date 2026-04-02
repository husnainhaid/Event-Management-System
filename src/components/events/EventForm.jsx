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

      return (
        <form className="event-form" onSubmit={handleSubmit} noValidate>
            {submitError && <Alert type="error" message={submitError} onClose={() => setSubmitError("")} />}

            <div className="event-form__grid">
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <Field label="Event Title *" name="title" placeholder="e.g. Dublin Tech Summit 2026" form={form} errors={errors} onChange={handleChange} />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe your event in detail…"
                        rows={5}
                        aria-invalid={!!errors.description}
                    />
                    {errors.description && <span className="form-error">{errors.description}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select id="category" name="category" value={form.category} onChange={handleChange} aria-invalid={!!errors.category}>
                        <option value="">Select a category…</option>
                        {CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.emoji} {c.label}
                            </option>
                        ))}
                    </select>
                    {errors.category && <span className="form-error">{errors.category}</span>}
                </div>

                <Field label="Date *" name="date" type="date" form={form} errors={errors} onChange={handleChange} />
                <Field label="Time *" name="time" type="time" form={form} errors={errors} onChange={handleChange} />
                <Field label="Venue / Address *" name="location" placeholder="e.g. Convention Centre Dublin" form={form} errors={errors} onChange={handleChange} />
                <Field label="City *" name="city" placeholder="e.g. Dublin" form={form} errors={errors} onChange={handleChange} />
                <Field label="Country" name="country" placeholder="e.g. Ireland" form={form} errors={errors} onChange={handleChange} />
                <Field label="Price (€)" name="price" type="number" min="0" step="0.01" placeholder="0 for Free" form={form} errors={errors} onChange={handleChange} />
                <Field label="Capacity *" name="capacity" type="number" min="1" placeholder="e.g. 200" form={form} errors={errors} onChange={handleChange} />
                <Field label="Image URL" name="image" placeholder="https://images.unsplash.com/…" form={form} errors={errors} onChange={handleChange} />

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="tags">Tags (comma-separated)</label>
                    <input
                        id="tags"
                        name="tags"
                        type="text"
                        value={form.tags}
                        onChange={handleChange}
                        placeholder="e.g. Technology, AI, Networking"
                    />
                </div>
            </div>

            <div className="event-form__preview">
                {form.image && (
                    <div>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8 }}>Image Preview</p>
                        <img
                            src={form.image}
                            alt="Event preview"
                            style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}
                            onError={(e) => { e.target.style.display = "none"; }}
                        />
                    </div>
                )}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={loading}>
                {loading ? "Saving…" : initialData.id ? "💾 Update Event" : "🚀 Create Event"}
            </button>
        </form>
    );
}
