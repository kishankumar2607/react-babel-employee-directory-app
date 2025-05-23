# Employee Directory App

A web application built with React and GraphQL that allows users to manage employee information. This app enables the following features:

- **Search Employee:** Quickly search through the employee directory by name or other details.
- **Add New Employee:** Add employees with detailed information including first name, last name, age, date of joining, title, department, and employment type.
- **Employee Table:** View a responsive table of employee details with real-time updates.
- **View Employee Details:** Click on an employee to see full details, including calculated retirement information (days, months, and years left until retirement).
- **Edit Employee:** Update selected fields (Title, Department, and Current Status) for an existing employee.
- **Delete Employee:** Remove employees from the directory (with a check to prevent deletion if the employee's status is active).
- **Upcoming Retirement Filter:** Filter employees whose retirement is coming in the next 6 months and further refine by employee type.

## Features

- **Employee Search:** Real-time filtering of employee data as you type.
- **Add Employee:** A form to add a new employee. The form includes client-side validation.
- **Employee Listing:** A responsive table displaying all employee details. The table supports actions for view, edit, and delete.
- **Employee Details:** Detailed view of an employee, including dynamic calculation of retirement information (e.g., days, months, and years left until retirement).
- **Edit Employee:** Ability to update only selected fields (Title, Department, and Current Status) of an employee.
- **Delete Employee:** Functionality to delete an employee, with a safeguard preventing deletion if the employee is still active.
- **Upcoming Retirement Filter:** A dedicated filter to display employees who are nearing retirement (assumed retirement age is 65), with additional filtering by employee type.

## Technologies Used

- **React:** For building a dynamic, component-based user interface.
- **GraphQL:** To query and mutate employee data.
- **React Bootstrap:** For responsive and modern UI components.
- **Axios:** For making HTTP requests.
- **Moment.js:** For date manipulation and formatting.
- **SweetAlert2 & React Toastify:** For enhanced alert and notification messages.
- **JavaScript (ES6+):** Modern JavaScript features and syntax.
- **CSS:** Custom and Bootstrap-based styling.

## Setup Instructions

Follow these steps to run the project locally:

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (including npm)
- A code editor like [VS Code](https://code.visualstudio.com/)

### Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/kishankumar2607/react-babel-employee-directory-app.git
   ```

### Installation Instructions

1. Navigate to the project directory.

   ```bash
   cd API
   cd UI

   ```

2. Create .env files and configure
   PORT = 8000
   URI = your_mongodb_connection_url

3. Install the required dependencies.

   ```bash
   npm install

   ```

4. Start the application.
   ```bash
   npm run watch
   npm run dev
   ```
