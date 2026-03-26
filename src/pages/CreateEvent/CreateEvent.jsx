import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createEvent } from "../../services/eventService";
import EventForm from "../../components/events/EventForm";
import "./CreateEvent.css";

function CreateEvent() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {
        setLoading(true);
        try {
            const event = await createEvent(data, user.id);
            navigate(`/events/${event.id}`);
        } finally {
            setLoading(false);
        }
    };


}