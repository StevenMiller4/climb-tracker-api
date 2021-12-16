require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { CLIENT_ORIGIN } = require('./config')
//const usersRouter = require('./users/users-router')
const UsersService = require('./users/users-service')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
)

//app.use('/api/users', usersRouter)

app.get('/users', (req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getAllUsers(knexInstance)
        .then(users => {
            res.json(users)
        })
        .catch(next)
})

app.get(`/users/:user_id`, (req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getById(knexInstance, req.params.user_id)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    error: { message: `User doesn't exist` }
                })
            }
            res.json(user)
        })
        .catch(next)
})

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app