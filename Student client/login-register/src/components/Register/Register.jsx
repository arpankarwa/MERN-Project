import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../CSS folder/style.css'
import Swal from 'sweetalert2';

export default function Register() {

	let navigateTo = useNavigate();

	const navTo = useNavigate();
	const gotToLogin = () => navTo('/login');

	const [student, setStudent] = useState({
		name: "",
		email: "",
		password: ""
	});

	// const { name, email, password } = student;

	const handleChange = (e) => {

		const { name, value } = e.target
		setStudent({
			...student,
			[name]: value
		})
	}

	// ---------------------------------------------------------------------------

	const [error, setError] = useState(false);
	const onSubmit = async (e) => {

		const { name, email, password } = student
		if (e && e.preventDefault) {
			e.preventDefault();
		}

		if (name.length === 0 || email.length === 0 || password.length === 0) {

			setError(true);
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Please Register to proceed further!',
			})
		} else {
			await axios.post('http://localhost:4000/register', student)
				.then((result) => {
					if (result) {

						console.log(`${student.name} registered successfully. Login to proceed further`);
						navigateTo("/login");

						Swal.fire(
							'Student registered',
							'Login to proceed further',
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
					<form onSubmit={(e) => onSubmit(e)} >
						<h3>Registration</h3>
						<p><b>FullStack Student Registration Web-App using MERN</b></p>

						{
							error && (student.name.length < 2 || student.name.length === 0) ?
								<h4><center className="dangerOrange">Name required with minimum 2 chars</center></h4>
								: ""
						}
						<label className="form-group">
							<input type="text" name='name' value={student.name} className="form-control" onChange={handleChange} placeholder="Enter Name" />
						</label>

						{
							error && (!student.email.includes('@') || (!student.email.includes('.')) || (student.email === null)) ?
								<h4><center className="dangerOrange">please enter valid email, should include(@, .) sign</center></h4>
								: ""
						}
						<label className="form-group">
							<input type="email" name='email' value={student.email} className="form-control" onChange={handleChange} placeholder="Enter Email-id" />
						</label>

						{
							error && (student.password.length < 8 || (student.password === null)) ?
								<h4><center className="dangerOrange">password should include min 8 chars-upper,lower,number,symbol</center></h4>
								: ""
						}
						<label className="form-group" >
							<input type="password" name='password' value={student.password} className="form-control" onChange={handleChange} placeholder="Enter Password" />
						</label>

						<button >
							Sign Up
							<i className="zmdi zmdi-arrow-right"></i>
						</button>
						<button onClick={gotToLogin} >
							Login
							<i className="zmdi zmdi-arrow-right"></i>
						</button>
					</form>
				</div>
			</div>
		</>
	)
}
