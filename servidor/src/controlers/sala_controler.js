const express = require('express');
const Sala = require('../models/sala');
const Card = require('../models/card');

var lista = [];

/// 8 monstros, 6 potes, 4 armas, 14 moedas

//Moedas
for(i=0; i<14;i++){
    coin = new Card();

    coin.name = "moeda";
    coin.image = "coin.png";
    coin.level = 0;
    coin.live = 0;
    coin.damage = 0;
    coin.bounty = 1;
    lista.push(coin);
}

//Potes
for(i=0; i<6;i++){
    potion = new Card();

    potion.name = "potion";
    potion.image = "potion.png";
    potion.level = 0;
    potion.live = 0;
    potion.damage = 0;
    potion.bounty = 2;
    lista.push(potion);
}

//Monstros
var monstros = ["alien.png","aranha.png","cogumelo.png","esqueleto.png","javali.png","medusa.png","morcego.png","zumbi.png"];
for(i=0; i<8;i++){
    monster = new Card();

    monster.name = monstros[i].replace(".png","");
    monster.image = monstros[i];
    monster.level = 1;
    monster.live = 5;
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
    const { nickname, socket, heroi, id_sala } = req.body;

    const sala = await Sala.findOne({ _id: id_sala})
    if(!sala) 
        return res.status(400).send({ error: "Sala não cadastrada.", id_sala}) 

    const nplayers = sala.players.length
    if(nplayers == 4) 
        return res.status(400).send({ error: "Esta sala está cheia.", id_sala}) 

    sala.players.push({nickname, socket, heroi})

    const resp = await Sala.update({_id: sala.id }, sala)
    if(!resp.nModified) return res.status(400).send({ error: "Não foi possível entrar na sala.", id_sala})

    return res.send({ status: "O player entrou na sala.", num_players: (nplayers+1)})
});


//Esse é o metodo q vai iniciar a partida
router.get('/iniciar/:id_partida', async (req, res) => {
    const partida =  req.params.id_partida
    const sala = await Sala.findOne({ _id: partida})
    for(p in sala.players){
        arma = new Card();
        arma.name = p.heroi;
        arma.image = p.heroi + ".png";
        arma.level = 0;
        arma.live = 0;
        arma.damage = 0;
        arma.bounty = 0;
        lista.push(arma);
    }
    sala.players.sort(randOrd);
    sala.posicoes[1,1] = sala.players[0];
    sala.posicoes[1,4] = sala.players[1];
    sala.posicoes[4,1] = sala.players[2];
    sala.posicoes[4,4] = sala.players[3];
    // Aqui ele tem o id da partida, so vai ter um mas ele vai estar fixo como 1.
    // 1  --  Ele precisa 1, usar um sort colocar os players de fomra aleatoria no vetor de players da sala
    // 2 -- Ele posiciona os players de acordo com a posição no vetor, [1,1], [1,4], [4,1], [4,4].
    // Criar um vetor de objetos Card, bolar uma logica pra distribuir armas, itens e monstros. ( pensei no seguinte, criar um vetor com moedas, monstros e pots, e colocar no final, os personagens e as armas)
    // Sort nesse vetor de item.
    // Comunica com o socket pela 1 vez aqui, ja com a matriz pronta pra ser exibida.   
    

});

function randOrd() {
    return (Math.round(Math.random())-0.5);
}

router.get('/rolar_dado', async (req, res) => {
    const dado =  [1, 2, 2, 3, 3, 3, 4, 4, 5, 6]
    dado.sort.sort(randOrd)
    return res.send({ jogadas : dado[0]}) 
});

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
});


module.exports = app => app.use('/salas', router);
    