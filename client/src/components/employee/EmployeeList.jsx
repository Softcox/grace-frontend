import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import axios from '../../service/Axios'; 
import EmployeeForm from "./EmployeeForm";
import './DateFilter.css';

const EmployeeList = () => {
  const [rowData, setRowData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/employee'); 
        setRowData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error fetching employees', error);
      }
    };
    fetchEmployees();
  }, []);

  const handleDeleteEmployees = async () => {
    const idsToDelete = selectedEmployees.map(emp => emp.id);
    const updatedRowData = rowData.filter(emp => !idsToDelete.includes(emp.id));
    setRowData(updatedRowData);
    setFilteredData(updatedRowData);
    setSelectedEmployees([]); 
    alert('Deleted successfully.');

    try {
      await Promise.all(selectedEmployees.map(async (employee) => {
        await axios.delete(`/employee/${employee.id}`); 
      }));
    } catch (error) {
      console.error('Error deleting employees', error);
    }
  };

  const handleCalculateSalary = async () => {
    if (selectedEmployees.length === 0) {
      alert('Please select at least one employee.');
      return;
    }
    if (!startDate || !endDate) {
      alert('Please provide both start and end dates.');
      return;
    }
    try {
      await Promise.all(selectedEmployees.map(async (employee) => {
        const url = `/employee/${employee.id}/calculate-salary`;
        const params = new URLSearchParams({
          startDate: startDate,
          endDate: endDate
        }).toString();
        await axios.post(`${url}?${params}`);
      }));

      const response = await axios.get('/employee');
      setRowData(response.data);
      setFilteredData(response.data);
      alert('Salaries calculated successfully.');
    } catch (error) {
      console.error('Error calculating salaries', error);
      if (error.response) {
        console.error('Response data:', error.response.data); 
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      alert('Error calculating salaries. Please check the console for details.');
    }
  };

  const [columnDefs] = useState([
    { 
      field: "employeeRollNo", 
      headerName: "RollNo",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 110,
      cellStyle: { color: "#172554", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
    { 
      field: "name", 
      headerName: "Name", 
      width: 195, 
      cellRenderer: (params) => (
        <span
          style={{ color: "#007BFF", cursor: "pointer" }}
          onClick={() => navigate(`/employee/${params.data.id}`)}
        >
          {params.value}
        </span>
      ),
      cellStyle: { color: "#1D4ED8", fontSize: "13px", fontWeight: 500 }
    },
    { 
      field: "role", 
      headerName: "Role", 
      width: 140,
      cellStyle: { color: "#172554", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
    { 
      field: "totalBasicSalary", 
      headerName: "Total Basic Salary", 
      width: 140,
      cellStyle: { color: "#172554", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
    { 
      field: "totalOvertimeSalary", 
      headerName: "Total Overtime Salary", 
      width: 140,
      cellStyle: { color: "#172554", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
    { 
      field: "totalWithdrawal", 
      headerName: "Total Withdrawal", 
      width: 140,
      cellStyle: { color: "#172554", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
    { 
      field: "totalLoan", 
      headerName: "Total Loan", 
      width: 140,
      cellStyle: { color: "#172554", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
    { 
      field: "totalPayableSalary", 
      headerName: "Total Payable Salary", 
      width: 140,
      cellStyle: { color: "#172554", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
  ]);

  const defaultColDef = useMemo(() => ({
    filter: "agTextColumnFilter",
    floatingFilter: true,
    resizable: true,
  }), []);

  const onSelectionChanged = (params) => {
    const selectedRows = params.api.getSelectedRows();
    setSelectedEmployees(selectedRows);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '95vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '90%', marginTop: "0px", marginBottom: '10px', height: '50px' }}>
        <h1 style={{ margin: 0, fontSize: '30px', color: '#172554' }}>Employee Details</h1>
        <div className="employee-button">

        <button
          onClick={() => navigate('/employee/add')}
          style={{
            border: '1px solid #172554',
            borderRadius: '13px',
            fontSize: '15px',
            cursor: 'pointer',
            width: '200px',
            height: '50px',
            backgroundColor: '#172554',
            color: '#fff'
          }}
        >
          + Add New Employee
        </button>
        {selectedEmployees.length > 0 && (
          <>
            <button
              onClick={handleDeleteEmployees}
              style={{
                border: '1px solid #FF0000',
                borderRadius: '13px',
                fontSize: '15px',
                cursor: 'pointer',
                width: '200px',
                height: '50px',
                backgroundColor: '#ff9999',
                color: '#ff0000',
                margin: '10px 0 10px 20px'
              }}
            >
              Delete
            </button>
          </>
        )}

        </div>
        
      </div>

      <div className="date-filter-container">
        <div className="date-filter-row">
          <label className="date-filter-label">From</label>
          <input
            type="date"
            className="date-filter-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label className="date-filter-label">To</label>
          <input
            type="date"
            className="date-filter-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            onClick={handleCalculateSalary}
            className="date-filter-button"
          >
            Calculate Salary
          </button>
        </div>
      </div>

      {showForm && <EmployeeForm onAddEmployee={handleAddEmployee} />}

      <div className="ag-theme-quartz" style={{ height: 600, width: "90%", overflowX: 'auto' }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          pagination={true}
          paginationPageSize={10}
          rowHeight={38}
          onSelectionChanged={onSelectionChanged}
        />
      </div>
    </div>
  );
};

export default EmployeeList;

