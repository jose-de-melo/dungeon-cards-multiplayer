const express = require('express');
const Sala = require('../models/sala');
const Card = require('../models/card');

var lista = [];

/// 8 monstros, 6 potes, 4 armas, 14 moedas

//Moedas
for(i=0; i<14;i++){
    coin = new Card();
    coin.type = 4;
    coin.name = "moeda";
    coin.image = "coin.png";
    coin.level = 0;
    coin.life = 0;
    coin.damage = 0;
    coin.bounty = 1;
    lista.push(coin);
}

//Potes
for(i=0; i<6;i++){
    potion = new Card();
    potion.type = 3;
    potion.name = "potion";
    potion.image = "potion.png";
    potion.level = 0;
    potion.life = 0;
    potion.damage = 0;
    potion.bounty = 0;
    lista.push(potion);
}

//Monstros
var herois  = ["androide","barbaro","templario","ninja","ceifadora","elfo","necromante"]

//Heroi
var monstros = ["alien.png","aranha.png","cogumelo.png","esqueleto.png","javali.png","medusa.png","morcego.png","zumbi.png"];

for(i=0; i<8;i++){
    monster = new Card();
    monster.type = 2;
    monster.name = monstros[i].replace(".png","");
    monster.image = monstros[i];
    monster.level = 1;
    monster.life = 5;
    monster.damage = 2;
    monster.bounty = 3;
    lista.push(monster);
}

const router = express.Router();


router.get('/', async (req,res)=> {
    const salas = await Sala.find();
    return res.send(salas);
});

router.get('/create', async (req,res)=> {

    try {
        const sala = await Sala.create({
            posicoes:[[],[],[],[],[],[]], 
            players:[]
        });

        return res.send({ sala }) 

    }catch (err){
        console.log(err);
        return res.status(400).send({error : 'Falha ao cadastrar sala.'});
    }
});

router.delete('/:id', async (req,res)=> {
    const id = req.params.id

    const resp = await Sala.deleteOne({ _id: id })
    if (!resp.deletedCount)
        return res.status(400).send({ error : "Sala não cadastrada.", id});

    return res.send({status: "deletada", sala: id}) 
});

router.post('/join', async (req,res)=> {
    const { nickname, socket, id_sala } = req.body;

    const sala = await Sala.findOne({ _id: id_sala})
    if(!sala) 
        return res.status(400).send({ error: "Sala não cadastrada.", id_sala}) 

    const nplayers = sala.players.length
    if(nplayers == 4) 
        return res.status(400).send({ error: "Esta sala está cheia.", id_sala}) 

    sala.players.push({nickname, socket})    

    const resp = await Sala.update({_id: sala.id }, sala)
    if(!resp.nModified) return res.status(400).send({ error: "Não foi possível entrar na sala.", id_sala})

    return res.send({ status: "O player entrou na sala.", num_players: (nplayers+1)})
});

//Esse é o metodo q vai iniciar a partida
router.get('/iniciar/:id_partida', async (req, res) => {
    const partida =  req.params.id_partida
    const sala = await Sala.findOne({ _id: partida})
   
    for(i=0; i<6;i++){
        lista.sort(randOrd);
        for(j=0; j<6;j++){
           posicoes[i][j] = lista[j];
           posicoes[i][j].x = i;
           posicoes[i][j].x = j;
        }
    }

    
    sala.players.sort(randOrd);
    herois.sort(randOrd);
    
    p = new Card();
    p.name = herois[0];
    p.type = 0;
    p.nick = sala.players[0].nickname;
    p.level = 1;
    p.life = 10;
    p.damage = 3;
    p.bounty = 0;
    p.x = 1;
    p.y = 1;
    sala.posicoes[1][1] = p;
    arma = new Card();
    arma.name = herois[0];
    arma.type = 1;
    arma.image = herois[0] + ".png";
    arma.level = 0;
    arma.life = 0;
    arma.damage = 0;
    arma.bounty = 0;
    lista.push(arma);


    p = new Card();
    p.name =  herois[1];
    p.type = 0;
    p.nick = sala.players[1].nickname;
    p.level = 1;
    p.life = 10;
    p.damage = 3;
    p.bounty = 0;
    p.x = 1;
    p.y = 4;
    sala.posicoes[1][4] = p;
    arma = new Card();
    arma.name = herois[1];
    arma.type = 1;
    arma.image = herois[1] + ".png";
    arma.level = 0;
    arma.life = 0;
    arma.damage = 0;
    arma.bounty = 0;
    lista.push(arma);

    p = new Card();
    p.name =  herois[2];
    p.type = 0;
    p.nick = sala.players[2].nickname;
    p.level = 1;
    p.life = 10;
    p.damage = 3;
    p.bounty = 0;
    p.x = 4;
    p.y = 1;
    sala.posicoes[4][1] = p;
    arma = new Card();
    arma.name = herois[2];
    arma.type = 1;
    arma.image = herois[2] + ".png";
    arma.level = 0;
    arma.life = 0;
    arma.damage = 0;
    arma.bounty = 0;
    lista.push(arma);

    p = new Card();
    p.name =  herois[3];
    p.type = 0;
    p.nick = sala.players[3].nickname;
    p.level = 1;
    p.life = 10;
    p.damage = 3;
    p.bounty = 0;
    p.x = 4;
    p.y = 4;
    sala.posicoes[4][4] = p;
    arma = new Card();
    arma.name = herois[3];
    arma.type = 1;
    arma.image = herois[3] + ".png";
    arma.level = 0;
    arma.life = 0;
    arma.damage = 0;
    arma.bounty = 0;
    lista.push(arma);

    // ATUALIZA MATRIZ PRO SOCKET


});

//Esse é o metodo q vai iniciar a partida
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

    lista.sort(randOrd);
    sala.posicoes[x_atual][y_atual] = lista[0];

    return res.send({ message: 1})
});

function randOrd() {
    return (Math.round(Math.random())-0.5);
}

//Função que pode ser usada caso opte por ter turnos.
router.get('/rolar_dado', async (req, res) => {
    const dado =  [1, 2, 2, 3, 3, 3, 4, 4, 5, 6]
    dado.sort(randOrd)
    return res.send({ jogadas : dado[0]}) 
});

/*
router.post('/left', async (req,res)=> {
    const { nickname, socket, heroi ,id_sala } = req.body;

    const sala = await Sala.findOne({ _id: id_sala})
    if(!sala) 
        return res.status(400).send({ error: "Sala não cadastrada.", id_sala}) 

    const i = sala.players.indexOf({nickname, socket, heroi})
    sala.players.slice(i-1)

    const resp = await Sala.update({_id: sala.id }, sala)
    if(!resp.nModified) return res.status(400).send({ error: "Não foi possível sair da sala.", id_sala}) 

    return res.send({ status: "O player saiu da sala."}) 
});*/


module.exports = app => app.use('/salas', router);
    