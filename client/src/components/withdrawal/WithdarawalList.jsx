import React, { useState, useMemo, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import axios from '../../service/Axios'; 

const WithdrawalList = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedRowCount, setSelectedRowCount] = useState(0);
  const navigate = useNavigate();
  const gridApiRef = useRef(null);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await axios.get('/transaction'); 
        setRowData(response.data);
      } catch (error) {
        console.error('Error fetching withdrawals', error);
      }
    };
    fetchWithdrawals();
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    { 
      field: "id", 
      headerName: "ID",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 90,
      pinned: 'left',
      cellEditor: "agSelectCellEditor",
      cellStyle: { color: "#172554;", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
    { 
      field: "date", 
      headerName: "Date", 
      width: 170, 
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (filterDate, cellValue) => {
          const dateAsString = cellValue;
          if (dateAsString == null) return -1;
          const cellDate = new Date(dateAsString);
          if (cellDate < filterDate) return -1;
          else if (cellDate > filterDate) return 1;
          else return 0;
        },
        browserDatePicker: true,
      },
      cellStyle: { color: "#172554;", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
    { 
      field: "amount", 
      headerName: "Amount", 
      width: 150, 
      cellStyle: { color: "#172554;", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
    { 
      field: "createdBy", 
      headerName: "Created By", 
      width: 150, 
      cellStyle: { color: "#172554;", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    },
    { 
      field: "updatedBy", 
      headerName: "Updated By", 
      width: 150, 
      cellStyle: { color: "#172554;", fontSize: "13px", opacity: 0.6, fontWeight: 500 }
    }
  ]);

  const defaultColDef = useMemo(() => ({
    filter: "agTextColumnFilter",
    floatingFilter: true,
    resizable: true,
  }), []);

  const onGridReady = params => {
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const handleSelectionChanged = () => {
    if (gridApiRef.current) {
      const selectedNodes = gridApiRef.current.getSelectedNodes();
      setSelectedRowCount(selectedNodes.length);
    }
  };

  const handleDelete = async () => {
    const selectedNodes = gridApiRef.current.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);

    if (selectedData.length === 0) {
      alert("Please select at least one row to delete.");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete ${selectedData.length} item(s)?`);
    if (!confirmed) return;

    try {
      const deleteRequests = selectedData.map(item =>
        axios.delete(`/transaction/${item.id}`)
      );

      await Promise.all(deleteRequests);

      const remainingData = rowData.filter(row => !selectedData.some(selected => selected.id === row.id));
      setRowData(remainingData);
      setSelectedRowCount(0); 
    } catch (error) {
      console.error('Error deleting withdrawals', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '95vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '90%', marginTop: "0px", marginBottom: '10px', height: '50px' }}>
        <h1 style={{ margin: 0, fontSize: '30px', color: '#172554' }}>Withdrawal Details</h1>
        <div>
          <button
            onClick={() => navigate('/withdrawals/add')}
            style={{
              border: '1px solid #172554',
              borderRadius: '13px',
              fontSize: '15px',
              cursor: 'pointer',
              width: '200px',
              height: '50px',
              backgroundColor: '#172554',
              color: '#fff',
              marginRight: '10px'
            }}
          >
            + Add New Withdrawal
          </button>
          {selectedRowCount > 0 && (
            <button
              onClick={handleDelete}
              style={{
                border: '1px solid #e74c3c',
                borderRadius: '13px',
                fontSize: '15px',
                cursor: 'pointer',
                width: '200px',
                height: '50px',
                backgroundColor: '#e74c3c',
                color: '#fff'
              }}
            >
              Delete Selected
            </button>
          )}
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
          onGridReady={onGridReady}
          onSelectionChanged={handleSelectionChanged} 
        />
      </div>
    </div>
  );
};

export default WithdrawalList;
