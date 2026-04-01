import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getEventById, updateEvent } from "../../services/eventService";
import EventForm from "../../components/events/EventForm";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
