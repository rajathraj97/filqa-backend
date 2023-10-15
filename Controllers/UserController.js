const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const pick = require("../node_modules/lodash/pick");
var jwt = require('jsonwebtoken');
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const userController = {};

userController.register = async (req, res) => {
  try {
    const body = pick(req.body, [
      "username",
      "email",
      "password",
      "image",
      "mobile",
      "countrycode"
    ]);
    const register = new User(body);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(body.password, salt);
    register.password = hashedPassword;
    await register.save();
    res.json(register);
  } catch (e) {
    res.json(e);
  }
};

userController.login = async (req, res) => {
  try {
    const body = pick(req.body, ["email", "password"]);
    console.log(req.body)
    const searchData = await User.findOne({ email: body.email });
    const verifyPassword = await bcrypt.compare(
      body.password,
      searchData.password
    );
    if (verifyPassword) {
      client.verify.v2
        .services(process.env.ID)
        .verifications.create({ to: `+${searchData.countrycode}${searchData.mobile}`, channel: "sms" })
        .then((verification) => console.log(verification.sid))
        .catch((e) => {
          console.log(e);
        });
    }
    console.log(verifyPassword);
  } catch (e) {
    console.log(e);
  }
};

userController.verify = async (req, res) => {
  try {
    const body = pick(req.body, ["otp", "email", "password"]);
    const searchData = await User.findOne({ email: body.email });
    const verifyPassword = await bcrypt.compare(
      body.password,
      searchData.password
    );
    console.log(verifyPassword,'verify')
    if (verifyPassword) {
        
        client.verify.v2
          .services(process.env.ID)
          .verificationChecks.create({
            to: `+${searchData.countrycode}${searchData.mobile}`,
            code:body.otp,
          })
          .then((resp) =>{
            if(resp.status === 'approved'){
                const token = jwt.sign({username:searchData.username,email:searchData.email,mobile:searchData.mobile,image:searchData.image},'secret123')
                res.json({token:token})
            }else{
                res.json({failure:"failure"})
            }
          })
    }else{
        res.json({error:"invalid data"})
    }
    
  } catch (e) {
    res.json(e)
  }
};


userController.forgotpassword = async(req,res) =>{
    try{
        const body = pick(req.body,['email'])
        const userData = await User.findOne({email:body.email})
        console.log(userData)
        if(userData){
            client.verify.v2
            .services(process.env.ID)
            .verifications.create({ to: `+${userData.countrycode}${userData.mobile}`, channel: "sms" })
            .done()
        }else{
            res.json({error:"user not found"})
        }
    }
    catch(e){
        res.json(e)
    }
}

userController.updatepassword = async(req,res)=>{
    try{
        const body = pick(req.body,['email','otp','password'])
        const userData = await User.findOne({email:body.email})
        console.log(userData)
        if(userData){
            client.verify.v2
            .services(process.env.ID)
            .verificationChecks.create({
              to: `+${userData.countrycode}${userData.mobile}`,
              code:body.otp,
            })
            .then(async(resp) =>{
              if(resp.status === 'approved'){
                  console.log('in approved')
                  const salt = await bcrypt.genSalt()
                  const hashedPassword = await bcrypt.hash(body.password,salt)
                  const savedPassword = await  User.findOneAndUpdate({email:userData.email},{password:hashedPassword},{new:true})
                  console.log(savedPassword,'save')
                  if(savedPassword){
                    res.json({success:"password update successful"})
                  }
              }else{
                  res.json({failure:"failure"})
              }
            })
        }
    }
    catch(e){
        res.json(e)
    }
}

userController.get = async(req,res)=>{
    try{
      const data = await User.find({})
      res.json(data)

    }
    catch(e){
        res.json(e)
    }
}

userController.updateData = async(req,res)=>{
  try{
    const body = req.body
    if(body.hasOwnProperty('password')){
      const genSalt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(body.password,genSalt)
      const userDataUpdate = await User.findOneAndUpdate({email:body.email},{password:hashedPassword},{new:true})
      res.json(userDataUpdate)
    }
    if(body.hasOwnProperty('mobile')){
      const userDataUpdate = await User.findOneAndUpdate({email:body.email},{mobile:body.mobile},{new:true})
      res.json(userDataUpdate)
    }
    if(body.hasOwnProperty('username')){
      const userDataUpdate = await User.findOneAndUpdate({email:body.email},{username:body.username},{new:true})
      res.json(userDataUpdate)
    }

  }
  catch(e){
    res.json(e)
  }
}

module.exports = userController;
