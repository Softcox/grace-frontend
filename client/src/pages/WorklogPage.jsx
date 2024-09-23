import React from 'react'
import { Route, Routes } from 'react-router-dom'
import WorklogList from '../components/worklog/WorklogList'
import WorklogForm from '../components/worklog/WorklogForm'

export const WorklogPage = () => {
  return (
    <Routes>
        <Route path='/' element={<WorklogList />} />
        <Route path='/add' element ={<WorklogForm />} />
    </Routes>
  )
}
