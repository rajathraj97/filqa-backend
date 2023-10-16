const express = require('express')
const cors = require('cors')
const configureDB = require("./DB/configureDB")
const userController = require('./Controllers/UserController')
const Authorization = require('./Middleware/Autorization')
const multer  = require('multer')

require('dotenv').config()


configureDB()
const app = express()

app.use(express.json())
app.use(cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../frontend/src/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix +'.png')
    }
  })

  const upload = multer({ storage:storage })
  

//USER API
app.post('/api/register',userController.register)
app.post('/api/login',userController.login)
app.post('/api/verifyotp',userController.verify)
app.post('/api/forgotpassword',userController.forgotpassword)
app.patch('/api/updatepassword',userController.updatepassword)
app.get('/api/getusers',userController.get)
app.patch('/api/update',Authorization,userController.updateData)
app.patch('/api/updatepicture',upload.single('profilepic'),userController.profilepicture)

app.listen(process.env.PORT,()=>{
    console.log(`listening on port :${process.env.PORT}`)
})



