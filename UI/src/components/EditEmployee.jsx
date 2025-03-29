import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    title: "",
    department: "",
    currentStatus: true,
    firstName: "",
    lastName: "",
    age: "",
    dateOfJoining: "",
    employeeType: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch Employee Details
    const fetchEmployee = async () => {
      try {
        const response = await axios({
          method: "post",
          url: "http://localhost:8000/graphql",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            query: `
              query {
                getEmployees {
                  id
                  firstName
                  lastName
                  age
                  dateOfJoining
                  title
                  department
                  employeeType
                  currentStatus
                }
              }
            `,
          },
        });

        // Find the employee by ID
        const foundEmployee = response.data.data.getEmployees.find(
          (emp) => emp.id === id
        );

        // If employee not found, set error message
        if (foundEmployee) {
          setEmployee(foundEmployee);
        } else {
          setError("Employee not found");
        }
      } catch (err) {
        setError("Error fetching employee details");
      }
    };

    // call fetchEmployee function
    fetchEmployee();
  }, [id]);

  // Handle Input Changes for editable fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: name === "currentStatus" ? value === "true" : value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Update employee details
      const response = await axios.post("http://localhost:8000/graphql", {
        query: `
          mutation {
            updateEmployee(
              id: "${id}",
              title: "${employee.title}",
              department: "${employee.department}",
              currentStatus: ${employee.currentStatus}
            ) {
              id
              title
              department
              currentStatus
            }
          }
        `,
      });

      // Check for errors in the response
      if (response.data.errors) {
        setError("Failed to update employee");
      } else {
        Swal.fire({
          position: "center",
          title: "Employee Updated Successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => navigate("/employee-list"), 2000);
      }
    } catch (err) {
      setError("Error updating employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-employee-container">
      <h2>Edit Employee</h2>
      {/* Display error and success messages */}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="edit-employee-form">
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={employee.firstName}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={employee.lastName}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Age:</label>
          <input type="text" name="age" value={employee.age} disabled />
        </div>

        <div className="form-group">
          <label>Date of Joining:</label>
          <input
            type="text"
            name="dateOfJoining"
            value={
              employee.dateOfJoining
                ? moment(employee.dateOfJoining).format("MMMM DD, YYYY")
                : "N/A"
            }
            disabled
          />
        </div>

        <div className="form-group">
          <label>Employee Type:</label>
          <input
            type="text"
            name="employeeType"
            value={employee.employeeType}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Title:</label>
          <select name="title" value={employee.title} onChange={handleChange}>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
            <option value="VP">VP</option>
          </select>
        </div>

        <div className="form-group">
          <label>Department:</label>
          <select
            name="department"
            value={employee.department}
            onChange={handleChange}
          >
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select
            name="currentStatus"
            value={employee.currentStatus.toString()}
            onChange={handleChange}
          >
            <option value="true">Working</option>
            <option value="false">Retired</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Employee"}
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
