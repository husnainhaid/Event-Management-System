import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getEventById, updateEvent } from "../../services/eventService";
import EventForm from "../../components/events/EventForm";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";

function EditEvent() {

 const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

}
export default EditEvent;