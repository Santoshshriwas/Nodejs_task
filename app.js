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
const path = require("path")

const app = express();

app.engine('handlebars', engine({
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views/partials')
}));
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



app.get('/userinsert', (req, res) => {
  res.render('userinsert', { title: 'Insert User' });
});

app.get('/userdisplay', (req, res) => {
  const sql = 'SELECT * FROM user';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("error", err);
      return res.status(500).send('Database error');
    }
    res.render('userdisplay', { title: 'Display Users', users: results });
  });
});
app.post('/users/insert', (req, res) => {
  const { name, email, mobile } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).send('Name, email, and mobile fields are required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email address');
  }

  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile)) {
    return res.status(400).send('Invalid mobile number');
  }

  const sql = 'INSERT INTO user (name, email, mobile) VALUES (?, ?, ?)';
  connection.query(sql, [name, email, mobile], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Database error');
    }
    res.send(`User ${name} inserted successfully`);
  });
});


app.get('/taskinsert', (req, res) => {
  const userQuery = 'SELECT name FROM user';
  connection.query(userQuery, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Database error');
    }

    // Map user names to an array for Handlebars
    const users = results.map(user => ({ name: user.name }));
    res.render('taskinsert', { title: 'Insert Task', users });
  });
});
app.post('/tasks/insert', async (req, res) => {
  try {
    const { name, task, status } = req.body;
    if (!name || !task || !status) {
      return res.status(400).json({ error: 'Name, task, and status fields are required' });
    }
    const validStatuses = ['Pending', 'In Progress', 'Complete'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid task status' });
    }
    const userQuery = 'SELECT name FROM user WHERE name = ?';
    connection.query(userQuery, [name], (err, results) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ error: 'Failed to check user' });
      }
      if (results.length === 0) {
        return res.status(400).json({ error: 'User does not exist' });
      }
      const q = "INSERT INTO demo (name, task, status) VALUES (?, ?, ?)";
      const values = [name, task, status];

      connection.query(q, values, (err, results) => {
        if (err) {
          console.error('Error inserting task:', err);
          return res.status(500).json({ error: 'Failed to insert task' });
        }
        return res.status(201).json({ message: 'Task has been created successfully' });
      });
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

app.get('/taskdisplay', (req, res) => {
  const sql = 'SELECT * FROM demo';
  
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).send('Database error');
    }
    
    res.render('taskdisplay', { title: 'Display Tasks', tasks: results });
  });
});
















app.get('/export', (req, res) => {
  fetchData(res);
});

function fetchData() {
  connection.query('SELECT * FROM user', (err, User) => {
    if (err) {
      console.error('Error fetching user data:', err);
      return;
    }
    connection.query('SELECT * FROM demo', (err, Tasks) => {
      if (err) {
        console.error('Error fetching task data:', err);
        return;
      }
      convertToExcel(User, Tasks);
    });
  });
}
function convertToExcel(User, Tasks) {
  const wb = xlsx.utils.book_new();
  const userSheet = xlsx.utils.json_to_sheet(User);
  const taskSheet = xlsx.utils.json_to_sheet(Tasks);

  xlsx.utils.book_append_sheet(wb, userSheet, 'User');
  xlsx.utils.book_append_sheet(wb, taskSheet, 'Tasks');


  xlsx.writeFile(wb, 'hacker.xlsx');
  console.log('Excel file created successfully');
}


app.listen(5001, () => {
  console.log('server on 5001');
});










// CREATE TABLE demo (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   task VARCHAR(255) NOT NULL,
//   status ENUM('Pending', 'In Progress', 'Complete') NOT NULL,
//   FOREIGN KEY (name) REFERENCES user(name)
// );

