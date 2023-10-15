const mongoose  = require('mongoose')

const {Schema} = mongoose

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    countrycode:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        default:"https://ca.slack-edge.com/T0266FRGM-U2Q173U05-g863c2a865d7-512"
    }
})

// userSchema.pre('save',function(next){
//     if(this.email && this.username && this.password && this.mobile){
//         next()
//     }else{
//         res.json(e)
//     }
// })

const User = mongoose.model('User',userSchema)

module.exports = User