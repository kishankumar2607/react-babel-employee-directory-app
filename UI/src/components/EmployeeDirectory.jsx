import React from "react";
import EmployeeSearch from "./EmployeeSearch.jsx";
import EmployeeTable from "./EmployeeTable.jsx";

export default class EmployeeDirectory extends React.Component {
  // Define the initial state
  state = {
    searchTerm: "",
    employees: [],
    selectedType: "All",
  };

  componentDidMount() {
    this.fetchEmployees();
    this.setTypeFromQueryParams();
  }

  // Fetch employees when the component mounts
  fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });

      const result = await response.json();
      if (result.errors) {
        console.log("Error fetching employees", result.errors);
        return;
      }

      this.setState({ employees: result.data.getEmployees });
    } catch (error) {
      console.log("Error fetching employees", error);
    }
  };

  // Function to extract and set selectedType from the query parameter
  setTypeFromQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    // Get the type query parameter
    const type = params.get("type");
    if (type) {
      this.setState({ selectedType: type });
    }
  };

  // Function to handle search input change event
  handleSearch = (searchTerm) => {
    this.setState({ searchTerm });
  };

  // Function to handle filter change event
  handleFilterChange = (e) => {
    const selectedType = e.target.value;
    this.setState({ selectedType });

    // Update the URL with the selected type
    const queryString = selectedType === "All" ? "" : `?type=${selectedType}`;
    window.history.pushState({}, "", `/employee-list${queryString}`);
  };

  render() {
    const { searchTerm, employees, selectedType } = this.state;

    // Filter employees based on the search term
    let filteredEmployees = employees.filter((employee) =>
      Object.values(employee).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Filter employees based on the selected type
    if (selectedType !== "All") {
      filteredEmployees = filteredEmployees.filter(
        (employee) => employee.employeeType === selectedType
      );
    }

    return (
      <div className="container">
        <h1 className="employee-directory">Employee Directory</h1>
        <select value={selectedType} onChange={this.handleFilterChange}>
          <option value="All">All Employees</option>
          <option value="FullTime">Full Time</option>
          <option value="PartTime">Part Time</option>
          <option value="Contract">Contract</option>
          <option value="SeasonalEmployee">Seasonal</option>
        </select>
        <EmployeeSearch setSearchTerm={this.handleSearch} />
        <EmployeeTable employees={filteredEmployees} />
      </div>
    );
  }
}
