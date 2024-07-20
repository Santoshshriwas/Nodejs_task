const mysql = require ("../config/database.js")


const UserInsert= async(req,res)=>{
  try {
      const q="INSERT INTO `menegone`.`user` ( `name`, `email`, `mobile`) VALUES (?)";
      const values=[
          req.body.name,
          req.body.email,
          req.body.mobile,
      ];
      mysql.query(q,[values],(err,data)=>{
          if (err) return res.json(err);
          return res.json("User has been created");
      })
      
  } catch (error) {
      console.log(error)
  }
}



const UserDisplay= async(req,res)=>{
  try {
      db.query("select * from user",[],(err,result,fields)=>{
          if(err){
              return console.log(err);
          }
          return res.send(result)
      })      
  } catch (error) {
      console.log(error)
  }
}






module.exports={

  UserInsert,

  UserDisplay,
}