const options = {
    host: "localhost",
    port: process.env.PORT || 3000
};

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./config/cors')
const utils = require('./utils')

var herois  = utils.herois
var monsters = utils.monstros
var armas = []

const sala = utils.criarSala()

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

/*router.post('/join', async (req,res)=> {
    const { nickname, socket} = req.body;

    //if(!sala) 
    //   return res.status(400).send({ error: "Sala não cadastrada.", id_sala}) 

    const nplayers = sala.players.length
    if(nplayers == 4)
        return res.send({status:400,  error: "Esta sala está cheia."}) 

    sala.players.push({nickname, socket})   
    
    console.log("Cadastrando: "+ nickname+ "   Numero de jogadores:"+sala.players.length)

    return res.send({ status: "O player entrou na sala.", num_players: (nplayers+1)})
});*/

async function iniciar(){
    console.log(sala.posicoes.length)
    console.log(sala.players.length)
    sala.posicoes[1][1] = utils.generatePlayer(1,1, sala.players[0].nick)
    sala.posicoes[1][4] = utils.generatePlayer(1,4, sala.players[1].nick)
    sala.posicoes[4][1] = utils.generatePlayer(4,1, sala.players[2].nick)
    sala.posicoes[4][4] = utils.generatePlayer(4,4, sala.players[3].nick)

    for(i=0; i<6;i++){ 
        for(j=0; j<6;j++){
            if(!sala.posicoes[i][j]){
                utils.vec_func.sort(utils.randOrd);
                sala.posicoes[i][j] = utils.vec_func[0](i, j);
            }
        }
    }
}

router.get('/numberOfPlayersOnRoom', async (req, res) => {
    return res.send({code: 200, numberOfPlayers: sala.players.length});
})

router.post('/movimenta', async (req, res) => {
    const { x_atual, y_atual, id_sala, x_mov, y_mov } = req.body;
    
    if(x_mov>5)
        return res.send({ message: 0}) 
    if(y_mov>5)
        return res.send({ message: 0}) 
    if(x_mov<0)
        return res.send({ message: 0}) 
    if(y_mov<0)
        return res.send({ message: 0})
        
    if(y_mod==sala.posicoes[x_atual][y_atual.x] && y_mod==sala.posicoes[x_atual][y_atual].y)
    sala.posicoes[x_atual][y_atual].x = x_mov;
    sala.posicoes[x_atual][y_atual].y = y_mov;

    sala.posicoes[x_mov][y_mov] =  sala.posicoes[x_atual][y_atual];

    lista.sort(utils.randOrd);
    sala.posicoes[x_atual][y_atual] = lista[0];

    return res.send({ message: 1})
});




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

    socket.on('pushPlayer', nickname => {
        console.log("PUSH PLAYER: " + nickname)
        sala.players.push({nick: nickname, id_socket: socket.id})

        if(sala.players.length == 4){
            console.log("4 PLAYERS")
            iniciar()
            socket.emit('gameStart', JSON.stringify(sala.posicoes))
            socket.broadcast.emit('gameStart', JSON.stringify(sala.posicoes))
        }else{
            socket.emit('newPlayer', sala.players.length)
            socket.broadcast.emit('newPlayer', sala.players.length)
        }
    })

    socket.on('iniciar', id => {
        console.log("INICIAR > ID: " + socket.id)

        if(sala.players.length == 1)
            iniciar()
        
        socket.emit('attMatriz', JSON.stringify(sala.posicoes))

        
    })
})

// io.on('connection', socket => {
//     console.log("CLIENT CONNECT >> " + socket.id)
//     socket.on('disconnect', () => { console.log("CLIENT DISCONNECTED >> " + socket.id) });

     //socket.on('iniciar', id => {
     //    console.log("INICIAR > ID: " + socket.id)
     //    iniciar()
     //    socket.emit('attMatriz', JSON.stringify(sala.posicoes))
     //})

//     socket.on('pushPlayer', nickname => {
//         console.log("PUSH PLAYER: " + nickname)
//     })

//     //socket.emit('attMatriz', JSON.stringify(sala.posicoes))
// });



server.listen(3001);

