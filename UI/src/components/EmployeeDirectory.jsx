import React, { Component } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import EmployeeSearch from "./EmployeeSearch.jsx";
import EmployeeTable from "./EmployeeTable.jsx";

// Helper hook to parse query params
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

class EmployeeDirectory extends Component {
  state = {
    searchTerm: "",
    employees: [],
    loading: true,
    selectedEmployeeType: "All",
  };

  componentDidMount() {
    this.fetchEmployees();
  }

  componentDidUpdate(prevProps, prevState) {
    // If the selected employee type changes, update the URL
    if (prevState.selectedEmployeeType !== this.state.selectedEmployeeType) {
      this.updateUrlWithEmployeeType();
    }
  }

  // Method to update the URL with the selected employee type
  updateUrlWithEmployeeType = () => {
    const { selectedEmployeeType } = this.state;
    this.props.navigate(`?employeeType=${selectedEmployeeType}`);
  };

  fetchEmployees = async () => {
    const { selectedEmployeeType } = this.state;

    let query = `
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
    `;

    // If a specific employee type is selected, modify the query to filter by employee type
    if (selectedEmployeeType !== "All") {
      query = `
        {
          getEmployeesByType(employeeType: "${selectedEmployeeType}") {
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
      `;
    }

    try {
      const response = await axios.post("http://localhost:8000/graphql", {
        query,
      });
      const result = await response.data;
      if (result.errors) {
        console.log("Error fetching employees", result.errors);
        return;
      }

      this.setState({
        employees: result.data.getEmployees || result.data.getEmployeesByType,
        loading: false,
      });
    } catch (error) {
      console.log("Error fetching employees", error);
      this.setState({ loading: false });
    }
  };

  handleSearch = (searchTerm) => {
    this.setState({ searchTerm });
  };

  handleEmployeeTypeChange = (e) => {
    this.setState({ selectedEmployeeType: e.target.value }, () => {
      this.fetchEmployees();
    });
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
          employees: prevState.employees.filter(
            (employee) => employee.id !== id
          ),
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
    const { searchTerm, employees, loading, selectedEmployeeType } = this.state;

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
          <div>
            <select
              value={selectedEmployeeType}
              onChange={this.handleEmployeeTypeChange}
            >
              <option value="All">All Employees</option>
              <option value="FullTime">Full-Time Employees</option>
              <option value="PartTime">Part-Time Employees</option>
              <option value="Contract">Contract Employees</option>
              <option value="Seasonal">Seasonal Employees</option>
            </select>
          </div>
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

// Wrapper to include the useLocation and useNavigate hooks for URL management
const EmployeeDirectoryWithUrlFilter = () => {
  const query = useQuery();
  const selectedEmployeeType = query.get("employeeType") || "All";
  const navigate = useNavigate();

  return <EmployeeDirectory navigate={navigate} selectedEmployeeType={selectedEmployeeType} />;
};

export default EmployeeDirectoryWithUrlFilter;
