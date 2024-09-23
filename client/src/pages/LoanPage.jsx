import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { LoanList } from '../components/loan/LoanList'
import LoanForm from '../components/loan/LoanForm'

export const LoanPage = () => {
  return (
    <Routes>
        <Route path='/' element={<LoanList />} />
        <Route path='/add' element={<LoanForm />} />
    </Routes>
  )
}
