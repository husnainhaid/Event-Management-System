
import { STORAGE_KEYS } from "../utils/constants";
import { generateId } from "../utils/formatters";

function seedDemoUser() {
    const users = loadRaw();
    const exists = users.find((u) => u.email === "demo@eventpro.com");
    if (!exists) {
        users.push({
            id: "user-admin",
            name: "Demo User",
            email: "demo@eventpro.com",
            password: "Demo1234",
            role: "admin",
            avatar: "https://ui-avatars.com/api/?name=Demo+User&background=4f46e5&color=fff&size=128",
            createdAt: "2026-01-01T00:00:00Z",
        });
        localStorage.setItem("ep_user_registry", JSON.stringify(users));
    }
}
function loadRaw() {
    const raw = localStorage.getItem("ep_user_registry");
    return raw ? JSON.parse(raw) : [];
}
seedDemoUser();
function getUserRegistry() {
    return loadRaw();
}

function saveUserRegistry(users) {
    localStorage.setItem("ep_user_registry", JSON.stringify(users));
}

