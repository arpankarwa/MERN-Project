import React from 'react'
import { Navigate } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';


export default function ProtectedRoute() {

  const isAuth = sessionStorage.getItem("studentData");

  return isAuth ? <Dashboard /> : <Navigate to={"/login"} />;

};