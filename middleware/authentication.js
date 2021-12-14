const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Not authorized to access this route...')
  }

  const token = authHeader.split(' ')[1]
  try {
    const decodeOrPayload = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decodeOrPayload)
    // ADDING USER PROPERTY ON ON EVERY REQUEST OBJECT
    req.user = { userID: decodeOrPayload.id, userName: decodeOrPayload.name }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route...')
  }
}

module.exports = auth
