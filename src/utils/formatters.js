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


export function formatTime(timeStr) {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
}

export function generateId(prefix = "id") {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
