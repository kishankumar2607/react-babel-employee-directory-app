
import React from "react";
import * as ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import NavPage from './NavPage.jsx';
import Footer from "./Footer.jsx";

const element = (
    <Router>
        <NavPage />
        <Footer />
    </Router>
);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(element);
