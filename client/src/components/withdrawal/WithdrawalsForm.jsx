import React, { useState } from 'react';
import axios from '../../service/Axios'; 
import './WithdrawalsForm.css'; 

const WithdrawalsForm = () => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [createdBy, setCreatedBy] = useState('Admin');
  const [updatedBy, setUpdatedBy] = useState('Admin');
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
      setEmployeeId('');
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
      const response = await axios.post('/transaction', {
        employeeId,
        date,
        amount,
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

  return (
    <div className="withdrawalform">
      <div className="container">
        <div className="header">
          <h3>Withdrawal Form</h3>
          <button className="close-button" onClick={() => window.location.href = '/withdrawals'}>&times;</button>
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
              <label>Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Amount"
                className="input-field"
              />
            </div>

            <div className="action">
              <button type="button" className="clear-button" onClick={() => window.location.reload()}>Clear</button>
              <button type="submit" className="submit-button" onClick={() => window.location.href = '/withdrawals'}>Submit</button>
            </div>
          </form>

          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {employeeError && <p>{employeeError}</p>}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalsForm;
