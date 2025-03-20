import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment"; // Import moment.js

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios({
          method: "post",
          url: "http://localhost:8000/graphql",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            query: `
              query {
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
          },
        });

        const employees = response.data.data.getEmployees;
        const selectedEmployee = employees.find((emp) => emp.id === id);

        if (selectedEmployee) {
          setEmployee(selectedEmployee);
        } else {
          setError("Employee not found");
        }
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEmployees();
    }
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {employee ? (
        <div>
          <h1>
            {employee.firstName} {employee.lastName}
          </h1>
          <p>
            <strong>Title:</strong> {employee.title}
          </p>
          <p>
            <strong>Department:</strong> {employee.department}
          </p>
          <p>
            <strong>Age:</strong> {employee.age}
          </p>
          <p>
            <strong>Date of Joining:</strong>
            {employee.dateOfJoining
              ? moment(employee.dateOfJoining).format("MMMM DD, YYYY")
              : "N/A"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {employee.currentStatus ? "Working" : "Retired"}
          </p>
          <p>
            <strong>Employee Type:</strong> {employee.employeeType}
          </p>
        </div>
      ) : (
        <div>Employee not found</div>
      )}
    </div>
  );
};

export default EmployeeDetails;
