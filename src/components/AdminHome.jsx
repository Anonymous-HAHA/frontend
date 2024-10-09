import React from 'react'
import AdminFooterComponent from './Footer/AdminFooterComponent'
import { Outlet } from 'react-router-dom'

function AdminHome() {

  return (
    <div >
      <Outlet />
      <AdminFooterComponent></AdminFooterComponent>
    </div>
  )
}

export default AdminHome



