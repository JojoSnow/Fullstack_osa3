const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Persons</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    const peopleAmount = persons.length;
    const reqTime = new Date();
    response.send(`<p>Phonebook has info for ${peopleAmount} people</p> <p>${reqTime}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);

    if (!person) {
        return response.status(400).json({
            error: 'content missing'
        });
    } else {
        return response.json(person);
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
})

const generateId = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

app.post('/api/persons', (request, response) => {
    const body = request.body;
    const name = persons.find(p => p.name === body.name)

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        });
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        });
    } else if (name) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        id: generateId(5, 10000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);

    response.json(body);
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})