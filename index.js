// Confgiures dotenv module to allow environment variables to be imported from .env file
require('dotenv').config()

// Initialises express library used for HTTP requests
const express = require('express')
const app = express()

// Imports MongoDB database model using mongoose
const Person = require('./models/person')

// Return static build of frontend to base URL
app.use(express.static('build'))

// Deals with cross origin resources
const cors = require('cors')
app.use(cors())

// Sets up JSON formatting for returning data as JSON
app.set('json spaces', 2)
app.use(express.json())

// Console logging of HTTP requests
var morgan = require('morgan')
morgan.token('body', function(req, res) {
  if (res.req.method === 'POST') {
    return JSON.stringify(res.req.body)
  } else {
    return " "
  }})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Provides basic info on data in phonebook database
app.get('/info', (request, response, next) => {
  Person.find({}).then(persons => {
    response.send(`
        <p>Phonebook has info for ${persons.length}</p>
        <p>${new Date()}</p>`)
  }).catch(error => next(error))
})

// Gets all users in phonebook
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

// Gets peron in phonebook by their ID
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    }).catch(error => {next(error)})
})

// Deletes a user from the database
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(person => {
      if (person) {
        response.status(204).end()
      } else {
        response.status(400).end()
      }
  }).catch(error => next(error))
})

// Creates a new user in the database
app.post('/api/persons', (request, response, next) => {
  const newPerson = request.body

  const newPersonObject = new Person({
    name: newPerson.name,
    number: newPerson.number
  })

  newPersonObject.save().then(result => {
      response.json(newPersonObject)
  }).catch(error => next(error))
})

// Updates a person based on their user id
app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  Person.findByIdAndUpdate(request.params.id, {name, number}, 
    {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {response.json(updatedPerson)})
    .catch(error => next(error))
})

// Returns error message if no endpoint found
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Custom error handling middleware configuraton
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }
  next(error)
}
app.use(errorHandler)

// Listens on given port number
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})