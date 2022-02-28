const express = require('express');
const app = express();
const port = 80;

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.post('/', require('./api/post'));

app.get('/:field', require('./api/get'))

app.use(express.static('./src/api/root'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
