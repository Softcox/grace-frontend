import React, { useState } from 'react';
import axios from '../../service/Axios';
import './WorklogForm.css'; 

const WorklogForm = () => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState(0); 
  const [date, setDate] = useState('');
  const [workDayStatus, setWorkDayStatus] = useState('LEAVE'); 
  const [overtimeHours, setOvertimeHours] = useState(0); 
  const [createdBy] = useState('Admin'); 
  const [updatedBy] = useState('Admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employeeError, setEmployeeError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleNameChange = async (e) => {
    const enteredName = e.target.value;
    setName(enteredName);

    if (enteredName) {
      setLoading(true);
      setEmployeeError(null);

      try {
        const response = await axios.get('/employee');
        
        const filteredSuggestions = response.data.filter(employee =>
          employee.name.toLowerCase().includes(enteredName.toLowerCase())
        );

        setSuggestions(filteredSuggestions);
      } catch (err) {
        setEmployeeError('Error fetching employee details');
        console.error('Error fetching employee details:', err);
      }
      setLoading(false);
    } else {
      setEmployeeId(0);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setName(suggestion.name);
    setEmployeeId(suggestion.id);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/worklog/create', {
        employeeId,
        date,
        workDayStatus,
        overtimeHours,
        createdBy, 
        updatedBy
      });
      console.log('Data submitted successfully:', response.data);
    } catch (err) {
      setError('Error submitting data');
      console.error('Error submitting data:', err);
    }
    setLoading(false);
  };

  const handleClear = () => {
    setName('');
    setEmployeeId(0);
    setDate('');
    setWorkDayStatus('LEAVE');
    setOvertimeHours(0); 
  };

  return (
    <div className="worklogform">
      <div className="container">
        <div className="header">
          <h3>Worklog Form</h3>
          <button className="close-button" onClick={() => window.location.href = '/worklogs'}>&times;</button>
        </div>
        <div className="body">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Employee Name:</label>
              <div className="suggestion-wrapper" style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter Employee Name"
                  className="input-field"
                />
                {suggestions.length > 0 && (
                  <ul className="suggestion-list">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="suggestion-item"
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="input-group">
              <label>Employee ID:</label>
              <input
                type="text"
                value={employeeId}
                readOnly
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label>Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label>Day Type:</label>
              <select
                value={workDayStatus}
                onChange={(e) => setWorkDayStatus(e.target.value)}
                className="input-field"
              >
                <option value="LEAVE">LEAVE</option>
                <option value="HALF_DAY">HALF_DAY</option>
                <option value="FULL_DAY">FULL_DAY</option>
                <option value="DOUBLE_DAY">DOUBLE_DAY</option>
                <option value="TRIPLE_DAY">TRIPLE_DAY</option>
              </select>
            </div>

            <div className="input-group">
              <label>Overtime Hours:</label>
              <select
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(Number(e.target.value))}
                className="input-field"
              >
                {[...Array(7).keys()].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="action">
              <button type="button" className="clear-button" onClick={handleClear}>Clear</button>
              <button type="submit" className="submit-button" onClick={() => window.location.href = '/worklogs'}>Submit</button>
            </div>
          </form>

          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}
          {employeeError && <p className="employee-error-message">{employeeError}</p>}
        </div>
      </div>
    </div>
  );
};

export default WorklogForm;
