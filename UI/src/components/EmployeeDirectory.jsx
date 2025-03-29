import React, { Component } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import EmployeeSearch from "./EmployeeSearch.jsx";
import EmployeeTable from "./EmployeeTable.jsx";

// Helper hook to parse query params
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

class EmployeeDirectory extends Component {
  //Set initial state of the component
  state = {
    searchTerm: "",
    employees: [],
    loading: true,
    selectedEmployeeType: "All",
  };

  // Fetch employees when the component mounts
  componentDidMount() {
    this.fetchEmployees();
  }

  // Update the URL when the selected employee type changes
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

  // Fetch employees from the server using the GraphQL API
  fetchEmployees = async () => {
    const { selectedEmployeeType } = this.state;

    // Prepare the GraphQL query based on the selected employee type
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
      // Make a POST request to the GraphQL API
      const response = await axios.post("http://localhost:8000/graphql", {
        query,
      });

      // Extract the employee data from the response
      const result = await response.data;
      if (result.errors) {
        console.log("Error fetching employees", result.errors);
        return;
      }

      // Update the state with the fetched employees
      this.setState({
        employees: result.data.getEmployees || result.data.getEmployeesByType,
        loading: false,
      });
    } catch (error) {
      console.log("Error fetching employees", error);
      this.setState({ loading: false });
    }
  };

  // Method to handle search input
  handleSearch = (searchTerm) => {
    this.setState({ searchTerm });
  };

  // Method to handle employee type change
  handleEmployeeTypeChange = (e) => {
    this.setState({ selectedEmployeeType: e.target.value }, () => {
      this.fetchEmployees();
    });
  };

  // Method to handle employee deletion
  handleDeleteEmployee = async (id) => {
    // Find the employee to check currentStatus
    const employeeToDelete = this.state.employees.find(
      (employee) => employee.id === id
    );

    // Check if the employee's currentStatus is active
    if (employeeToDelete && employeeToDelete.currentStatus) {
      toast.error("Can't Delete Employee - Status Active", {
        position: "top-right",
        autoClose: 3000,
      });
      return; // Stop further execution if status is active
    }

    // Confirm deletion before proceeding
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // Make a POST request to the GraphQL API to delete the employee
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

        // Extract the response data from the response
        const result = response.data;
        if (result.errors) {
          toast.error("Error deleting employee", {
            position: "top-right",
            autoClose: 3000,
          });
          console.log("Error deleting employee", result.errors);
          return;
        }

        // Delete the employee from the state if the deletion was successful
        if (result.data.deleteEmployee.success) {
          Swal.fire({
            title: "Employee deleted successfully",
            icon: "success",
            draggable: true,
          });
          this.setState((prevState) => ({
            employees: prevState.employees.filter(
              (employee) => employee.id !== id
            ),
          }));
        } else {
          toast.error("Failed to delete employee", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.log("Error deleting employee", error);
        alert("Error deleting employee");
      }
    }
  };

  render() {
    // Destructure the state variables
    const { searchTerm, employees, loading, selectedEmployeeType } = this.state;

    // Filter the employees based on the search term
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

  return (
    <EmployeeDirectory
      navigate={navigate}
      selectedEmployeeType={selectedEmployeeType}
    />
  );
};

export default EmployeeDirectoryWithUrlFilter;
