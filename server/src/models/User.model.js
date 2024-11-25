const mongoose = require('mongoose');
const bcrypt =require ('bcrypt')
const jwt = require("jsonwebtoken");
const validator = require('validator')


const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Plase enter your name"],
        unique:true
    },
    email:{
        type:String,
        required:[true,"plase true,enter your email"],
        unique:true,
        validate:[validator.isEmail,"Plase enter valid email"]
    },
    password:{
        type:String,
        required:[true,"please enter your password"],
        maxLength:[30,"password should bhe 30 characters"],
        minLength:[8,"password should be at least 8 characters"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },   

})

// converting password in to bcrypt
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 12);
  });
//   Comparing password 
  UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
  };

  // jwt Web Token


  UserSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '1d', // Default to 1 day if not set
    });
  };
  // Compare password
  
  UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };




module.exports = mongoose.model("User", UserSchema);

