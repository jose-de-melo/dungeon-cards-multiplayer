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
//require('./controlers/sala_controler')(app);
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

    //sala.players.sort(utils.randOrd);
    //herois.sort(utils.randOrd);

    //utils.generatePlayer(herois[0], sala.players[0], sala, 1, 1);
    //utils.generateGun(herois[0], lista);

    //utils.generatePlayer(herois[1], sala.players[1], sala, 1, 4);
    //utils.generateGun(herois[1], lista);

    //utils.generatePlayer(herois[2], sala.players[2], sala, 4, 1);
    //utils.generateGun(herois[2], lista);

    //utils.generatePlayer(herois[3], sala.players[3], sala, 4, 4);
    //utils.generateGun(herois[3], lista);

    // ATUALIZA MATRIZ PRO SOCKET
}

router.get('/numberOfPlayersOnRoom', async (req, res) => {
    return res.send({code: 200, numberOfPlayers: sala.players.length});
})

router.get('/iniciar', async (req, res) => {
    
    for(i=0; i<6;i++){
        lista.sort(utils.randOrd);
        for(j=0; j<6;j++){
           sala.posicoes[i][j] = lista[j];
           sala.posicoes[i][j].x = i;
           sala.posicoes[i][j].x = j;
        }
    }

    
    // sala.players.sort(utils.randOrd);
    // herois.sort(utils.randOrd);
    
    // p = new Card();
    // p.name = herois[0];
    // p.type = 0;
    // p.nick = sala.players[0].nickname;
    // p.level = 1;
    // p.life = 15;
    // p.damage = 2;
    // p.bounty = 0;
    // p.x = 1;
    // p.y = 1;
    // sala.posicoes[1][1] = p;
    // arma = new Card();
    // arma.name = herois[0];
    // arma.type = 1;
    // arma.image = herois[0] + ".png";
    // arma.level = 0;
    // arma.life = 0;
    // arma.damage = 0;
    // arma.bounty = 0;
    // lista.push(arma);


    // p = new Card();
    // p.name =  herois[1];
    // p.type = 0;
    // p.nick = sala.players[1].nickname;
    // p.level = 1;
    // p.life = 15;
    // p.damage = 2;
    // p.bounty = 0;
    // p.x = 1;
    // p.y = 4;
    // sala.posicoes[1][4] = p;
    // arma = new Card();
    // arma.name = herois[1];
    // arma.type = 1;
    // arma.image = herois[1] + ".png";
    // arma.level = 0;
    // arma.life = 0;
    // arma.damage = 0;
    // arma.bounty = 0;
    // lista.push(arma);

    // p = new Card();
    // p.name =  herois[2];
    // p.type = 0;
    // p.nick = sala.players[2].nickname;
    // p.level = 1;
    // p.life = 15;
    // p.damage = 2;
    // p.bounty = 0;
    // p.x = 4;
    // p.y = 1;
    // sala.posicoes[4][1] = p;
    // arma = new Card();
    // arma.name = herois[2];
    // arma.type = 1;
    // arma.image = herois[2] + ".png";
    // arma.level = 0;
    // arma.life = 0;
    // arma.damage = 0;
    // arma.bounty = 0;
    // lista.push(arma);

    // p = new Card();
    // p.name =  herois[3];
    // p.type = 0;
    // p.nick = sala.players[3].nickname;
    // p.level = 1;
    // p.life = 15;
    // p.damage = 2;
    // p.bounty = 0;
    // p.x = 4;
    // p.y = 4;
    // sala.posicoes[4][4] = p;
    // arma = new Card();
    // arma.name = herois[3];
    // arma.type = 1;
    // arma.image = herois[3] + ".png";
    // arma.level = 0;
    // arma.life = 0;
    // arma.damage = 0;
    // arma.bounty = 0;
    // lista.push(arma);

    // ATUALIZA MATRIZ PRO SOCKET
   
    return res.send({matriz: sala.posicoes});
});

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
        iniciar()
        socket.emit('attMatriz', JSON.stringify(sala.posicoes))
    })

    socket.on('iniciar', id => {
        console.log("INICIAR > ID: " + socket.id)
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

