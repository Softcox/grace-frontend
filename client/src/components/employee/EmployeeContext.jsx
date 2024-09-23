import React, { createContext, useContext, useState } from 'react';
import { employeeData } from '../../data/EmployeeData';

const EmployeeContext = createContext();

export const useEmployees = () => {
  return useContext(EmployeeContext);
};

export const EmployeeProvider = ({ children }) => {
  const [employees] = useState(employeeData);

  return (
    <EmployeeContext.Provider value={employees}>
      {children}
    </EmployeeContext.Provider>
  );
};
