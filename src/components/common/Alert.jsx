import React, { useEffect } from "react";

const ICONS = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
};

const COLORS = {
    success: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", color: "#10b981" },
    error: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", color: "#ef4444" },
    warning: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", color: "#f59e0b" },
    info: { bg: "rgba(79,70,229,0.12)", border: "rgba(79,70,229,0.3)", color: "var(--primary-light)" },
};

function Alert({ type = "info", message, onClose, autoClose = 0 }) {
const { bg, border, color } = COLORS[type] || COLORS.info;

    useEffect(() => {
        if (autoClose > 0 && onClose) {
            const t = setTimeout(onClose, autoClose);
            return () => clearTimeout(t);
        }
    }, [autoClose, onClose]);

    if (!message) return null;

    return (
             <div
            role="alert"
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "14px 18px",
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: "var(--radius)",
                color,
                fontSize: "0.9rem",
                marginBottom: 16,
                animation: "fadeSlide 0.3s ease",
            }}
        ></div>
    );



}