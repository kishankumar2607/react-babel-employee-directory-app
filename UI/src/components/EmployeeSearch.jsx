
import React from 'react';

//Class to search employees for the Employee Directory
export default class EmployeeSearch extends React.Component {
    // Function to handle the search input and pass the value to the parent component
    handleSearch = (e) => {
      this.props.setSearchTerm(e.target.value);
    };
  
    render() {
      return (
        <div className='search-employee'>
          <input
            type="text"
            placeholder="Search Employees..."
            onChange={this.handleSearch}
          />
        </div>
      );
    }
  }