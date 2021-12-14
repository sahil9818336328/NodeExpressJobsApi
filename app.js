// BASIC EXPRESS SERVER TEMPLATE...

require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

// SECURITY
const helmet = require('helmet')
const cors = require('cors')
const xxs = require('xss-clean')
const rateLimit = require('express-rate-limit')

// SWAGGER & YAML
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

// MIDDLEWARE
const connectDB = require('./db/connect')
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

const authMiddleware = require('./middleware/authentication')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// APP.USE
app.use(express.static('./public'))
app.set('trust proxy', 1)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
)
app.use(helmet())
app.use(cors())
app.use(xxs())
app.use(express.json())
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authMiddleware, jobsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 7000

// FUNCTION THAT CONNECTS TO DATABASE AND STARTS THE SERVER
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log('DATABASE CONNECTION SUCCESSFUL...')
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
