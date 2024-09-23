import React, { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from '../../service/Axios'; 

const AddlogListForm = () => {
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const formattedDate = yesterdayDate.toISOString().split('T')[0]; 

  const [rowData, setRowData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formattedDate); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeResponse = await axios.get('/employee');
        
        const worklogResponse = await axios.get(`/worklog/date`, { params: { date: selectedDate } });
        const transactionResponse = await axios.get(`/transaction/date`, { params: { date: selectedDate } });

        const mergedData = employeeResponse.data.map(emp => {
          const worklogData = worklogResponse.data.find(work => work.employeeId === emp.id) || {};
          const transactionData = transactionResponse.data.find(trans => trans.employeeId === emp.id) || {};
          return {
            ...emp,
            date: selectedDate,
            ...worklogData,
            ...transactionData
          };
        });

        setRowData(mergedData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [selectedDate]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    setRowData(rowData.map(row => ({
      ...row,
      date: newDate 
    })));
  };

  const addLogEntry = async (logEntry) => {
    const payload = {
      workLogCreateDTO: {
        employeeId: logEntry.id,
        date: logEntry.date,
        workDayStatus: logEntry.workDayStatus.toUpperCase(), 
        overtimeHours: logEntry.overtimeHours,
        createdBy: "Admin",
        updatedBy: "Admin"
      },
      transactionCreateDTO: {
        employeeId: logEntry.id,
        date: logEntry.date,
        amount: logEntry.amount,
        createdBy: "Admin",
        updatedBy: "Admin"
      }
    };

    try {
      await axios.post('/employee/daily-work-log', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      });
      alert('Successfully added log entry');
      const employeeResponse = await axios.get('/employee');
      const worklogResponse = await axios.get(`/worklog/date`, { params: { date: selectedDate } });
      const transactionResponse = await axios.get(`/transaction/date`, { params: { date: selectedDate } });

      const mergedData = employeeResponse.data.map(emp => {
        const worklogData = worklogResponse.data.find(work => work.employeeId === emp.id) || {};
        const transactionData = transactionResponse.data.find(trans => trans.employeeId === emp.id) || {};
        return {
          ...emp,
          date: selectedDate, 
          ...worklogData,
          ...transactionData
        };
      });

      setRowData(mergedData);
    } catch (error) {
      console.error('Error adding log entry', error.response?.data || error.message);
      alert('Failed to add log entry');
    }
  };

  const handleAddAction = async (params) => {
    const logEntry = {
      id: params.data.id,
      name: params.data.name,
      role: params.data.role,
      date: params.data.date,
      workDayStatus: params.data.workDayStatus,
      amount: params.data.amount,
      overtimeHours: params.data.overtimeHours,
    };

    await addLogEntry(logEntry);
  };

  const [columnDefs, setColumnDefs] = useState([
    { 
      field: "employeeRollNo", 
      headerName: "ID",
      checkboxSelection: true,
      width: 110,
      pinned: 'left',
      cellStyle: { color: "#172554", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
    { 
      field: "name", 
      headerName: "Employee Name", 
      pinned:'left',
      width: 190,
      cellStyle: { color: "#172554", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
    { 
      field: "role", 
      headerName: "Role", 
      width: 140,
      cellStyle: { color: "#172554", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
    { 
      field: "date", 
      headerName: "Date", 
      editable: true,
      width: 150,
      cellStyle: { color: "#172554", fontSize: "13px", opacity: 0.6, fontWeight: 500, backgroundColor: '#e6f7ff' },
    },
    {
      field: "workDayStatus",
      headerName: "Work Day Status",
      width: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["LEAVE", "HALF_DAY", "FULL_DAY", "DOUBLE_DAY", "TRIPLE_DAY"],
      },
      editable: true,
      cellStyle: { 
        color: "#172554", 
        fontSize: "13px", 
        opacity: 0.6,
        fontWeight: 500,
        backgroundColor: '#e6f7ff'
      }
    },
    { 
      field: "amount", 
      headerName: "Amount", 
      width: 150, 
      editable: true,
      cellStyle: { 
        color: "#172554", 
        fontSize: "13px", 
        opacity: 0.6,
        fontWeight: 500,
        backgroundColor: '#e6f7ff'
      }
    },
    {
      field: "overtimeHours",
      headerName: "Overtime Hours",
      width: 150,
      editable: true,
      cellEditor: 'agSelectCellEditor', // Use the select cell editor
      cellEditorParams: {
        values: [0, 1, 2, 3, 4, 5, 6] // Options for the dropdown
      },
      cellStyle: { 
        color: "#172554", 
        fontSize: "13px", 
        opacity: 0.6,
        fontWeight: 500,
        backgroundColor: '#e6f7ff'
      }
    },    
    {
      field: "addAction",
      headerName: "Action",
      width: 100,
      cellRenderer: (params) => (
        <button
          onClick={() => handleAddAction(params)}
          style={{
            padding: '5px 10px',
            fontSize: '13px',
            borderRadius: '5px',
            backgroundColor: '#172554',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          +
        </button>
      ),
      pinned: 'right',
      cellStyle: { textAlign: 'center' }
    }
  ]);

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      resizable: true, 
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '95vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '90%', marginTop: "0px", marginBottom: '10px', height: '50px' }}>
        <h1 style={{ margin: 0, fontSize: '30px', color: '#172554' }}>Add Logs</h1>
        <div>
          <input 
            type="date" 
            id="date" 
            value={selectedDate} 
            onChange={handleDateChange} 
            style={{
              width: '200px',
              height: '40px',
              padding: '5px',
              fontSize: '15px',
              border: '1px solid #172554',
              borderRadius: '5px',
              color: '#172554'
            }}
          />
        </div>
      </div>

      <div className="ag-theme-quartz" style={{ height: 605, width: "90%", overflowX: 'auto', marginTop: '20px' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          pagination={true}
          paginationPageSize={12}
          rowHeight={38}
        />
      </div>
    </div>
  );
};

export default AddlogListForm;
