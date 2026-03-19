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