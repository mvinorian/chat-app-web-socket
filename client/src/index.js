import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
const socket = new WebSocket("ws://localhost:8080/");

root.render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>
);
