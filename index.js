const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json());

morgan.token('body', function getId (req) {
    return JSON.stringify(req.body);
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]


app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    if (!person) {
        res.status(404).end();
        return;
    }
    res.json(person);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const previousLength = persons.length;
    persons = persons.filter(note => note.id !== id)

    // Nothing remove -> no entity -> 404
    // https://raw.githubusercontent.com/for-GET/http-decision-diagram/master/httpdd.png
    if (persons.length === previousLength) {
        res.status(404).end();
        return;
    }

    res.status(204).end()
})

app.get('/info', (req, res) => {
    res.send(`
        <div>Phonebook has info for ${persons.length} people</div>
        <br/>
        <div>${new Date()}</div>
    `)
})

const generateId = () => {
    const max = Number.MAX_SAFE_INTEGER;
    return Math.floor(Math.random() * Math.floor(max));
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            error: 'body missing'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if (persons.find(p => p.name === body.name)) {
        return res.status(400).json({
            error: 'name already exist'
        })
    }

    const person = {
        ...body,
        id: generateId(),
    }

    persons = persons.concat(person)

    res.json(person)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
