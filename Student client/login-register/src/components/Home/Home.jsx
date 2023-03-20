import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../CSS folder/style.css'


export default function Home() {

  let navigateTo = useNavigate();

  const goToRegister = () => navigateTo('/registration');

  const goToLogin = () => navigateTo('/login');

  return (
    <>
      <div className="wrapper">
        <div className="inner">
          <form>
            <h3>Home Page</h3>
            <p><b>Home Page for Student</b></p>

            <button onClick={goToRegister}>
              Sign Up
              <i className="zmdi zmdi-arrow-right"></i>
            </button>
            <button onClick={goToLogin} >
              Login
              <i className="zmdi zmdi-arrow-right"></i>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
