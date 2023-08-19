const express = require('express')
const app = express()
app.set('json spaces', 2)

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
  const id = parseInt(request.params.id)
  console.log(phoneNumbers.entries)
  const person = phoneNumbers.find(person => {
    person.id === id
    console.log(person.id === id)
    // console.log("Person: " + person.id)
    // console.log("ID: " + id)
    // console.log(person.id == id)
    // console.log(typeof(id))
  })
  console.log(person)

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} people`)
})