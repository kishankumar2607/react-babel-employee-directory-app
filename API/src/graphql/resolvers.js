const Employee = require('../models/EmployeeModel');
const GraphQLDate = require('../graphql/GraphQLDate');

const resolvers = {
  Date: GraphQLDate,

  Query: {
    getEmployees: async () => {
      try {
        const employees = await Employee.find();
        return employees.map(employee => ({
          ...employee.toObject(),
          id: employee._id.toString(),
        }));
      } catch (error) {
        console.error('Error fetching employees', error);
        throw new Error('Error fetching employees');
      }
    },
  },

  Mutation: {
    createEmployee: async (_, { firstName, lastName, age, dateOfJoining, title, department, employeeType }) => {
      try {
        const newEmployee = new Employee({
          firstName,
          lastName,
          age,
          dateOfJoining,
          title,
          department,
          employeeType,
        });
        return await newEmployee.save();
      } catch (error) {
        console.error('Error creating employee', error);
        throw new Error('Error creating employee');
      }
    },

    deleteEmployee: async (_, { id }) => {
      // Logic to delete the employee from the database
      const employee = await Employee.findByIdAndDelete(id);
      if (!employee) {
        return {
          success: false,
          message: "Employee not found",
        };
      }

      return {
        success: true,
        message: "Employee deleted successfully",
      };
    },
  },
};

module.exports = resolvers;
