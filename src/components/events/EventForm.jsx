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

