import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import Employee from "../../assets/icons/employee.png";
import AddLogs from "../../assets/icons/addlogs.png";
import Withdrawals from "../../assets/icons/withdrawals.png";
import WorkLogs from "../../assets/icons/worklogs.png";
import Logo from "../../assets/icons/GraceLogo2.png";
import Logo2 from "../../assets/icons/GraceLogo.png";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation(); 

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="sidebar-container">
      <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        
        {!isExpanded && <img className='logo2' src={Logo2} alt="Logo" />}
        {isExpanded && <img className='logo1' src={Logo} alt="Logo" />}
      
        <button onClick={toggleSidebar} className="toggle-button">
          {isExpanded ? '<' : '>'}
        </button>
        <nav>
          <ul>
            <li>
              <Link
                to="/employee"
                className={location.pathname === '/employee' ? 'active' : ''}
              >
                <img src={Employee} alt="Employee" />
                {isExpanded && <span>Employees</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/addlogs"
                className={location.pathname === '/addlogs' ? 'active' : ''}
              >
                <img src={AddLogs} alt="Add Logs" />
                {isExpanded && <span>Add Logs</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/withdrawals"
                className={location.pathname === '/withdrawals' ? 'active' : ''}
              >
                <img src={Withdrawals} alt="Withdrawals" />
                {isExpanded && <span>Withdrawals</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/worklogs"
                className={location.pathname === '/worklogs' ? 'active' : ''}
              >
                <img src={WorkLogs} alt="Work Logs" />
                {isExpanded && <span>Work Logs</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/loan"
                className={location.pathname === '/loan' ? 'active' : ''}
              >
                <img src={WorkLogs} alt="Loan" />
                {isExpanded && <span>Loan</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
