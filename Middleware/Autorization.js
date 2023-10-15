const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const Authorization = (req,res,next) =>{
    const token = req.headers['authorization']
    if(token){
      const verification = jwt.verify(token,'secret123')
      if(verification){
        const userData = User.findOne({email:verification.email})
        if(userData){
            req.userData={
                email:verification.email
            }
            next()
        }else{
            res.json({error:"user not found"})
        }
      }else{
        res.json({errir:"verification incomplete"})
      }
    }else{
        res.json({error:"token error"})
    }
}

module.exports = Authorization