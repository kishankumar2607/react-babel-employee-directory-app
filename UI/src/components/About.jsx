import React from "react";

const About = () => {
  return (
    <div className="about-container">
      <div className="hero-section">
        <h1>About Us</h1>
        <p>
          Learn more about our mission, values, and the team behind our success.
        </p>
      </div>

      <div className="section">
        <h2>Who We Are</h2>
        <p>
          We are a team of professionals dedicated to providing efficient
          employee management solutions. Our platform helps businesses
          streamline operations, track employee performance, and manage records
          seamlessly.
        </p>
      </div>

      <div className="section mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to empower businesses with a robust and intuitive
          employee management system that enhances productivity, ensures data
          security, and improves decision-making.
        </p>
      </div>

      <div className="section contact">
        <h2>Contact Us</h2>
        <p>Email: support@employeemanagementapp.com</p>
        <p>Phone: +1 (123) 456-7890</p>
        <p>Address: 123 Business Lane, Toronto, Canada</p>
      </div>
    </div>
  );
};

export default About;
