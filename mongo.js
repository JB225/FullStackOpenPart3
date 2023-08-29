const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('You need to provide a password')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://tinker344:${password}@cluster0.6wv3i8d.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id : Number,
    name : String,
    number : String
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
    let randomID = Math.floor(Math.random() * 10000)
    const newName = process.argv[3]
    const newNumber = process.argv[4]
    

    const newPerson = new Person({
        id: randomID,
        name: newName,
        number: newNumber
    })

    newPerson.save().then(result => {
        console.log(`added ${newName} number ${newNumber} to phonebook`)
        mongoose.connection.close()
    })
}

// const person = new Person({
//     id: 7,
//     name: "Bob",
//     number: "14"
// })

// person.save().then(result => {
//     console.log('person saved!')
//     mongoose.connection.close()
// })