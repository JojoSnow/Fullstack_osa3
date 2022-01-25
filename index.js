require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');
const { response } = require('express');

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then(ps => {
        response.json(ps)
    });
});

app.get('/info', (request, response) => {
    const peopleAmount = persons.length;
    const reqTime = new Date();

    response.send(`<p>Phonebook has info for ${peopleAmount} people</p> <p>${reqTime}</p>`);
});

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
});

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.post('/api/persons', (request, response) => {
    const body = request.body;
    
    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        response.json(savedPerson);
    });
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});