const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    minlength: 4,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'please provide a valid email address',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 6,
  },
})

// WRITING THIS LOGIN HERE AS WE DONT WANT TO JAMM EVERYTHING IN THE CONTROLLER
// MIDDLEWARE
// BEFORE SAVING THE DOCUMENT IN DATABASE HASH THE PASSWORD OR RUN THIS LOGIN
userSchema.pre('save', async function () {
  // HASHING THE PASSWORD FOR SECURITY
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// INSTANCE METHODS
// GENERATING JSON-WEB-TOKEN
// ADDING A METHOD CALL GENERATEJWT ON USER OBJECT RETURNED FROM THE DATABASE
userSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}

// COMPARING USER PASSWORD WHEN HE LOGS IN WIH THAT IN HIS DATABASE
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password)
  return isMatch
}
module.exports = mongoose.model('User', userSchema)
