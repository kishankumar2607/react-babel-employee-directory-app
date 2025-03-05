
import React from 'react';
import EmployeeSearch from './EmployeeSearch.jsx';
import EmployeeTable from './EmployeeTable.jsx';
import EmployeeCreate from './EmployeeCreate.jsx';

//Parent class to display the Employee Directory
export default class EmployeeDirectory extends React.Component {
  //Initial state of the search term and employees
  state = {
    searchTerm: "",
    employees: [],
  };

  // Fetch employees when the component mounts
  componentDidMount() {
    this.fetchEmployees();
  }

  //Function to fetch the list of employees from the GraphQL API
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

      //Get the response data from the GraphQL API
      const result = await response.json();
      if (result.errors) {
        console.log("Error fetching employees", result.errors);
        return;
      }

      // Update the employees state with the fetched data
      this.setState({ employees: result.data.getEmployees });
    } catch (error) {
      console.log("Error fetching employees", result.errors);
    }
  };

  // Handling search term change and updating state
  handleSearch = (searchTerm) => {
    this.setState({ searchTerm });
  };

  // Adding a new employee to the employee list
  addEmployee = (employee) => {
    this.setState((prevState) => ({
      employees: [...prevState.employees, employee],
    }));
  };

  render() {
    // Filter employees based on the search term in the state
    const filteredEmployees = this.state.employees.filter((employee) =>
      Object.values(employee).some((value) =>
        value
          .toString()
          .toLowerCase()
          .includes(this.state.searchTerm.toLowerCase())
      )
    );

    return (
      <div className="container">
        <h1>Employee Directory</h1>
        <EmployeeSearch setSearchTerm={this.handleSearch} />
        <EmployeeTable employees={filteredEmployees} />
        <EmployeeCreate addEmployee={this.addEmployee} />
      </div>
    );
  }
}