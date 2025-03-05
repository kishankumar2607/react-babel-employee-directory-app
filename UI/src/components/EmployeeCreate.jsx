
import React from "react";

//Class to create a new employee
export default class EmployeeCreate extends React.Component {
  //Initial state of the form fields
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
    };
  }

  // Handling changes in form inputs
  handleChange = (e) => {
    const { name, value } = e.target;
    // Dynamically update the form field based on its name
    this.setState({ [name]: value });
  };

  //Function to handle the form validation
  validateForm = () => {
    //Get the value of the form fields
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

    //Update the errors state
    this.setState({ errors });
    return formIsValid;
  };

  //Function to handle the form submission
  handleSubmit = async (e) => {
    e.preventDefault();

    //check if the form is valid
    if (!this.validateForm()) {
      return;
    }

    try {
      //Send a POST request to the GraphQL API with the employee data
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // GraphQL mutation to create a new employee
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
          //variable values for the mutation properties of the employee data
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

      //Get the response data from the GraphQL API
      const result = await response.json();
      if (result.errors) {
        alert("Error creating employee");
        return;
      }

      // Adding newly created employee to the parent component
      this.props.addEmployee(result.data.createEmployee);

      // Resetting form fields after successful submission
      this.setState({
        firstName: "",
        lastName: "",
        age: "",
        dateOfJoining: "",
        title: "Employee",
        department: "IT",
        employeeType: "FullTime",
      });
    } catch (error) {
      console.log("Error creating employees", error);
    }
  };

  render() {
    //Get the value of the form fields from the state
    const {
      firstName,
      lastName,
      age,
      dateOfJoining,
      title,
      department,
      employeeType,
      errors,
    } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Add Employee</h2>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={this.handleChange}
          />
          {errors.firstName && <div className="error">{errors.firstName}</div>}
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={this.handleChange}
          />
          {errors.lastName && <div className="error">{errors.lastName}</div>}
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={age}
            onChange={this.handleChange}
          />
          {errors.age && <div className="error">{errors.age}</div>}
        </div>
        <div>
          <label>Date of Joining:</label>
          <input
            type="date"
            name="dateOfJoining"
            value={dateOfJoining}
            onChange={this.handleChange}
          />
          {errors.dateOfJoining && (
            <div className="error">{errors.dateOfJoining}</div>
          )}
        </div>
        <div>
          <label>Title:</label>
          <select name="title" value={title} onChange={this.handleChange}>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
            <option value="VP">VP</option>
          </select>
        </div>
        <div>
          <label>Department:</label>
          <select
            name="department"
            value={department}
            onChange={this.handleChange}
          >
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
          </select>
        </div>
        <div>
          <label>Employee Type:</label>
          <select
            name="employeeType"
            value={employeeType}
            onChange={this.handleChange}
          >
            <option value="FullTime">FullTime</option>
            <option value="PartTime">PartTime</option>
            <option value="Contract">Contract</option>
            <option value="Seasonal">Seasonal</option>
          </select>
        </div>
        <button type="submit">Add Employee</button>
      </form>
    );
  }
}
