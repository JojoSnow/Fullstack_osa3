require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const { response } = require('express')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next()
}

app.use(requestLogger)

app.get('/api/persons', (request, response) => {
	Person.find({}).then(ps => {
		response.json(ps)
	})
})

app.get('/info', (request, response) => {
	const reqTime = new Date()
	const counting = Person.count({})

	counting.then(count => {
		response.send(`<p>Phonebook has info for ${count} people</p> <p>${reqTime}</p>`)
	})
})

app.get('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id).then(p => {
		if (!p) {
			return response.status(400).json({
				error: 'content missing'
			})
		} else {
			return response.json(p)
		}
	})
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person
		.save()
		.then(savedPerson => response.json(savedPerson))
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person = {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})