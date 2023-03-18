import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../CSS folder/style.css'
import Swal from 'sweetalert2';


export default function Dashboard() {

  let navigateTo = useNavigate();

  const [student, setStudent] = useState([]);

  const getStudentDetails = async (email) => {

    // e.preventDefault();

    await axios.get('http://localhost:4000/getAllStudents')
      .then((result) => {
        console.log("fetched student details", result.data);
        setStudent(result.data);

        sessionStorage.getItem("studentData");
      });
  }

  useEffect(() => {
    getStudentDetails();
  }, []);

  const handleLogout = () => {
    // e.preventDefault();

    // session storage manage
    if (sessionStorage.getItem("studentData")) {
      sessionStorage.clear();
      navigateTo('/');

      Swal.fire('Student logged out..');
      Swal.getPopup();
    }
    else {
      navigateTo('/');
    }

  };



  return (
    <>
      <div className="wrapper">
        <div className="inner">
          <form>
            <h3> Dashboard for Student </h3>
            <p>
              <b>Students need to login to get here</b><br />
              <b>This is Landing page for <i className='userData'>{JSON.parse(sessionStorage.getItem("studentData"))}</i></b>
            </p>

            <div align='center'>
              <table>
                <thead>
                  <tr>
                    <td colSpan={3} align='center'><b><u>All Student details</u></b></td>
                  </tr>
                </thead>
                <tbody>
                  <tr className='design'>
                    <td>Id</td>
                    <td>Name</td>
                    <td>Email</td>
                  </tr>

                  {student.map((stud, index) => (

                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{stud.name}</td>
                      <td>{stud.email}</td>
                    </tr>

                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={handleLogout}>Logout</button>
          </form>
        </div>
      </div>
    </>

  )
}
