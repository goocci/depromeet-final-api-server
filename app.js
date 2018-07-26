'use strict'

require('dotenv').config({path:'./d4d_api_server.env'})
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const momentTz = require('moment-timezone')
const morgan = require('morgan')

// http logger
app.use(morgan('[:date[iso]] :method :status :url :response-time(ms) :user-agent'))

// Mongoose Query Paginate
require('mongoose-query-paginate')

// MongoDB Connection
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URI_DEV)
var db = mongoose.connection
db.once('open', function () {
  console.log('MongoDB connected!')
})
db.on('error', function (err) {
  console.log('MongoDB ERROR:', err)
})

// Http Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
  res.header('Access-Control-Allow-Headers', 'content-type')
  next()
})

// API Routing
app.use('/api/v1', require('./api/index'))

// Swagger
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger/swagger.yaml')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Server
const port = process.env.PORT
app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})

module.exports = app
