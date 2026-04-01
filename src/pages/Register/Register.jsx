import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Alert from "../../components/common/Alert";
import { validateEmail, validatePassword, getPasswordStrength } from "../../utils/validators";
import "../Login/Login.css";
import "./Register.css";

function Register() {

}

export default Register;