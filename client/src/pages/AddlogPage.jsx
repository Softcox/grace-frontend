import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import AddlogListForm from '../components/addlogs/AddlogListForm'

export const AddlogPage = () => {
  return (
    <Routes>
        <Route path='/' element ={<AddlogListForm />} />
    </Routes>
    
  )
}
