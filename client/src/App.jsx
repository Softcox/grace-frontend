import React from 'react';
import './components/sidebar/Sidebar.css';
import Sidebar from './components/sidebar/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeePage from './pages/EmployeePage';
import { WithdrawalsPage } from './pages/WithdrawalsPage';
import { WorklogPage } from './pages/WorklogPage';
import { AddlogPage } from './pages/AddlogPage';
import { LoanPage } from './pages/LoanPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/employee/*" element={<EmployeePage />} />
            <Route path='/withdrawals/*' element = {<WithdrawalsPage />} />
            <Route path='/worklogs/*' element = {<WorklogPage />} />
            <Route path='/addlogs/*' element = {<AddlogPage />} />
            <Route path='/loan/*' element = {<LoanPage />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

