import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import EmployeeList from '../components/employee/EmployeeList';
import EmployeeDetail from '../components/employee/EmployeeDetail';
import { EmployeeProvider } from '../components/employee/EmployeeContext';
import EmployeeForm from '../components/employee/EmployeeForm';
import axios from '../service/Axios';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/employee');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddEmployee = async (newEmployee) => {
    try {
      const response = await axios.post('/employee/create', newEmployee);
      if (response.status === 200 || response.status === 201) {
        setEmployees([...employees, response.data]);
        navigate('/');
      }
    } catch (error) {
      console.error('Error adding employee', error);
    }
  };

  return (
    <EmployeeProvider>
      <Routes>
        <Route 
          path="/" 
          element={<EmployeeList employees={employees} />} 
        />
        <Route 
          path="/:id" 
          element={<EmployeeDetail />} 
        />
        {/* Pass handleAddEmployee to EmployeeForm */}
        <Route 
          path='/add' 
          element={<EmployeeForm onAddEmployee={handleAddEmployee} />} 
        />
      </Routes>
    </EmployeeProvider>
  );
};

export default EmployeePage;
