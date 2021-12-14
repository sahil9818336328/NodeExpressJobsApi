const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const User = require('../models/user')

// POST REQUESTS

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  console.log(user)
  // ACCESSING THE METHOD PREVIOUSLY ADDED TO THE USER OBJECT
  const token = user.generateJWT()
  res.status(StatusCodes.CREATED).json({ user: { user: user.name }, token })
  console.log(user)
}
const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide the necessary credentials...')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError(
      'Invalid credentials, please register to continue...'
    )
  }

  const isPasswordCorrect = await user.comparePassword(password) // COMPARES THE PASSWORDS AND RETURNS TRUTHY OR FALSY
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials, password is incorrect')
  }
  // IF EMAIL AND PASSWORD IS TRUTHY AND WE CAN FIND A USER WITH THAT EMAIL ID THEN GENERATE JWT AND RETURN RESPONSE
  const token = user.generateJWT()
  console.log(token)
  return res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
  register,
  login,
}
