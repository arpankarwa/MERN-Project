var express = require('express');
var mysql = require('mysql');
var app = express();
var cors = require('cors');
const { body, validationResult } = require('express-validator');


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

//inserting data to database by registering
app.post('/register',

    [
        body('name').notEmpty().withMessage('name is necessary').isString().isAlpha().withMessage('name must be in alphabetical characters')
            .isLength({ min: 2 }).withMessage('please enter valid name with min 2 characters'),
        body('email').notEmpty().withMessage('email is necessary').isEmail().trim().normalizeEmail().toLowerCase()
            .withMessage('please enter valid email, should include(@ , . ) sign'),
        body('password').notEmpty().withMessage('password is necessary')
            .isStrongPassword({
                minLength: 8,
                minUppercase: 1,
                minLowercase: 1,
                minSymbols: 1,
                minNumbers: 1
            }).withMessage('password should contain min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol')
    ],

    (req, res) => {
        var newName = req.body.name;
        var newEmail = req.body.email;
        var newPassword = req.body.password;

        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("validation errors are present..please check your entered data\n", errors);
            res.status(400).send(errors);
        }
        else {
            mysqlConn.query('SELECT * FROM student WHERE email = ?', req.body.email, (err, result) => {

                if (result && result.length) {

                    res.status(400).send('This Email is already registered, Enter other email-id');
                    console.log('This Email is already registered, Enter other email-id\n', err);
                }
                else {

                    mysqlConn.query('INSERT INTO student(name, email, password) VALUES(?, ?, ?)',
                        [newName, newEmail, newPassword],
                        (err, rows) => {
                            if (!err) {
                                mysqlConn.commit(() => {
                                    res.status(200).send(rows);
                                    console.log("record inserted\n", rows);
                                });
                            } else {
                                res.status(400).send(err);
                                console.log("Error generated\n", err);
                            }
                        });
                }
            });
        }
    });

// --------------------------------------------------------------------------------------------------------

//signing in to database
app.post('/login', (req, res) => {

    var newEmail = req.body.email;
    var newPassword = req.body.password;

    mysqlConn.query('SELECT * FROM student WHERE email = ? AND password = ?',
        [newEmail, newPassword],
        (err, result) => {

            if (result && result.length) {

                res.status(200).send('Entered details are correct, login successful');
                console.log("Entered details are correct, login successful\n", result);
            } else {

                res.status(400).send({ message: 'Please enter correct login details' });
                console.log({ message: "Please enter correct login details\n" }, err);
            }
        })
});

// --------------------------------------------------------------------------------------------------------

//getting all students from database
app.get('/getAllStudents', (req, res) => {
    mysqlConn.query('SELECT * FROM student', (err, rows) => {
        if (!err) {
            mysqlConn.commit(() => {
                console.log(rows);
                res.send(rows)
            });
        } else {
            console.log(err);
            res.send(err)
        }
    })
});

// --------------------------------------------------------------------------------------------------------

//getting student by id
app.get('/getStudentById/:id', (req, res) => {
    mysqlConn.query('SELECT * FROM student where id = ?', req.params.id, (err, rows) => {

        if (!err) {
            mysqlConn.commit(() => {
                console.log(rows);
                res.send(rows);
            });
        } else {
            res.send("No record present", err);
            console.log("No record present", err);
        }
    });
});

// --------------------------------------------------------------------------------------------------------

//deleting student by id
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

//server port no
app.listen(port, () => {
    console.log(`server is running on port no ${port}`);
});

// ------------------------------------------------------------------------------------------------------------------------

app.get('/getStudentByEmail/:email', (req, res) => {
    mysqlConn.query('SELECT * FROM student where email = ?', req.params.email, (err, rows) => {

        if (!err) {
            mysqlConn.commit(() => {
                console.log(rows);
                res.send(rows);
            });
        } else {
            res.send("No record present", err);
            console.log("No record present", err);
        }
    });
});

// ----------------------------------------------------------------------------------------------------