const options = {
    host: "localhost",
    port: process.env.PORT || 3000
};

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./config/cors')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

require('./controlers/auth_controler')(app);
require('./controlers/sala_controler')(app);
require('./controlers/project_controler')(app);

app.use(cors);

app.get('/', (req, res) =>{
    console.log("Conexão GET encontrada.")
    res.send('Karai Borracha');
});

app.listen(options.port, function(){
    console.log(`Servidor rodando na porta ${options.port}`)
})

const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', socket => {
    console.log("CLIENT CONNECT >> " + socket.id)
    //socket.on('event', data => {  });
    socket.on('disconnect', () => { console.log("CLIENT DISCONNECTED >> " + socket.id) });

    socket.emit('attMatriz', "TESTANDO SÁ PORRA")
});


server.listen(3001);

