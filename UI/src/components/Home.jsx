import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Employee Management System</h1>
        <p className="hero-text">
          Efficiently manage your employees with our intuitive and powerful
          platform.
        </p>
        <Link to="/employee-list" >
          <p className="cta-button">View Employees</p>
        </Link>
      </div>

      <div className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Easy Management</h3>
            <p>
              Manage employee details in a few clicks with an intuitive
              interface.
            </p>
          </div>
          <div className="feature-card">
            <h3>Secure Data</h3>
            <p>
              Your employee records are protected with the highest security
              standards.
            </p>
          </div>
          <div className="feature-card">
            <h3>Valuable Insights</h3>
            <p>
              Gain insights into performance and attendance to make good
              decisions.
            </p>
          </div>
        </div>
      </div>

      <div className="testimonial">
        <h2>What Our Clients Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>
              "This platform has revolutionized how we manage our team. So easy
              to use!"
            </p>
            <h4>- John Doe, CEO</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "The data security is top-notch. I feel confident knowing our
              records are safe."
            </p>
            <h4>- Jane Smith, HR Manager</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
