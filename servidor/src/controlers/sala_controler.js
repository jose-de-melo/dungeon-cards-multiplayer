const express = require('express');
const Sala = require('../models/sala');
const Card = require('../models/card');

var lista = [];

const sala = new Sala({
    posicoes:[[],[],[],[],[],[]], 
    players:[]
});
/// 8 monstros, 6 potes, 4 armas, 14 moedas

//Moedas
for(i=0; i<18;i++){
    coin = new Card();
    coin.tipo = "item";
    coin.name = "moeda";
    coin.image = "moeda";
    coin.level = 0;
    coin.life = 0;
    coin.damage = 0;
    coin.bounty = 1;
    lista.push(coin);
}

//Potes
for(i=0; i<10;i++){
    potion = new Card();
    potion.tipo = "item";
    potion.name = "poção";
    potion.image = "potion";
    potion.level = 0;
    potion.life = 0;
    potion.damage = 0;
    potion.bounty = 0;
    lista.push(potion);
}

//Monstros
var herois  = ["androide","barbaro","templario","ninja","ceifadora","elfo","necromante"]

//Heroi
var monstros = ["alien","aranha","cogumelo","esqueleto","javali","medusa","morcego","zumbi"];

for(i=0; i<8;i++){
    monster = new Card();
    monster.tipo = "monstro";
    monster.name = monstros[i];
    monster.image = monstros[i];
    monster.level = 1;
    monster.life = 6;
    monster.damage = 2;
    monster.bounty = 3;
    lista.push(monster);
}

const router = express.Router();

/*
router.get('/', async (req,res)=> {
    console.log("retornando salas...")
    const salas = await Sala.find();
    return res.send(salas);
});

router.get('/create', async (req,res)=> {
    console.log("criando sala...")
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

*/
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

router.get('/', async (req, res) => {
    console.log('karai borrachandoasdasdsad');
    return res.send('Karai borrachaasdasdsadda');
});

//Esse é o metodo q vai iniciar a partida
router.get('/iniciar', async (req, res) => {
    var cont = 0;
    lista.sort(randOrd);
    for(i=0; i<6;i++){ 
        for(j=0; j<6;j++){
            sala.posicoes[i][j] = lista[cont];
            sala.posicoes[i][j].x = i;
            sala.posicoes[i][j].y = j;
            cont++;
        }
    }

    
    
    sala.players.sort(randOrd);
    herois.sort(randOrd);
    
    p = new Card();
    p.name = herois[0];
    p.tipo = "heroi";
    p.nick = sala.players[0].nickname;
    p.image = herois[0];
    p.level = 1;
    p.life = 15;
    p.damage = 2;
    p.bounty = 0;
    p.x = 1;
    p.y = 1;
    sala.posicoes[1][1] = p;
    arma = new Card();
    arma.name = herois[0];
    arma.tipo = "arma";
    arma.image = herois[0];
    arma.level = 0;
    arma.life = 0;
    arma.damage = 0;
    arma.bounty = 0;
    lista.push(arma);

    /*

    p = new Card();
    p.name =  herois[1];
    p.tipo = "heroi";
    p.image = herois[1];
    p.nick = sala.players[1].nickname;
    p.level = 1;
    p.life = 15;
    p.damage = 2;
    p.bounty = 0;
    p.x = 1;
    p.y = 4;
    sala.posicoes[1][4] = p;
    arma = new Card();
    arma.name = herois[1];
    arma.tipo = "arma";
    arma.image = herois[1];
    arma.level = 0;
    arma.life = 0;
    arma.damage = 0;
    arma.bounty = 0;
    lista.push(arma);

    p = new Card();
    p.name =  herois[2];
    p.tipo = "heroi";
    p.image = herois[2];
    p.nick = sala.players[2].nickname;
    p.level = 1;
    p.life = 15;
    p.damage = 2;
    p.bounty = 0;
    p.x = 4;
    p.y = 1;
    sala.posicoes[4][1] = p;
    arma = new Card();
    arma.name = herois[2];
    arma.tipo = "arma";
    arma.image = herois[2];
    arma.level = 0;
    arma.life = 0;
    arma.damage = 0;
    arma.bounty = 0;
    lista.push(arma);

    p = new Card();
    p.name =  herois[3];
    p.tipo = "heroi";
    p.image = herois[3];
    p.nick = sala.players[3].nickname;
    p.level = 1;
    p.life = 15;
    p.damage = 2;
    p.bounty = 0;
    p.x = 4;
    p.y = 4;
    sala.posicoes[4][4] = p;
    arma = new Card();
    arma.name = herois[3];
    arma.tipo = "arma";
    arma.image = herois[3];
    arma.level = 0;
    arma.life = 0;
    arma.damage = 0;
    arma.bounty = 0;
    lista.push(arma);*/

    // ATUALIZA MATRIZ PRO SOCKET
    return res.send({matriz: sala.posicoes}) 
});

//Esse é o metodo q vai iniciar a partida
router.post('/movimento', async (req, res) => {
    const { x_atual, y_atual, x_mov, y_mov } = req.body;
    if(x_mov>5)
        return res.send({ message: 0}) 
    if(y_mov>5)
        return res.send({ message: 0}) 
    if(x_mov<0)
        return res.send({ message: 0}) 
    if(y_mov<0)
        return res.send({ message: 0})
    
    dif_y = Math.abs((y_atual-y_mov))
    dif_x = Math.abs((x_atual-x_mov))
    if(dif_x+dif_y !='1')
        return res.send({ message: 0})

    
    if(sala.posicoes[x_mov][y_mov].name == 'poção'){
        sala.posicoes[x_atual][y_atual].life += 2;
    }    
    if(sala.posicoes[x_mov][y_mov].name == 'moeda'){
        sala.posicoes[x_atual][y_atual].bounty += sala.posicoes[x_mov][y_mov].bounty;
    }    
    /*if(sala.posicoes[x_mov][y_mov].tipo == 'monstro'){
        //decrementa a vida do monstro, com o seu dano
        sala.posicoes[x_mov][y_mov].life -= sala.posicoes[x_atual][y_atual].damage;

        //decrementa a sua vida, de acordo com o dano do monstro
        sala.posicoes[x_atual][y_atual].life -= sala.posicoes[x_mov][y_mov].damage;
        
        //verifica se o monstro nao morreu
        if(sala.posicoes[x_mov][y_mov].life>0){
            //se morreu, retorna a matriz
            return res.send({ message: sala.posicoes})
        }

        //Player morreu?
        if(sala.posicoes[x_atual][y_atual].life<=0){//player morreu
            lista.sort(randOrd);
            sala.posicoes[x_atual][y_atual] = lista[0];

        }
    }    */
   
    console.log(x_mov, y_mov)
    //a posição que deseja mover recebe o objeto q esta na posição atual.
    sala.posicoes[x_mov][y_mov] =  sala.posicoes[x_atual][y_atual];

     //atualizou o x e y, do atual pro novo
     sala.posicoes[x_mov][y_mov].x = x_mov;
     sala.posicoes[x_mov][y_mov].y = y_mov;
    //da um sort na lista de itens q podem aparecer
    lista.sort(randOrd);
    //coloca um item aleatorio na posição q estava
    sala.posicoes[x_atual][y_atual] = lista[0];
    //atualiza o x e y da posicao atual
    sala.posicoes[x_atual][y_atual].x = x_atual; 
    sala.posicoes[x_atual][y_atual].y = y_atual; 
    

    return res.send({ message: sala.posicoes})
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

module.exports = app => app.use('/game', router);
    