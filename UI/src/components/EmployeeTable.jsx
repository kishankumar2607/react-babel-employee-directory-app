import React from "react";
import { MdDelete } from "react-icons/md";
import { FaEye, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

const EmployeeTable = ({ employees, onDeleteEmployee }) => {
  // Hook to navigate to a different route
  const navigate = useNavigate();

  // Function to get the details of an employee
  const handleClick = (id) => {
    navigate(`/employee/${id}`);
  };

  // Function to edit the details of an employee
  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

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
                  <FaEye
                    onClick={() => handleClick(employee.id)}
                    className="viewIcons"
                  />
                  <FaEdit
                    onClick={() => handleEdit(employee.id)}
                    className="editIcons"
                  />
                  <MdDelete
                    onClick={() => onDeleteEmployee(employee.id)}
                    className="deleteIcons"
                  />
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
};

export default EmployeeTable;
