const { StatusCodes } = require('http-status-codes')

const notFound = (req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json(`The route you're looking for does'nt exists...`)
}

module.exports = notFound
