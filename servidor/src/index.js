const options = {
    host: "localhost",
    port: process.env.PORT || 3000
};

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./config/cors')
const utils = require('./utils')

var lista = [];

const sala = utils.criarSala()
utils.generateCoins(lista)
var herois  = utils.herois
var monsters = utils.monstros

utils.generateMonsters(lista, monsters)

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

require('./controlers/auth_controler')(app);
require('./controlers/sala_controler')(app);
require('./controlers/project_controler')(app);


const router = express.Router();

router.get('/', async (req, res) => {
    console.log('karai borrachando');
    return res.send('Karai borracha');
});

router.post('/join', async (req,res)=> {
    const { nickname, socket} = req.body;

    //if(!sala) 
    //   return res.status(400).send({ error: "Sala não cadastrada.", id_sala}) 

    const nplayers = sala.players.length
    if(nplayers == 4)
        return res.send({status:400,  error: "Esta sala está cheia."}) 

    sala.players.push({nickname, socket})   
    
    console.log("Cadastrando: "+ nickname+ "   Numero de jogadores:"+sala.players.length)

    return res.send({ status: "O player entrou na sala.", num_players: (nplayers+1)})
});

async function iniciar(){
    for(i=0; i<6;i++){
        lista.sort(utils.randOrd);
        for(j=0; j<6;j++){
           sala.posicoes[i][j] = lista[j];
           sala.posicoes[i][j].x = i;
           sala.posicoes[i][j].x = j;
        }
    }

    sala.players.sort(utils.randOrd);
    herois.sort(utils.randOrd);

    utils.generatePlayer(herois[0], sala.players[0], sala, 1, 1);
    utils.generateGun(herois[0], lista);

    utils.generatePlayer(herois[1], sala.players[1], sala, 1, 4);
    utils.generateGun(herois[1], lista);

    utils.generatePlayer(herois[2], sala.players[2], sala, 4, 1);
    utils.generateGun(herois[2], lista);

    utils.generatePlayer(herois[3], sala.players[3], sala, 4, 4);
    utils.generateGun(herois[3], lista);

    // ATUALIZA MATRIZ PRO SOCKET
}

app.use('/game', router)

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
    socket.on('disconnect', () => { console.log("CLIENT DISCONNECTED >> " + socket.id) });

     socket.on('iniciar', id => {
        console.log("INICIAR > ID: " + socket.id)
        iniciar()
        socket.emit('attMatriz', JSON.stringify(sala.posicoes))
     })

    //socket.emit('attMatriz', JSON.stringify(sala.posicoes))
});



server.listen(3001);

