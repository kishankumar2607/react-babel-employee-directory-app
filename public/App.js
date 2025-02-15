//Class to search employees for the Employee Directory
class EmployeeSearch extends React.Component {
  // Function to handle the search input and pass the value to the parent component
  handleSearch = e => {
    this.props.setSearchTerm(e.target.value);
  };
  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Search Employees...",
      onChange: this.handleSearch
    }));
  }
}

// Helper function to format an ISO date string to DD/MM/YYYY
const formatDate = isoDate => {
  if (!isoDate) return "N/A";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
};

//Class to display the employee table
class EmployeeTable extends React.Component {
  render() {
    // Destructuring employees from props
    const {
      employees
    } = this.props;
    return /*#__PURE__*/React.createElement("div", null, employees.length > 0 ? /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "First Name"), /*#__PURE__*/React.createElement("th", null, "Last Name"), /*#__PURE__*/React.createElement("th", null, "Age"), /*#__PURE__*/React.createElement("th", null, "Date of Joining"), /*#__PURE__*/React.createElement("th", null, "Title"), /*#__PURE__*/React.createElement("th", null, "Department"), /*#__PURE__*/React.createElement("th", null, "Employee Type"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, employees.map((employee, index) => /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", null, employee.firstName), /*#__PURE__*/React.createElement("td", null, employee.lastName), /*#__PURE__*/React.createElement("td", null, employee.age), /*#__PURE__*/React.createElement("td", null, formatDate(employee.dateOfJoining)), /*#__PURE__*/React.createElement("td", null, employee.title), /*#__PURE__*/React.createElement("td", null, employee.department), /*#__PURE__*/React.createElement("td", null, employee.employeeType), /*#__PURE__*/React.createElement("td", null, employee.currentStatus === true || 1 ? "Working" : "Retired"))))) : /*#__PURE__*/React.createElement("div", {
      className: "no-employees"
    }, "No employees found"));
  }
}

//Class to create a new employee
class EmployeeCreate extends React.Component {
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
      errors: {}
    };
  }

  // Handling changes in form inputs
  handleChange = e => {
    const {
      name,
      value
    } = e.target;
    // Dynamically update the form field based on its name
    this.setState({
      [name]: value
    });
  };

  //Function to handle the form validation
  validateForm = () => {
    //Get the value of the form fields
    const {
      firstName,
      lastName,
      age,
      dateOfJoining
    } = this.state;
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
    this.setState({
      errors
    });
    return formIsValid;
  };

  //Function to handle the form submission
  handleSubmit = async e => {
    e.preventDefault();

    //check if the form is valid
    if (!this.validateForm()) {
      return;
    }
    try {
      //Send a POST request to the GraphQL API with the employee data
      const response = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
            employeeType: this.state.employeeType
          }
        })
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
        employeeType: "FullTime"
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
      errors
    } = this.state;
    return /*#__PURE__*/React.createElement("form", {
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("h2", null, "Add Employee"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "First Name:"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "firstName",
      value: firstName,
      onChange: this.handleChange
    }), errors.firstName && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, errors.firstName)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Last Name:"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "lastName",
      value: lastName,
      onChange: this.handleChange
    }), errors.lastName && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, errors.lastName)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Age:"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      name: "age",
      value: age,
      onChange: this.handleChange
    }), errors.age && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, errors.age)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Date of Joining:"), /*#__PURE__*/React.createElement("input", {
      type: "date",
      name: "dateOfJoining",
      value: dateOfJoining,
      onChange: this.handleChange
    }), errors.dateOfJoining && /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, errors.dateOfJoining)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Title:"), /*#__PURE__*/React.createElement("select", {
      name: "title",
      value: title,
      onChange: this.handleChange
    }, /*#__PURE__*/React.createElement("option", {
      value: "Employee"
    }, "Employee"), /*#__PURE__*/React.createElement("option", {
      value: "Manager"
    }, "Manager"), /*#__PURE__*/React.createElement("option", {
      value: "Director"
    }, "Director"), /*#__PURE__*/React.createElement("option", {
      value: "VP"
    }, "VP"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Department:"), /*#__PURE__*/React.createElement("select", {
      name: "department",
      value: department,
      onChange: this.handleChange
    }, /*#__PURE__*/React.createElement("option", {
      value: "IT"
    }, "IT"), /*#__PURE__*/React.createElement("option", {
      value: "Marketing"
    }, "Marketing"), /*#__PURE__*/React.createElement("option", {
      value: "HR"
    }, "HR"), /*#__PURE__*/React.createElement("option", {
      value: "Engineering"
    }, "Engineering"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Employee Type:"), /*#__PURE__*/React.createElement("select", {
      name: "employeeType",
      value: employeeType,
      onChange: this.handleChange
    }, /*#__PURE__*/React.createElement("option", {
      value: "FullTime"
    }, "FullTime"), /*#__PURE__*/React.createElement("option", {
      value: "PartTime"
    }, "PartTime"), /*#__PURE__*/React.createElement("option", {
      value: "Contract"
    }, "Contract"), /*#__PURE__*/React.createElement("option", {
      value: "Seasonal"
    }, "Seasonal"))), /*#__PURE__*/React.createElement("button", {
      type: "submit"
    }, "Add Employee"));
  }
}

//Parent class to display the Employee Directory
class EmployeeDirectory extends React.Component {
  //Initial state of the search term and employees
  state = {
    searchTerm: "",
    employees: []
  };

  // Fetch employees when the component mounts
  componentDidMount() {
    this.fetchEmployees();
  }

  //Function to fetch the list of employees from the GraphQL API
  fetchEmployees = async () => {
    try {
      const response = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
          `
        })
      });

      //Get the response data from the GraphQL API
      const result = await response.json();
      if (result.errors) {
        console.log("Error fetching employees", result.errors);
        return;
      }

      // Update the employees state with the fetched data
      this.setState({
        employees: result.data.getEmployees
      });
    } catch (error) {
      console.log("Error fetching employees", result.errors);
    }
  };

  // Handling search term change and updating state
  handleSearch = searchTerm => {
    this.setState({
      searchTerm
    });
  };

  // Adding a new employee to the employee list
  addEmployee = employee => {
    this.setState(prevState => ({
      employees: [...prevState.employees, employee]
    }));
  };
  render() {
    // Filter employees based on the search term in the state
    const filteredEmployees = this.state.employees.filter(employee => Object.values(employee).some(value => value.toString().toLowerCase().includes(this.state.searchTerm.toLowerCase())));
    return /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("h1", null, "Employee Directory"), /*#__PURE__*/React.createElement(EmployeeSearch, {
      setSearchTerm: this.handleSearch
    }), /*#__PURE__*/React.createElement(EmployeeTable, {
      employees: filteredEmployees
    }), /*#__PURE__*/React.createElement(EmployeeCreate, {
      addEmployee: this.addEmployee
    }));
  }
}
class App extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(EmployeeDirectory, null));
  }
}
ReactDOM.render(/*#__PURE__*/React.createElement(App, null), document.getElementById("root"));