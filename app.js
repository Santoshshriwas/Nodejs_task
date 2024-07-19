const path = require ("path");
const mysql =require('mysql2');
const express = require ("express");
const bodyParser = require ("body-parser");
const {engine} = require("express-handlebars");

const userRoute = require("./server/routes/userRoute.js")

const app = express();
app.use(express.static('public'));
require("dotenv").config();

app.use("/user",userRoute)





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









const PORT = process.env.PORT || 5001

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.listen(PORT, ()=>{
  console.log(`Server is Running on ${PORT}`);
})