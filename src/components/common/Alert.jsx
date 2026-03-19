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