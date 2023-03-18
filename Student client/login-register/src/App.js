import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home.jsx'
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/Protected Route/ProtectedRoute';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          <Route exact path='/' element={<Home />} />

          <Route exact path='/registration' element={<Register />} />

          <Route exact path='/login' element={<Login />} />

          <Route path='/' element={<ProtectedRoute />} >
            <Route exact path='/dashboard' element={<Dashboard />} />
          </Route>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
