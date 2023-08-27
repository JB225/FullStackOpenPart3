const express = require('express')
const app = express()

app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

var morgan = require('morgan')
app.set('json spaces', 2)
app.use(express.json())


morgan.token('body', function(req, res) {
  if (res.req.method === 'POST') {
    return JSON.stringify(res.req.body)
  } else {
    return " "
  }})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let phoneNumbers = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(phoneNumbers)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  let person = phoneNumbers.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${phoneNumbers.length}</p>
        <p>${new Date()}</p>`)
})

app.post('/api/persons', (request, response) => {
  const newPerson = request.body
  const names = phoneNumbers.map(person => person.name)

  if (!newPerson.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  if (!newPerson.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  } else if (names.includes(newPerson.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }


  const ids = phoneNumbers.map(person => person.id)
  let randomID = Math.floor(Math.random() * 10000)

  while(ids.includes(randomID)) {
    randomID = Math.floor(Math.random() * 10000)
  }

  newPersonObject = {
    "id" : randomID,
    "name" : newPerson.name,
    "number" : newPerson.number
  }

  phoneNumbers = phoneNumbers.concat(newPersonObject)
  response.json(newPersonObject)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phoneNumbers = phoneNumbers.filter(person => person.id != id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})