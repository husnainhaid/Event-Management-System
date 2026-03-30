export function formatDate(dateStr) {
    if (!dateStr) return "TBA";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IE", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function formatDateShort(dateStr) {
    if (!dateStr) return "TBA";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function formatDateTime(dateStr, timeStr) {
    return `${formatDate(dateStr)} at ${formatTime(timeStr)}`;
}

export function isUpcoming(dateStr) {
    if (!dateStr) return false;
    return new Date(dateStr) >= new Date();
}

export function formatPrice(price) {
    if (price === 0 || price === "0") return "Free";
    return `€${Number(price).toFixed(2)}`;
}

export function getAvailability(capacity, attendees) {
    const remaining = capacity - attendees;
    if (remaining <= 0) return { label: "Sold Out", pct: 100, color: "#ef4444" };
    if (remaining <= 10) return { label: `${remaining} left!`, pct: Math.round((attendees / capacity) * 100), color: "#f59e0b" };
    return { label: `${remaining} spots left`, pct: Math.round((attendees / capacity) * 100), color: "#10b981" };
}

export function truncate(str, len = 120) {
    if (!str) return "";
    return str.length > len ? str.slice(0, len).trim() + "…" : str;
}

export function slugify(str) {
    return str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export function generateId(prefix = "id") {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
