import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../CSS folder/style.css'
import Swal from 'sweetalert2';

export default function Login() {

    let navigateTo = useNavigate();

    const goToRegister = () => navigateTo('/registration');

    const [student, setStudent] = useState({

        email: "",
        password: ""
    });


    const { email, password } = student;

    const handleChange = (e) => {

        const { name, value } = e.target
        setStudent({
            ...student,
            [name]: value
        })
    }

    const [error, setError] = useState(false);

    const handleLogin = async (e) => {

        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (email.length === 0 || password.length === 0) {

            setError(true);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please Login to proceed further!',
            })
        } else {
            await axios.post('http://localhost:4000/login', student)
                .then((result) => {
                    if (result) {

                        console.log("login successful, login details", result);

                        sessionStorage.clear();
                        sessionStorage.setItem("studentData", JSON.stringify(student.email));
                        navigateTo('/dashboard');

                        Swal.fire(
                            'Logged In Successfully',
                            'Dashboard is visible',
                            'success'
                        )
                    }
                })
        }
    }


    return (
        <>
            <div className="wrapper">
                <div className="inner">
                    <form>
                        <h3>Registration</h3>
                        <p><b>Login students here</b></p>

                        {
                            error && ((!student.email.includes('@')) || (!student.email.includes('.')) || (student.email === null)) ?
                                <h4><center className="dangerOrange">please enter registered email-id</center></h4> : ""
                        }
                        <label className="form-group">
                            <input type="email" name='email' value={student.email} className="form-control" onChange={handleChange} placeholder="Enter Email-id" required />
                        </label>

                        {
                            error && (student.password.length < 8 || (student.password === null)) ?
                                <h4><center className="dangerOrange">Please Enter registered password</center></h4> : ""
                        }
                        <label className="form-group">
                            <input type="password" name='password' value={student.password} className="form-control" onChange={handleChange} placeholder="Enter Password" required />
                        </label>

                        <button onClick={(e) => handleLogin(e)} >
                            Login
                            <i className="zmdi zmdi-arrow-right"></i>
                        </button>

                        <button onClick={goToRegister}>
                            Sign Up
                            <i className="zmdi zmdi-arrow-right"></i>
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}