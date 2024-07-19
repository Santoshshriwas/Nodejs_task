const express = require("express")
const router = express.Router()
const usreController = require("../controllers/userController")


router.post("/adduser",usreController.UserInsert)

module.exports =router;