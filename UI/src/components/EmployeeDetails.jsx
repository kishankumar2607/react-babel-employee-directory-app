import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/graphql/employees/${id}`)
      .then(response => setEmployee(response.data))
      .catch(error => console.error("Error fetching employee:", error));
  }, [id]);

  return (
    <div>
      <h2>Employee Details</h2>
      {employee ? (
        <div>
          <p>Name: {employee.firstName} {employee.lastName}</p>
          <p>Age: {employee.age}</p>
          <p>Department: {employee.department}</p>
          <p>Title: {employee.title}</p>
        </div>
      ) : <p>Loading...</p>}
    </div>
  );
};

export default EmployeeDetails;
