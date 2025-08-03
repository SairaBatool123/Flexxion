import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../UI/Header'
import Footer from '../UI/Footer'

function AppLayout() {
  return (
    <>
    <Header />
    <Outlet/>
    <Footer />
    </>
  )
}

export default AppLayout