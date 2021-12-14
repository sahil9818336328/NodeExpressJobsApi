const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  // MAKING ERROR'S USER-FRIENDLY
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later...',
  }

  // VALIDATION ERROR
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  // DUPLICATE VALUE ERROR
  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} please choose another value...`
  }

  // MONGOOSE CAST ERROR
  if (err.name === 'CastError') {
    customError.msg = `Cannot find job with id: ${err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }
  return res.status(customError.statusCode).json({ err: customError.msg })
}

module.exports = errorHandlerMiddleware
