import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

class EmployeeCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      age: "",
      dateOfJoining: "",
      title: "Employee",
      department: "IT",
      employeeType: "FullTime",
      errors: {},
      redirectToEmployeeList: false,
    };
  }

  // Handle input changes and update state
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  // Validate the form fields
  validateForm = () => {
    const { firstName, lastName, age, dateOfJoining } = this.state;
    let errors = {};
    let formIsValid = true;

    if (!firstName) {
      errors.firstName = "First Name is required.";
      formIsValid = false;
    } else if (/\d/.test(firstName)) {
      errors.firstName = "First Name cannot contain numbers.";
      formIsValid = false;
    }

    if (!lastName) {
      errors.lastName = "Last Name is required.";
      formIsValid = false;
    } else if (/\d/.test(lastName)) {
      errors.lastName = "Last Name cannot contain numbers.";
      formIsValid = false;
    }

    if (!age) {
      errors.age = "Age is required.";
      formIsValid = false;
    } else if (age < 20 || age > 70) {
      errors.age = "Age must be between 20 and 70.";
      formIsValid = false;
    }

    if (!dateOfJoining) {
      errors.dateOfJoining = "Date of Joining is required.";
      formIsValid = false;
    }

    this.setState({ errors });
    return formIsValid;
  };

  // Handle form submission
  handleSubmit = async (e) => {
    e.preventDefault();
    if (!this.validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
              mutation CreateEmployee(
                $firstName: String!
                $lastName: String!
                $age: Int!
                $dateOfJoining: Date!
                $title: String!
                $department: String!
                $employeeType: String!
              ) {
                createEmployee(
                  firstName: $firstName
                  lastName: $lastName
                  age: $age
                  dateOfJoining: $dateOfJoining
                  title: $title
                  department: $department
                  employeeType: $employeeType
                ) {
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
          variables: {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            age: parseInt(this.state.age),
            dateOfJoining: this.state.dateOfJoining,
            title: this.state.title,
            department: this.state.department,
            employeeType: this.state.employeeType,
          },
        }),
      });

      const result = await response.json();
      if (result.errors) {
        alert("Error creating employee");
        return;
      }

      // Display success message using SweetAlert2
      Swal.fire({
        title: "Success",
        text: "Employee created successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });

      // Reset the form fields
      this.setState({
        firstName: "",
        lastName: "",
        age: "",
        dateOfJoining: "",
        title: "Employee",
        department: "IT",
        employeeType: "FullTime",
      });

      // Redirect to the employee list after a delay
      setTimeout(() => this.setState({ redirectToEmployeeList: true }), 2000);
    } catch (error) {
      console.log("Error creating employees", error);
    }
  };

  render() {
    const {
      firstName,
      lastName,
      age,
      dateOfJoining,
      title,
      department,
      employeeType,
      errors,
      redirectToEmployeeList,
    } = this.state;

    if (redirectToEmployeeList) {
      return <Navigate to="/employee-list" />;
    }

    return (
      <div className="create-employee">
        <Container className="my-5">
          <h2 className="create-employee-heading">Add Employee</h2>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={this.handleChange}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <Form.Text className="error">
                      {errors.firstName}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={this.handleChange}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <Form.Text className="error">
                      {errors.lastName}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formAge">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={age}
                    onChange={this.handleChange}
                    placeholder="Enter age"
                  />
                  {errors.age && (
                    <Form.Text className="error">{errors.age}</Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formDateOfJoining">
                  <Form.Label>Date of Joining</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfJoining"
                    value={dateOfJoining}
                    onChange={this.handleChange}
                  />
                  {errors.dateOfJoining && (
                    <Form.Text className="error">
                      {errors.dateOfJoining}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Select
                    name="title"
                    value={title}
                    onChange={this.handleChange}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Director</option>
                    <option value="VP">VP</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDepartment">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    name="department"
                    value={department}
                    onChange={this.handleChange}
                  >
                    <option value="IT">IT</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                    <option value="Engineering">Engineering</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formEmployeeType">
                  <Form.Label>Employee Type</Form.Label>
                  <Form.Select
                    name="employeeType"
                    value={employeeType}
                    onChange={this.handleChange}
                  >
                    <option value="FullTime">FullTime</option>
                    <option value="PartTime">PartTime</option>
                    <option value="Contract">Contract</option>
                    <option value="Seasonal">Seasonal</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center mb-1">
              <Button type="submit" className="button">
                Add Employee
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    );
  }
}

export default EmployeeCreate;
