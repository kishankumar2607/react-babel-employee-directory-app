import React, { Component } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { ThreeCircles } from "react-loader-spinner";
import { Container } from "react-bootstrap";
import EmployeeSearch from "./EmployeeSearch.jsx";
import EmployeeTable from "./EmployeeTable.jsx";

// Helper hook to parse query params
const useQuery = () => new URLSearchParams(useLocation().search);

class EmployeeDirectory extends Component {
  // Initial state of the search term, employees, loading status, primary filter, and secondary filter.
  state = {
    searchTerm: "",
    employees: [],
    loading: true,
    selectedEmployeeType: "All",
  };

  // Fetch employees when component mounts
  componentDidMount() {
    this.fetchEmployees();
  }

  // Fetch employees when primary filter changes and update URL with the selected employee type.
  componentDidUpdate(prevProps, prevState) {
    // Update URL when primary filter changes.
    if (prevState.selectedEmployeeType !== this.state.selectedEmployeeType) {
      this.updateUrlWithEmployeeType();
    }
  }

  // Update URL when secondary filter changes and update the state.
  updateUrlWithEmployeeType = () => {
    const { selectedEmployeeType } = this.state;
    this.props.navigate(`?employeeType=${selectedEmployeeType}`);
  };

  // Fetch employees using GraphQL
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

    // If a specific employee type (other than UpcomingRetirement) is selected, use that query.
    if (selectedEmployeeType !== "All" && selectedEmployeeType !== "Retired") {
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
      // Fetch employees from the server using GraphQL query
      const response = await axios.post("http://localhost:8000/graphql", {
        query,
      });

      // Check if the response contains errors
      const result = response.data;
      if (result.errors) {
        console.log("Error fetching employees", result.errors);
        return;
      }

      // If the selected employee type is UpcomingRetirement, fetch employees by type.
      this.setState({
        employees: result.data.getEmployees || result.data.getEmployeesByType,
        loading: false,
      });
    } catch (error) {
      console.log("Error fetching employees", error);
      this.setState({ loading: false });
    }
  };

  // Search functionality using the search term
  handleSearch = (searchTerm) => {
    this.setState({ searchTerm });
  };

  // Handle the primary filter change (employee type)
  handleEmployeeTypeChange = (e) => {
    this.setState({ selectedEmployeeType: e.target.value }, () => {
      this.fetchEmployees();
    });
  };

  //Handle deleting an employee
  handleDeleteEmployee = async (id) => {
    const employeeToDelete = this.state.employees.find(
      (employee) => employee.id === id
    );

    // Check if the employee is active before allowing deletion
    if (employeeToDelete && employeeToDelete.currentStatus) {
      toast.error("Can't Delete Employee - Status Active", {
        position: "top-right",
        closeButton: false,
        autoClose: 3000,
      });

      // Show a warning message
      Swal.fire({
        title: "Can't Delete Employee - Status Active",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    // Show confirmation dialog before deleting
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    // Create a GraphQL mutation to delete the employee
    if (result.isConfirmed) {
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

        // Check if the response contains errors
        const resData = response.data;
        if (resData.errors) {
          toast.error("Error deleting employee", {
            position: "top-right",
            closeButton: false,
            autoClose: 3000,
          });
          console.log("Error deleting employee", resData.errors);
          return;
        }

        // Check if the deletion was successful
        // If successful, remove the employee from the state
        if (resData.data.deleteEmployee.success) {
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
            closeButton: false,
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
    // Destructure state variables for easier access
    const { searchTerm, employees, loading, selectedEmployeeType } = this.state;

    // Filter by search term
    let filteredEmployees = employees.filter((employee) =>
      Object.values(employee).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // If the "Retired" option is selected, filter employees with currentStatus === false.
    if (selectedEmployeeType === "Retired") {
      filteredEmployees = filteredEmployees.filter(
        (employee) => employee.currentStatus === false
      );
    }

    return (
      <div className="employee-directory-page">
        <Container>
          <h1 className="employee-directory">Employee Directory</h1>

          {loading ? (
            <div className="loading">
              <ThreeCircles
                visible={true}
                height="100"
                width="100"
                color="#1a73e8"
                ariaLabel="three-circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          ) : (
            <div className="employee-list">
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
                    <option value="Retired">Retired Employees</option>
                  </select>
                </div>
              </div>
              <EmployeeTable
                employees={filteredEmployees}
                onDeleteEmployee={this.handleDeleteEmployee}
              />
            </div>
          )}
        </Container>
      </div>
    );
  }
}

// Wrapper to provide URL management using hooks
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
