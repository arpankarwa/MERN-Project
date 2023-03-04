var express = require('express');
var mysql = require('mysql');
var app = express();
var cors = require('cors');
// const { body, validationResult } = require('express-validator');

const {signupValidator} = require('./validation')
const { validationResult } = require('express-validator');

const port = 4000;

var router = express.Router();
app.use(express.json());
app.use(cors());

const mysqlConn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'student_register'
});

mysqlConn.connect((err) => {
    if (!err) {
        console.log("connection with database is successful...");
    } else {
        console.log("connection with database failed due to some error");
    }
});
// --------------------------------------------------------------------------------------------------------

app.get('/getStudentById/:id', (req, res) => {
    mysqlConn.query('SELECT * FROM student where id = ?', req.params.id, (err, rows) => {

        if (!err) {
            res.send(rows)
            console.log(rows);
        } else {
            res.send("No record present",err)
            console.log("No record present",err);
        }
    })
});

// --------------------------------------------------------------------------------------------------------

// app.post('/register', (req, res) => {

//     var newName = req.body.name;
//     var newEmail = req.body.email;
//     var newPassword = req.body.password;

//     mysqlConn.query('SELECT * FROM student WHERE email = ?', req.body.email, (err, result) => {

//         if(result && result.length) {

//             res.status(400).send('This Email is already registered, Enter other email-id');
//             console.log('This Email is already registered, Enter other email-id');
//         }
//         else {

//             mysqlConn.query('INSERT INTO student(name, email, password) VALUES(?, ?, ?)',
//                 [newName, newEmail, newPassword], (err, rows) => {
//                 if (!err) {
//                     mysqlConn.commit(() => {
//                         res.send(rows)
//                         console.log("record inserted",rows);
//                     });
//                 } else {
//                     res.send(err)
//                     console.log("Error generated", err);
//                 }
//             });
//         }
//     });
// });

// --------------------------------------------------------------------------------------------------------

app.post('/login', (req, res) => {

    var newEmail = req.body.email;
    var newPassword = req.body.password;

    mysqlConn.query('SELECT * FROM student WHERE email = ? AND password = ?', 
            [newEmail, newPassword],
            (err, result) => {

                if (result && result.length) {
                    
                    res.send('Entered details are correct, login successful');
                    console.log("Entered details are correct, login successful", result);
                } else {
                    res.status(400).send({message : 'Please enter correct login details'});
                    console.log({message : "Please enter correct login details"}, err);
                }
            })
});

// --------------------------------------------------------------------------------------------------------

app.get('/getAllStudents', (req, res) => {
    mysqlConn.query('SELECT * FROM student', (err, rows) => {
        if(!err){
            console.log(rows);
            res.send(rows)
        } else {
            console.log(err);
            res.send(err)
        }
    })
})

// --------------------------------------------------------------------------------------------------------

app.delete('/deleteStudentById/:id', (req, res) => {
    mysqlConn.query('DELETE FROM student WHERE id = ?', req.params.id, (err, rows) => {
        if(!err){
            mysqlConn.commit(() => {
                console.log(rows);
                res.send(rows)
            })
        } else {
            console.log(err);
            res.send(err)
        }
    })
})

// --------------------------------------------------------------------------------------------------------

app.listen(port, () => {
    console.log(`server is running on port no ${port}`);
});

// ------------------------------------------------------------------------------------------------------------------------



app.post('/register', signupValidator, function(req, res) {

    var newName = req.body.name;
    var newEmail = req.body.email;
    var newPassword = req.body.password;

    mysqlConn.query('SELECT * FROM student WHERE email = ?', req.body.email, (err, result) => {

        if(result && result.length) {

            res.status(400).send('This Email is already registered, Enter other email-id');
            console.log('This Email is already registered, Enter other email-id');
        }
        else {

            mysqlConn.query('INSERT INTO student(name, email, password) VALUES(?, ?, ?)',
                [ newName, email, password ], 
                (err, rows) => {
                    const error = validationResult(req);

                    if (error) {
                        console.log(error);
                        res.send(error);
                    } else {
                        console.log(rows);
                        res.send(rows);
                    }
                // if (!err) {
                //     mysqlConn.commit(() => {
                //         res.send(rows)
                //         console.log("record inserted",rows);
                //     });
                // } else {
                //     res.send(err)
                //     console.log("Error generated", err);
                // }
            });
        }
    });
});


// body('name').isLength({min : 4}), 
//                  body('email').isEmail().message('Please enter valid email'), 
//                  body('password').isStrongPassword({
//                     minLength : 6,
//                     minLowercase : 3,
//                     minUppercase : 1,
//                     minNumbers : 1,
//                     minSymbols : 1
//                  })