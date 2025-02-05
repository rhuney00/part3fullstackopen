const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));
app.use(morgan((tokens, req, res) => {

    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body),
    ].join(' ');

  }));

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122",
    },
];

app.get('/info', (request, response) => {

    response.send(`<p>Phonebook has info for ${persons.length} people<p><p>${new Date()}</p>`)

});

app.get('/api/persons', (request, response) => {

    response.json(persons);

});

app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id);
    const person = persons.find(n => n.id === id);

    if(person) {

        response.json(person);

    } else {

        response.status(404).end();

    }

});

app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();

});

const getId = () => {

    let id = Math.floor(Math.random() * Math.floor(1E6));

    while(persons.find(person => person.id === id)) {
        id = Math.floor(Math.random() * Math.floor(1E6));
    }

    return id;

}

app.post('/api/persons', (request, response) => {

    const body = request.body;

    if (!body.name) {

        return response.status(400).json(
            { error: 'missing name' }
        )

    } else if (!body.number) {

        return response.status(400).json(
            { error: 'missing number' }
        )

    } else if (persons.find(person => person.name === body.name)) {

        return response.status(400).json(
            { error: 'name already exists' }
        )

    }

    const person = {
        id: getId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);

    response.json(person);

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});