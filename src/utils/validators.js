export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!re.test(email)) return "Enter a valid email address";
    return null;
}

export function validatePassword(password) {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter";
    if (!/[0-9]/.test(password)) return "Include at least one number";
    return null;
}

export function validateRequired(value, fieldName = "This field") {
    if (!value || String(value).trim() === "") return `${fieldName} is required`;
    return null;
}

export function validateFutureDate(dateStr) {
    if (!dateStr) return "Date is required";
    const d = new Date(dateStr);
    if (isNaN(d)) return "Enter a valid date";
    if (d < new Date()) return "Date must be in the future";
    return null;
}

export function validatePositiveNumber(val, fieldName = "Value") {
    const n = Number(val);
    if (isNaN(n) || n < 0) return `${fieldName} must be a positive number`;
    return null;
}
export function validateEventForm(data) {
    const errors = {};
    const r = (v, n) => validateRequired(v, n);
    if (r(data.title, "Title")) errors.title = r(data.title, "Title");
    if (r(data.description, "Description")) errors.description = r(data.description, "Description");
    if (r(data.location, "Location")) errors.location = r(data.location, "Location");
    if (r(data.category, "Category")) errors.category = r(data.category, "Category");
    const dateErr = validateFutureDate(data.date);
    if (dateErr) errors.date = dateErr;
    if (r(data.time, "Time")) errors.time = r(data.time, "Time");
    const capErr = validatePositiveNumber(data.capacity, "Capacity");
    if (capErr) errors.capacity = capErr;
    if (!data.capacity || Number(data.capacity) < 1) errors.capacity = "Capacity must be at least 1";
    return errors;
}

export function getPasswordStrength(password) {
    let score = 0;
    if (!password) return { score: 0, label: "", color: "" };
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
    if (score <= 3) return { score, label: "Fair", color: "#f59e0b" };
    if (score === 4) return { score, label: "Strong", color: "#10b981" };
    return { score, label: "Very Strong", color: "#06b6d4" };
}
