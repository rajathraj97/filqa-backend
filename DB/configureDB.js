const mongoose = require('mongoose')
require('dotenv').config()

const configureDB = async()=>{
try{
    await mongoose.connect(process.env.URL)
    console.log('connected to db')
}
catch(e){
    console.log('error : ',e)
}
}

module.exports = configureDB