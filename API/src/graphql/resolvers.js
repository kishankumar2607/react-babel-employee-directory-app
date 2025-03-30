const Employee = require("../models/EmployeeModel");
const GraphQLDate = require("../graphql/GraphQLDate");
const moment = require("moment");

const resolvers = {
  Date: GraphQLDate,

  // resolvers for the queries and mutations
  Query: {
    // Fetch all employees (used for fetching all employees)
    getEmployees: async () => {
      try {
        const employees = await Employee.find();
        return employees.map((employee) => ({
          ...employee.toObject(),
          id: employee._id.toString(),
          retirementInfo: calculateRetirementInfo(employee),
        }));
      } catch (error) {
        console.error("Error fetching employees", error);
        throw new Error("Error fetching employees");
      }
    },

    // Fetch employee by ID (used for fetching a single employee)
    getEmployeeById: async (_, { id }) => {
      try {
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error("Employee not found");
        }
        return {
          ...employee.toObject(),
          id: employee._id.toString(),
          retirementInfo: calculateRetirementInfo(employee),
        };
      } catch (error) {
        console.error("Error fetching employee by ID", error);
        throw new Error("Error fetching employee by ID");
      }
    },

    // Fetch employees by type (used for fetching employees by type)
    getEmployeesByType: async (_, { employeeType }) => {
      try {
        const employees = await Employee.find({ employeeType: employeeType });
        return employees.map((employee) => ({
          ...employee.toObject(),
          id: employee._id.toString(),
        }));
      } catch (error) {
        console.error("Error fetching employees by type", error);
        throw new Error("Error fetching employees by type");
      }
    },
  },

  // Mutations for employee
  Mutation: {
    // Create a new employee (used for creating a new employee)
    createEmployee: async (
      _,
      {
        firstName,
        lastName,
        age,
        dateOfJoining,
        title,
        department,
        employeeType,
      }
    ) => {
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
        console.error("Error creating employee", error);
        throw new Error("Error creating employee");
      }
    },

    // Delete an employee (used for deleting an employee)
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

    // Update an employee (used for updating an employee)
    updateEmployee: async (_, { id, title, department, currentStatus }) => {
      try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
          id,
          {
            ...(title && { title }),
            ...(department && { department }),
            ...(currentStatus !== undefined && { currentStatus }),
          },
          { new: true }
        );

        if (!updatedEmployee) {
          throw new Error("Employee not found");
        }

        return updatedEmployee;
      } catch (error) {
        throw new Error("Error updating employee: " + error.message);
      }
    },
  },
};

const calculateRetirementInfo = (employee) => {
  const ageAtJoining = employee.age;
  const dateOfJoining = moment(employee.dateOfJoining);
  const retirementAge = 65;

  // Calculate retirement date by adding 65 years to the joining date
  const retirementDate = dateOfJoining.add(
    retirementAge - ageAtJoining,
    "years"
  );

  // Calculate duration left until retirement from today's date
  const today = moment();
  const durationLeft = moment.duration(retirementDate.diff(today));

  // Extract years, months, and days left
  const yearsLeft = durationLeft.years();
  const monthsLeft = durationLeft.months();
  const daysLeft = durationLeft.days();

  // Return retirement info as an object
  return {
    years: yearsLeft > 0 ? yearsLeft : 0,
    months: monthsLeft > 0 ? monthsLeft : 0,
    days: daysLeft > 0 ? daysLeft : 0,
  };
};

module.exports = resolvers;
