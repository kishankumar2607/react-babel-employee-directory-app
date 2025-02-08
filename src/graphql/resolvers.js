const Employee = require('../models/EmployeeModel');

const resolvers = {
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
  },
};

module.exports = resolvers;
