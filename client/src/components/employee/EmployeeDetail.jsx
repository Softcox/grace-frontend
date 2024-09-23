import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../service/Axios'; 
import './EmployeeDetail.css';
import ReactToPrint from 'react-to-print';

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const componentRef = useRef();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`/employee/${id}`);
        setEmployee(response.data);
      } catch (err) {
        setError('Failed to fetch employee details');
      } finally {
        setLoading(false);  
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="employee-container" ref={componentRef}>

      <div className="employee-details">

          <h2>{employee.employeeRollNo} - {employee.name}</h2>

          {employee ? (
            <table>
              <tbody>

                <div className="personal-details">

                    <div className="personal-details-head">
                      <h3>Personal details</h3>
                      <button>Edit</button>  
                    </div>

                    <div className="personal-details-body">

                    <div className="id_role">

                        <tr>
                          <th>Employee ID</th>
                          <td>{employee.employeeRollNo}</td>
                        </tr>

                        <tr>
                          <th>Role</th>
                          <td>{employee.role}</td>
                        </tr>

                    </div>

                    <div className="name_phone">

                        <tr>
                          <th>Employee Name</th>
                          <td>{employee.name}</td>
                        </tr>

                        <tr>
                          <th>Phone no</th>
                          <td>{employee.phone}</td>
                        </tr>

                        </div>

                    </div>

                </div>

                <div className="personal-details">

                    <div className="personal-details-head">
                      <h3>Work Detail</h3>
                      <button>Edit</button>  
                    </div>

                    <div className="personal-details-body">

                    <div className="id_role">

                      <tr>
                        <th>Total Basic Salary</th>
                        <td>{employee.totalBasicSalary} LKR</td>
                      </tr>

                      <tr>
                        <th>Overtime Per Hour</th>
                        <td>{employee.overtimePerHour} LKR</td>
                      </tr>

                    </div>

                    <div className="name_phone">

                      <tr>
                        <th>Salary Per Day</th>
                        <td>{employee.salaryPerDay} LKR</td>
                      </tr>

                    </div>

                    </div>

                </div>

                    

                <div className="personal-details">

                  <div className="personal-details-head">
                  <h3>Salary Detail</h3>
                  <button>Edit</button>
                  </div>

                  <div className="personal-details-body">

                    <div className="id_role">

                      <tr>
                        <th>Total Overtime Salary</th>
                        <td>{employee.totalOvertimeSalary} LKR</td>
                      </tr>

                      <tr>
                        <th>Total Payable Salary</th>
                        <td>{employee.totalPayableSalary} LKR</td>
                      </tr>


                    </div>

                    <div className="name_phone">

                      <tr>
                        <th>Total Withdrawal</th>
                        <td>{employee.totalWithdrawal} LKR</td>
                      </tr>

                    </div>

                  </div>

                </div>
                
                  <div className="personal-details">

                    <div className="date">

                      <tr>
                        <th>Created</th>
                        <p className='create'>
                          <td className='by'>By {employee.createdBy}</td> <span> on </span>
                          <td className='create-date'>{new Date(employee.createdDateTime).toLocaleDateString()}</td>
                        </p>     
                      </tr>

                      <tr>
                        <th>Updated</th>
                        <p className='create'>
                          <td className='by'>By {employee.updatedBy} </td> <span>on</span>
                          <td className='create-date'>{new Date(employee.updatedDateTime).toLocaleDateString()}</td>
                        </p>    
                      </tr>
                    
                    </div>

                  </div>

                  
             
                
              </tbody>
            </table>
          ) : (
            <p>Employee not found</p>
          )}
          </div>

      </div>

      
    
  );
};

export default EmployeeDetail;


  {/* <ReactToPrint
        trigger={() => <button>Print</button>}
        content={() => componentRef.current}
        documentTitle='Employee Details'
        pageStyle="print"
      /> */}