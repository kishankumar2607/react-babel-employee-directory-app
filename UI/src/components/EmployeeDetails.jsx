import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import { ThreeCircles } from "react-loader-spinner";
import { Container, Card, Table, Spinner, Alert } from "react-bootstrap";

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
          // GraphQL query to fetch employee details by ID
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
                  retirementInfo {
                    years
                    months
                    days
                  }
                }
              }
            `,
          },
        });

        const emp = response.data.data.getEmployeeById;
        if (emp) {
          setEmployee(emp);
        } else {
          setError("Employee not found");
        }
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  // Helper to format date using moment in UTC
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    return moment(isoDate).utc().format("DD MMMM YYYY");
  };

  // Display a loading spinner while fetching data
  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <ThreeCircles
          visible={true}
          height="100"
          width="100"
          color="#1a73e8"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </Container>
    );
  }

  // Display error message if an error occurred
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  // If employee is not found, you can choose to redirect or display a message
  if (!employee) {
    return <Navigate to="/employee-list" />;
  }

  return (
    <Container className="my-5">
      <h1 className="employee-directory">Employee Details</h1>
      {employee ? (
        <Card className="shadow">
          <Card.Header className="bg-primary text-white fs-4 fw-bold">
            Full Name : {employee.firstName} {employee.lastName}
          </Card.Header>
          <Card.Body>
            <Table bordered responsive>
              <tbody className="fs-6">
                <tr>
                  <td>
                    <strong>Title</strong>
                  </td>
                  <td>{employee.title}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Department</strong>
                  </td>
                  <td>{employee.department}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Age</strong>
                  </td>
                  <td>{employee.age}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Date of Joining</strong>
                  </td>
                  <td>{formatDate(employee.dateOfJoining)}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Status</strong>
                  </td>
                  <td>
                    <span
                      className={
                        employee.currentStatus ? "status-working" : "status-retired"
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
                  <td>{employee.employeeType}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Years Left for Retirement</strong>
                  </td>
                  <td>
                    {employee.retirementInfo
                      ? `${employee.retirementInfo.years} years`
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Months Left for Retirement</strong>
                  </td>
                  <td>
                    {employee.retirementInfo
                      ? `${employee.retirementInfo.months} months`
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Days Left for Retirement</strong>
                  </td>
                  <td>
                    {employee.retirementInfo
                      ? `${employee.retirementInfo.days} days`
                      : "N/A"}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="warning" className="text-center">
          Employee not found
        </Alert>
      )}
    </Container>
  );
};

export default EmployeeDetails;
