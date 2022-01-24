require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

if (process.argv.length === 3) {
    console.log(`phonebook:`) 
    Person.find({}).then(result => {
        result.forEach(p => {
            console.log(p.name, p.number);
        });
    });
} else if (process.argv.length > 3) {
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`);
    });
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then(ps => {
      response.json(ps)
  })
})

app.get('/info', (request, response) => {
    const peopleAmount = persons.length;
    const reqTime = new Date();
    response.send(`<p>Phonebook has info for ${peopleAmount} people</p> <p>${reqTime}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(p => {
        if (!p) {
            return response.status(400).json({
                error: 'content missing'
            });
        } else {
            return response.json(p);
        }
    });

    
})

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id);
//     persons = persons.filter(person => person.id !== id);

//     response.status(204).end();
// })

app.post('/api/persons', (request, response) => {
    const body = request.body;
    
    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing'});
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        });
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        });
    } else if (body.name) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    person.save().then(savedPerson => {
        response.json(savedPerson);
    });
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});