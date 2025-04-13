import React, { Component } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { ThreeCircles } from "react-loader-spinner";
import { Container, Form, Row, Col, Table, Alert } from "react-bootstrap";
import EmployeeSearch from "./EmployeeSearch.jsx";
import EmployeeTable from "./EmployeeTable.jsx";
import moment from "moment";

// Helper hook to parse query params
const useQuery = () => new URLSearchParams(useLocation().search);

class UpcomingRetirement extends Component {
  state = {
    searchTerm: "",
    employees: [],
    loading: true,
    selectedRetirementType: "All",
  };

  // Fetch employees when component mounts
  componentDidMount() {
    this.fetchEmployees();
  }

  // Fetch employees when primary filter changes and update URL with the selected employee type.
  componentDidUpdate(prevProps, prevState) {
    // Update URL when primary filter changes.
    if (
      prevState.selectedRetirementType !== this.state.selectedRetirementType
    ) {
      this.updateUrlWithEmployeeType();
    }
  }

  // Update URL when secondary filter changes and update the state.
  updateUrlWithEmployeeType = () => {
    const { selectedRetirementType } = this.state;
    this.props.navigate(`?employeeType=${selectedRetirementType}`);
  };

  // Fetch all employees from the GraphQL API
  fetchEmployees = async () => {
    const { selectedRetirementType } = this.state;
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
    if (selectedRetirementType !== "All") {
      query = `
        {
          getEmployeesByType(employeeType: "${selectedRetirementType}") { 
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
    // Fetch employees from the GraphQL API
    try {
      const response = await axios.post("http://localhost:8000/graphql", {
        query,
      });
      const result = response.data;
      if (result.errors) {
        console.log("Error fetching employees", result.errors);
        return;
      }

      this.setState({
        employees: result.data.getEmployees,
        loading: false,
      });
    } catch (error) {
      console.log("Error fetching employees", error);
      this.setState({ loading: false });
    }
  };

  // Helper function to calculate the current age of an employee
  getCurrentAge = (employee) => {
    // Estimate date of birth = dateOfJoining - stored age (in years)
    const dateOfBirth = moment(employee.dateOfJoining).subtract(
      employee.age,
      "years"
    );
    return moment().diff(dateOfBirth, "years");
  };

  // Calculate upcoming retirement employees: those whose retirement date falls within the next 6 months.
  getUpcomingRetirements = () => {
    const today = moment();
    const sixMonthsFromNow = moment().add(6, "months");
    const retirementAge = 65;

    return this.state.employees.filter((employee) => {
      const currentAge = this.getCurrentAge(employee);
      const yearsLeft = retirementAge - currentAge;
      const retirementDate = moment(employee.dateOfJoining).add(
        yearsLeft,
        "years"
      );
      return (
        retirementDate.isAfter(today) &&
        retirementDate.isBefore(sixMonthsFromNow)
      );
    });
  };

  // Handle search input change
  handleSearch = (searchTerm) => {
    this.setState({ searchTerm });
  };

  // Handle secondary filter change for employee type (for upcoming retirement)
  handleRetirementTypeChange = (e) => {
    this.setState({ selectedRetirementType: e.target.value });
  };

  // Handle deleting an employee
  handleDeleteEmployee = async (id) => {
    const employeeToDelete = this.state.employees.find(
      (employee) => employee.id === id
    );

    // Check if the employee is active (Working). If so, block deletion.
    if (employeeToDelete && employeeToDelete.currentStatus) {
      toast.error("Can't Delete Employee - Status Active", {
        position: "top-right",
        closeButton: false,
        autoClose: 3000,
      });
      Swal.fire({
        title: "Can't Delete Employee - Status Active",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    // Confirm deletion using SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

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
    const { searchTerm, loading, selectedRetirementType } = this.state;
    // Get upcoming retirement employees from the full list
    let upcomingEmployees = this.getUpcomingRetirements();

    // Apply secondary filter by employee type if needed
    if (selectedRetirementType !== "All") {
      upcomingEmployees = upcomingEmployees.filter(
        (emp) => emp.employeeType === selectedRetirementType
      );
    }

    // Apply search filter on the filtered list
    const filteredEmployees = upcomingEmployees.filter((employee) =>
      Object.values(employee).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return (
      <div className="employee-directory-page">
        <Container>
          <h1 className="employee-directory">Upcoming Retirement</h1>

          {loading ? (
            <div className="loading">
              <ThreeCircles
                visible={true}
                height="100"
                width="100"
                color="#1a73e8"
                ariaLabel="three-circles-loading"
              />
            </div>
          ) : (
            <div className="employee-list">
              <div className="filter-search">
                <EmployeeSearch setSearchTerm={this.handleSearch} />
                <div>
                  <select
                    value={selectedRetirementType}
                    onChange={this.handleRetirementTypeChange}
                  >
                    <option value="All">All Employee Types</option>
                    <option value="FullTime">Full-Time</option>
                    <option value="PartTime">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Seasonal">Seasonal</option>
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
const UpcomingRetirementWithUrlFilter = () => {
  const query = useQuery();
  const selectedEmployeeType = query.get("employeeType") || "All";
  const navigate = useNavigate();

  return (
    <UpcomingRetirement
      navigate={navigate}
      selectedEmployeeType={selectedEmployeeType}
    />
  );
};

export default UpcomingRetirementWithUrlFilter;
