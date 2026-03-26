import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createEvent } from "../../services/eventService";
import EventForm from "../../components/events/EventForm";
import "./CreateEvent.css";
