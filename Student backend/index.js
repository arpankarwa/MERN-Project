var express = require('express');
var mysql = require('mysql');
var app = express();
var cors = require('cors');
const { body, validationResult } = require('express-validator');

// const { } = require('express-validator');

const port = process.env.PORT || 4000;

var router = express.Router();
app.use(express.json());
app.use(cors());

const mysqlConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'student_register'
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
            res.send("No record present", err)
            console.log("No record present", err);
        }
    })
});

// --------------------------------------------------------------------------------------------------------

app.post('/register',

    [
        body('name').not().isEmpty().isLength({ min: 2 })
            .withMessage('please enter valid name with min 2 characters'),
        body('email').not().isEmpty().isEmail().trim().normalizeEmail().toLowerCase()
            .withMessage('please enter valid email, should include @ sign and in lowercase'),
        body('password').not().isEmpty().isLength({ min: 6 })
            .withMessage('password should contain min 4 characters, 2 lowercase, 1 number, 1 symbol')
    ],

    (req, res) => {
        var newName = req.body.name;
        var newEmail = req.body.email;
        var newPassword = req.body.password;

        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("validation errors present ", errors);
            res.send(errors);
        }
        else {
            mysqlConn.query('SELECT * FROM student WHERE email = ?', req.body.email, (err, result) => {

                if (result && result.length) {

                    res.status(400).send('This Email is already registered, Enter other email-id');
                    console.log('This Email is already registered, Enter other email-id');
                }
                else {

                    mysqlConn.query('INSERT INTO student(name, email, password) VALUES(?, ?, ?)',
                        [newName, newEmail, newPassword],
                        (err, rows) => {
                            if (!err) {
                                mysqlConn.commit(() => {
                                    res.send(rows);
                                    console.log("record inserted", rows);
                                });
                            } else {
                                res.send(err);
                                console.log("Error generated", err);
                            }
                        });
                }
            });
        }
    });

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
                res.status(400).send({ message: 'Please enter correct login details' });
                console.log({ message: "Please enter correct login details" }, err);
            }
        })
});

// --------------------------------------------------------------------------------------------------------

app.get('/getAllStudents', (req, res) => {
    mysqlConn.query('SELECT * FROM student', (err, rows) => {
        if (!err) {
            console.log(rows);
            res.send(rows)
        } else {
            console.log(err);
            res.send(err)
        }
    })
});

// --------------------------------------------------------------------------------------------------------

app.delete('/deleteStudentById/:id', (req, res) => {
    mysqlConn.query('DELETE FROM student WHERE id = ?', req.params.id, (err, rows) => {
        if (!err) {
            mysqlConn.commit(() => {
                console.log(rows);
                res.send(rows)
            })
        } else {
            console.log(err);
            res.send(err)
        }
    })
});

// --------------------------------------------------------------------------------------------------------

app.listen(port, () => {
    console.log(`server is running on port no ${port}`);
});

// ------------------------------------------------------------------------------------------------------------------------

// app.get('/logout', (req, res) => {
//     res.redirect('/');
// });

// ------------------------------------------------------------------------------------------------------------------------
