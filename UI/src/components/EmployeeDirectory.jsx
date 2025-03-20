import React, { Component } from "react";
import axios from "axios";
import EmployeeSearch from "./EmployeeSearch.jsx";
import EmployeeTable from "./EmployeeTable.jsx";

export default class EmployeeDirectory extends Component {
  state = {
    searchTerm: "",
    employees: [],
    loading: true, // Add loading state
  };

  componentDidMount() {
    this.fetchEmployees();
  }

  fetchEmployees = async () => {
    try {
      const response = await axios.post("http://localhost:8000/graphql", {
        query: `
          {
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
      });

      const result = await response.data;
      if (result.errors) {
        console.log("Error fetching employees", result.errors);
        return;
      }

      this.setState({ employees: result.data.getEmployees, loading: false }); // Set loading to false after fetching
    } catch (error) {
      console.log("Error fetching employees", error);
      this.setState({ loading: false }); // Set loading to false if error occurs
    }
  };

  handleSearch = (searchTerm) => {
    this.setState({ searchTerm });
  };

  handleDeleteEmployee = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.post("http://localhost:8000/graphql", {
        query: `
          mutation {
            deleteEmployee(id: "${id}") {
              success
              message
            }
          }
        `,
      });

      const result = response.data;
      if (result.errors) {
        console.log("Error deleting employee", result.errors);
        return;
      }

      if (result.data.deleteEmployee.success) {
        alert("Employee deleted successfully");
        this.setState((prevState) => ({
          employees: prevState.employees.filter((employee) => employee.id !== id),
        }));
      } else {
        alert("Failed to delete employee");
      }
    } catch (error) {
      console.log("Error deleting employee", error);
      alert("Error deleting employee");
    }
  };

  render() {
    const { searchTerm, employees, loading } = this.state;

    let filteredEmployees = employees.filter((employee) =>
      Object.values(employee).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return (
      <div className="container">
        <h1 className="employee-directory">Employee Directory</h1>
        <div className="filter-search">
          <EmployeeSearch setSearchTerm={this.handleSearch} />
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <EmployeeTable
            employees={filteredEmployees}
            onDeleteEmployee={this.handleDeleteEmployee}
          />
        )}
      </div>
    );
  }
}
