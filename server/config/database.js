// // const mysql =require('mysql2');


// // const pool = mysql.createPool({
// //     connectionLimit: 100,
// //     host           : process.env.DB_HOST,
// //     user           : process.env.DB_USER,
// //     password       : process.env.DB_PASS,
// //     database       : process.env.DB_NAME
// // })
// // pool.getConnection((err, connection) => {
// //     if (err) {
// //       console.error('Error connecting to the database:', err);
// //       return;
// //     }
// //     console.log('Connected to the database');
// //     connection.release();
// //   });




// const mysql = require('mysql');
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME
// });

// // डेटाबेस से कनेक्ट करें
// connection.connect(err => {
//   if (err) {
//     console.error('डेटाबेस से कनेक्ट करते समय त्रुटि:', err);
//     return;
//   }
//   console.log('डेटाबेस से सफलतापूर्वक कनेक्ट हो गया है');
// });