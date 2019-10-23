const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

require('./controlers/auth_controler')(app);
require('./controlers/project_controler')(app);


app.get('/', (req, res) =>{
    res.send('Karai Borracha');
});

app.listen(3000);

