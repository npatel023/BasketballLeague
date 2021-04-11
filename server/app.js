const express = require('express')
const cors = require('cors')
const routes = require('./routes/routes')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())

app.use('/', routes)

app.listen(process.env.SERVER_PORT, () => console.log('Server running'))