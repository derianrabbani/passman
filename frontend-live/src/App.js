import React, { useEffect, useState } from "react";
import Axios from "axios";
import { AuthContextProvider } from "./context/AuthContext";
import Router from "./Router";

// CSS
import "./assets/styles/styles.css"

// Set Default Axios
Axios.defaults.withCredentials = true

export default function App() {

  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  )
}