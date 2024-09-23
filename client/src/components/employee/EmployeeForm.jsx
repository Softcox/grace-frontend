import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../service/Axios'; 
import './EmployeeForm.css';

const EmployeeForm = ({ onAddEmployee }) => {
  const [formData, setFormData] = useState({
    employeeRollNo: '',
    name: '',
    role: '',
    phone: '',
    salaryPerDay: '',
    overtimePerHour: '',
    createdBy: 'Admin',
    updatedBy: 'Admin'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/employee/create', formData);
      if (response.status === 200 || response.status === 201) {
        onAddEmployee(response.data); 
        navigate('/employee'); 
      }
    } catch (error) {
      console.error('Error creating employee', error);
    }
    handleClear();
  };

  const handleClear = () => {
    setFormData({
      employeeRollNo: '',
      name: '',
      role: '',
      phone: '',
      salaryPerDay: '',
      overtimePerHour: '',
      createdBy: 'admin',
      updatedBy: 'admin'
    });
  };

  const handleClose = () => {
    navigate('/employee');
  };

  return (
    <div className='employeeform'>
      <div className="container">

          
          <div className="header">
            <h3>Add New Employee</h3>
            <button className="close-button" onClick={handleClose}>X</button>
          </div>

          <form onSubmit={handleSubmit} className='body'>

            <div className="employee_id_name">

                <div className="employeeid">

                    <label>Employee ID</label>
                      <input
                        type="text"
                        name="employeeRollNo"
                        value={formData.employeeRollNo}
                        onChange={handleChange}
                        placeholder='GE102'
                        required
                      />

                    </div>

                    <div className="employeename">

                    <label>Employee Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Arivanan Vamathevan'
                        required
                      />

                </div>

            </div>

            <div className="employee_role_phoneno">

                <div className="role">

                  <label>Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Trainee Engineer</option>
                      <option value="Carpenter">Carpenter</option>
                      <option value="Bar Bender">Bar Bender</option>
                      <option value="Painter">Painter</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Mason">Mason</option>
                      <option value="Labour">Labour</option>
                    </select>

                  </div>

                  <div className="phoneno">

                  <label>Phone No</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder='0772244481'
                      required
                    />

              </div>


            </div>

            <div className="employee_salaryperday_overtimeperhour">

                <div className="salaryperday">

                    <label>Salary Per Day</label>
                      <input
                        type="number"
                        name="salaryPerDay"
                        value={formData.salaryPerDay}
                        onChange={handleChange}
                        placeholder='1000 LKR'
                        required
                      />

                    </div>

                    <div className="overtimeperhour">

                    <label>Overtime Per Hour</label>
                      <input
                        type="number"
                        name="overtimePerHour"
                        value={formData.overtimePerHour}
                        onChange={handleChange}
                        placeholder='200 LKR'
                        required
                      />

                </div>

            </div>

            <div className="action">

              {/* <button
                  type="button"
                  onClick={handleClear}
                  className="clear-button"
                >
                  Clear
                </button> */}
                <button
                  type="submit"
                  className="submit-button"
                >
                  Add
              </button>

            </div>
              
          </form>

      </div>
    </div>
  );
};

export default EmployeeForm;
