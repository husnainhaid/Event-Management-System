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