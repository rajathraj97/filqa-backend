const express = require('express')
const cors = require('cors')
const configureDB = require("./DB/configureDB")
const userController = require('./Controllers/UserController')
const Authorization = require('./Middleware/Autorization')
require('dotenv').config()


configureDB()
const app = express()

app.use(express.json())
app.use(cors())

//USER API
app.post('/api/register',userController.register)
app.post('/api/login',userController.login)
app.post('/api/verifyotp',userController.verify)
app.post('/api/forgotpassword',userController.forgotpassword)
app.patch('/api/updatepassword',userController.updatepassword)
app.get('/api/getusers',userController.get)
app.patch('/api/update',Authorization,userController.updateData)

app.listen(process.env.PORT,()=>{
    console.log(`listening on port :${process.env.PORT}`)
})



