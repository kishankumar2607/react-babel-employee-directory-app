import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

// Helper function to format an ISO date string to DD/MM/YYYY in UTC
const formatDate = (isoDate) => {
  if (!isoDate) return "N/A";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const EmployeeTable = ({ employees, onDeleteEmployee }) => {
  const navigate = useNavigate();

  // Navigate to employee details page
  const handleClick = (id) => {
    navigate(`/employee/${id}`);
  };

  // Navigate to employee edit page
  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  return (
    <div>
      {employees.length > 0 ? (
        <Table striped bordered hover responsive>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.age}</td>
                <td>{formatDate(employee.dateOfJoining)}</td>
                <td>{employee.title}</td>
                <td>{employee.department}</td>
                <td>{employee.employeeType}</td>
                <td>{employee.currentStatus ? "Working" : "Retired"}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleClick(employee.id)}
                    className="me-1"
                  >
                    <FaEye />
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(employee.id)}
                    className="me-1"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteEmployee(employee.id)}
                  >
                    <MdDelete />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="no-employees">No employees found</div>
      )}
    </div>
  );
};

export default EmployeeTable;
