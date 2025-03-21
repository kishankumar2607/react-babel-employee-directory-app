const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    age: Int!
    dateOfJoining: Date!
    title: String!
    department: String!
    employeeType: String!
    currentStatus: Boolean!
  }

  type Query {
    getEmployees: [Employee]
    getEmployeeById(id: ID!): Employee
    getEmployeesByType(employeeType: String!): [Employee]
  }

  type Mutation {
    createEmployee(
      firstName: String!
      lastName: String!
      age: Int!
      dateOfJoining: Date!
      title: String!
      department: String!
      employeeType: String!
    ): Employee

    deleteEmployee(
      id: ID!
    ): DeleteResponse

    updateEmployee(
      id: ID!, 
      title: String, 
      department: String, 
      currentStatus: Boolean
    ): Employee
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }
`;

module.exports = typeDefs;
