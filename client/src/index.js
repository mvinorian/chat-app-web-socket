import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
const WS_URL = "ws://localhost:8080/";
const socket = new WebSocket(WS_URL);

root.render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>
);
