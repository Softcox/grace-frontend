import React from 'react'
import { Route, Routes } from 'react-router-dom'
import WithdrawalList from '../components/withdrawal/WithdarawalList'
import WithdrawalsForm from '../components/withdrawal/WithdrawalsForm'

export const WithdrawalsPage = () => {
  return (
    <Routes>
        <Route path='/' element={<WithdrawalList />} />
        <Route path='/add' element={<WithdrawalsForm />} />
    </Routes>
  )
}
