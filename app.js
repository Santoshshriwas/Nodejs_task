// const path = require ("path");
// const mysql =require('mysql2');
// const express = require ("express");
// const bodyParser = require ("body-parser");
// const {engine} = require("express-handlebars");

// // const userRoute = require("./server/routes/userRoute.js")

// const app = express();
// app.use(express.static('public'));
// require("dotenv").config();

// // app.use("/user",userRoute)





// const pool = mysql.createPool({
//     connectionLimit: 100,
//     host           : process.env.DB_HOST,
//     user           : process.env.DB_USER,
//     password       : process.env.DB_PASS,
//     database       : process.env.DB_NAME
// })
// pool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error connecting to the database:', err);
//       return;
//     }
//     console.log('Connected to the database');
//     connection.release();
//   });



//   app.post("/user/insert",(req,res)=>{
//     try {
//       // const q="INSERT INTO `menegone`.`user` ( `name`, `email`, `mobile`) VALUES (?)";
//       const sql='INSERT INTO user (name, email, mobile) VALUES (?, ?, ?)';
//       const values=req.body;
//       console.log(values);
//       pool.query(sql,[values],(err,data)=>{
//           if (err) return res.json(err);
//           return res.json("User has been created");
//       })
      
//   } catch (error) {
//       console.log(error)
//   }
//   })







// const PORT = process.env.PORT || 5001

// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());

// app.listen(PORT, ()=>{
//   console.log(`Server is Running on ${PORT}`);
// })




require('dotenv').config();
const xlsx = require('xlsx');
const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const {engine} = require('express-handlebars');

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('डेटाबेस से कनेक्ट करते समय त्रुटि:', err);
    return;
  }
  console.log('database con');
  fetchData()
});

app.get('/', (req, res) => {
  res.render('home');
});



app.post('/user', (req, res) => {
  const { name, email, mobile } = req.body;

  // Validate required fields
  if (!name || !email || !mobile) {
    return res.status(400).send('Name, email, and mobile fields are required');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email address');
  }

  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile)) {
    return res.status(400).send('Invalid mobile number');
  }

  // Insert into the database
  const sql = 'INSERT INTO user (name, email, mobile) VALUES (?, ?, ?)';
  connection.query(sql, [name, email, mobile], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Database error');
    }
    res.send(`User ${name} inserted successfully`);
  });
});

app.get("/find",(req,res)=>{
  const sql = 'SELECT * FROM user';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("error",err)
      return res.status(500).send('डेटाबेस त्रुटि');
      }
      res.send(results);
      });
})


app.post('/task', (req, res) => {
  const { task_name, username, task_status } = req.body;
  if (!task_name || !username || !task_status) {
    return res.status(400).send('task_name, username, and task_status fields are required');
  }

  const sql = 'INSERT INTO tasks (task_name, username, task_status) VALUES (?, ?, ?)';
  connection.query(sql, [task_name, username, task_status], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Database error');
    }
    res.send(`Task '${task_name}' for user '${username}' with status '${task_status}' inserted successfully`);
  });
});


app.get('/tasks/find', (req, res) => {
  const sql = 'SELECT * FROM tasks';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});




function fetchData() {
  connection.query('SELECT * FROM user', (err, user) => {
    if (err) {
      console.error('Error fetching user data:', err);
      return;
    }
    connection.query('SELECT * FROM tasks', (err, tasks) => {
      if (err) {
        console.error('Error fetching task data:', err);
        return;
      }
      convertToExcel(user, tasks);
    });
  });
}
function convertToExcel(user, tasks) {
  const wb = xlsx.utils.book_new();
  const userSheet = xlsx.utils.json_to_sheet(user);
  const taskSheet = xlsx.utils.json_to_sheet(tasks);

  xlsx.utils.book_append_sheet(wb, userSheet, 'User');
  xlsx.utils.book_append_sheet(wb, taskSheet, 'Tasks');


  xlsx.writeFile(wb, 'data.xlsx');
  console.log('Excel file created successfully');
}


app.listen(5001, () => {
  console.log('server on 5001');
});






