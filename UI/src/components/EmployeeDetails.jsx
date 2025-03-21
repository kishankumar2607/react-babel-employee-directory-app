import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employee details by ID from the server
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios({
          method: "post",
          url: "http://localhost:8000/graphql",
          headers: {
            "Content-Type": "application/json",
          },
          // Send a GraphQL query to fetch employee details by ID
          data: {
            query: `
              query {
                getEmployeeById(id: "${id}") {
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
          },
        });

        // Extract employee details from the response
        const employee = response.data.data.getEmployeeById;

        // Set employee details in the state
        if (employee) {
          setEmployee(employee);
        } else {
          setError("Employee not found");
        }
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    // Fetch employee details only if ID is available
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  // Show loading spinner while fetching employee details
  if (isLoading) return <div className="loading">Loading...</div>;

  // Show error message if there is an error while fetching employee details
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="employee-details-container">
      <h1 className="page-title">Employee Details</h1>
      {employee ? (
        <div className="employee-card">
          <h2 className="employee-name">
            {employee.firstName} {employee.lastName}
          </h2>
          <table className="employee-table">
            <tbody>
              <tr>
                <td>
                  <strong>Title</strong>
                </td>
                <td>:</td>
                <td>{employee.title}</td>
              </tr>
              <tr>
                <td>
                  <strong>Department</strong>
                </td>
                <td>:</td>
                <td>{employee.department}</td>
              </tr>
              <tr>
                <td>
                  <strong>Age</strong>
                </td>
                <td>:</td>
                <td>{employee.age}</td>
              </tr>
              <tr>
                <td>
                  <strong>Date of Joining</strong>
                </td>
                <td>:</td>
                <td>
                  {employee.dateOfJoining
                    ? moment(employee.dateOfJoining).format("MMMM DD, YYYY")
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Status</strong>
                </td>
                <td>:</td>
                <td>
                  <span
                    className={
                      employee.currentStatus
                        ? "status-working"
                        : "status-retired"
                    }
                  >
                    {employee.currentStatus ? "Working" : "Retired"}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Employee Type</strong>
                </td>
                <td>:</td>
                <td>{employee.employeeType}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="not-found">Employee not found</div>
      )}
    </div>
  );
};

export default EmployeeDetails;
