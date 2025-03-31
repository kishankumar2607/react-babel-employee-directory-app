import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import EmployeeDirectory from "./EmployeeDirectory.jsx";
import EmployeeCreate from "./EmployeeCreate.jsx";
import PageNotFound from "./PageNotFound.jsx";
import About from "./About.jsx";
import EmployeeDetails from "./EmployeeDetails.jsx";
import EmployeeEdit from "./EmployeeEdit.jsx";
import { Container } from "react-bootstrap";

const NavPage = () => {
  return (
    <div>
      <div className="navbar-container">
        <Container>
          <nav className="navbar">
            <h1 className="logo">Employee App</h1>
            <ul className="nav-links">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/employee-list"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Employee List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/employee-create"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Create Employee
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  About
                </NavLink>
              </li>
            </ul>
          </nav>
        </Container>
      </div>

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employee-list" element={<EmployeeDirectory />} />
          <Route path="/employee-create" element={<EmployeeCreate />} />
          <Route path="/employee/:id" element={<EmployeeDetails />} />
          <Route path="/edit-employee/:id" element={<EmployeeEdit />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default NavPage;
