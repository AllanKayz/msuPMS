const express = require('express');
const bodyParser = require('body-parser');
let cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

app.get('/', (request, response) => { response.json({ info: 'Node.js, Express, and Postgres API' }); });

app.listen(port, () => { console.log(`App running on port ${port}`); });

const db = require('./queries');

app.get('/slots', db.getParkingSlots);
app.get('/users/:email', db.getUserByEmail);
app.put('/users/:id', db.updateSlot);
app.get('/users', db.getUsers);
