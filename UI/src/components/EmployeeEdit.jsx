import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import { ThreeCircles } from "react-loader-spinner";
import { TiArrowBack } from "react-icons/ti";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Alert,
} from "react-bootstrap";

const initialState = {
  title: "",
  department: "",
  currentStatus: true,
  firstName: "",
  lastName: "",
  age: "",
  dateOfJoining: "",
  employeeType: "",
};

const EmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch Employee Details
    const fetchEmployee = async () => {
      setLoading(true);
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

        // Find the employee by ID
        const foundEmployee = response.data.data.getEmployees.find(
          (emp) => emp.id === id
        );

        // If employee not found, set error message
        if (foundEmployee) {
          setEmployee(foundEmployee);
          setLoading(false);
        } else {
          setError("Employee not found");
        }
      } catch (err) {
        setError("Error fetching employee details");
      } finally {
        setLoading(false);
      }
    };

    // call fetchEmployee function
    fetchEmployee();
  }, [id]);

  // Handle Input Changes for editable fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: name === "currentStatus" ? value === "true" : value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoadingUpdate(true);

    try {
      // Update employee details
      const response = await axios.post("http://localhost:8000/graphql", {
        query: `
          mutation {
            updateEmployee(
              id: "${id}",
              title: "${employee.title}",
              department: "${employee.department}",
              currentStatus: ${employee.currentStatus}
            ) {
              id
              title
              department
              currentStatus
            }
          }
        `,
      });

      // Check for errors in the response
      if (response.data.errors) {
        setError("Failed to update employee");
      } else {
        Swal.fire({
          position: "center",
          title: "Employee Updated Successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => navigate("/employee-list"), 2000);
      }
    } catch (err) {
      setError("Error updating employee");
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Format date for display
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return moment(dateStr).format("MMMM DD, YYYY");
  };

  // Function to handle navigation back to the employee list
  const handleBack = () => {
    window.history.back();
  };

  return loading ? (
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
    <Container className="my-5 py-2">
      <Card
        className="border-0 shadow"
        style={{ background: "rgba(255, 255, 255, 0.9)" }}
      >
        <div
          className="d-flex align-items-center justify-content-between mb-4 p-4"
          style={{
            background: "#007bff",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
          }}
        >
          <TiArrowBack
            color="#ffffff"
            fontSize="2rem"
            style={{ cursor: "pointer" }}
            onClick={() => handleBack()}
          />
          <h2 className="text-white fs-2 fw-bold">Edit Employee</h2>
          <div />
        </div>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            <Col md={5} className="border-end">
              <h3 className="mb-3 pb-2 fw-bold px-1">Employee Information</h3>
              <ListGroup variant="flush">
                <ListGroup.Item className="fs-4">
                  <strong>First Name:</strong> {employee.firstName}
                </ListGroup.Item>
                <ListGroup.Item className="fs-4">
                  <strong>Last Name:</strong> {employee.lastName}
                </ListGroup.Item>
                <ListGroup.Item className="fs-4">
                  <strong>Age:</strong> {employee.age}
                </ListGroup.Item>
                <ListGroup.Item className="fs-4">
                  <strong>Date of Joining:</strong>{" "}
                  {formatDisplayDate(employee.dateOfJoining)}
                </ListGroup.Item>
                <ListGroup.Item className="fs-4">
                  <strong>Employee Type:</strong> {employee.employeeType}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={7}>
              <h3 className="mb-3 pb-2 fw-bold px-1">Edit Details</h3>
              <Form onSubmit={handleSubmit} className="form-control-edit">
                <Row md={12} className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="formTitle">
                      <Form.Label>Title</Form.Label>
                      <Form.Select
                        name="title"
                        value={employee.title}
                        onChange={handleChange}
                      >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="Director">Director</option>
                        <option value="VP">VP</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formDepartment">
                      <Form.Label>Department</Form.Label>
                      <Form.Select
                        name="department"
                        value={employee.department}
                        onChange={handleChange}
                      >
                        <option value="IT">IT</option>
                        <option value="Marketing">Marketing</option>
                        <option value="HR">HR</option>
                        <option value="Engineering">Engineering</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row md={12} className="mb-3">
                  <Col >
                    <Form.Group controlId="formStatus">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="currentStatus"
                        value={employee.currentStatus.toString()}
                        onChange={handleChange}
                      >
                        <option value="true">Working</option>
                        <option value="false">Retired</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="text-center">
                  <Button
                    variant="success"
                    type="submit"
                    disabled={loadingUpdate}
                    className="edit-button"
                  >
                    {loadingUpdate ? "Updating..." : "Update Employee"}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EmployeeEdit;
