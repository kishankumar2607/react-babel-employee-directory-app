const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    age: Int!
    dateOfJoining: String!
    title: String!
    department: String!
    employeeType: String!
    currentStatus: Int!
  }

  type Query {
    getEmployees: [Employee]
  }

  type Mutation {
    createEmployee(
      firstName: String!
      lastName: String!
      age: Int!
      dateOfJoining: String!
      title: String!
      department: String!
      employeeType: String!
    ): Employee
  }
`;

module.exports = typeDefs;
