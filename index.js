const express = require('express')
const dotenv = require('dotenv');

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send(`<h1>🍃 A RESTful Mongodb API</h1>`));

app.use('/api/employees', require('./api/employees'));

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT} for ${process.env.NODE_ENV}`);
});