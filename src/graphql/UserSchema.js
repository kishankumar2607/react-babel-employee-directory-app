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
  }
`;

module.exports = typeDefs;
