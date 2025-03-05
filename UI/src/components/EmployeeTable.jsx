
import React from "react";


// Helper function to format an ISO date string to DD/MM/YYYY
const formatDate = (isoDate) => {
  if (!isoDate) return "N/A";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};


//Class to display the employee table
export default class EmployeeTable extends React.Component {
    render() {
      // Destructuring employees from props
      const { employees } = this.props;
  
      return (
        <div>
          {employees.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Age</th>
                  <th>Date of Joining</th>
                  <th>Title</th>
                  <th>Department</th>
                  <th>Employee Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Map through the employee data and create a row for each employee */}
                {employees.map((employee, index) => (
                  <tr key={index}>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.age}</td>
                    <td>{formatDate(employee.dateOfJoining)}</td>
                    <td>{employee.title}</td>
                    <td>{employee.department}</td>
                    <td>{employee.employeeType}</td>
                    <td>
                      {employee.currentStatus === true || 1 ? "Working" : "Retired"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-employees">No employees found</div>
          )}
        </div>
      );
    }
  }