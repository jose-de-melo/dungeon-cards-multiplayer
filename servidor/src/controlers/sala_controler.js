const express = require('express');
const Sala = require('../models/sala');
const Card = require('../models/card');


const sala = new Sala({
    posicoes:[[],[],[],[],[],[]], 
    players:[]
});
/// 8 monstros, 6 potes, 4 armas, 14 moedas

function randOrd() {
    return (Math.round(Math.random())-0.5);
}

var monstros = ["alien","aranha","cogumelo","esqueleto","javali","medusa","morcego","zumbi"];

var herois  = ["androide","barbaro","templario","ninja","ceifadora","elfo","necromante"]

var heroi_na_sala  = []



const cria_monstro = (x, y) =>{
    monster = new Card();
    monster.tipo = "monstro";
    monstros.sort(randOrd);
    monster.name = monstros[0];
    monster.image = monstros[0];
    monster.level = 1;
    monster.life = 6;
    monster.damage = 2;
    monster.bounty = 5;
    monster.x = x;
    monster.y = y;
    return monster;
}

const cria_pot = (x, y) =>{
    potion = new Card();
    potion.tipo = "item";
    potion.name = "poção";
    potion.image = "potion";
    potion.level = 0;
    potion.life = 0;
    potion.damage = 0;
    potion.bounty = 0;
    potion.x = x;
    potion.y = y;
    return potion;
}

const cria_moeda = (x, y) =>{
    coin = new Card();
    coin.tipo = "item";
    coin.name = "moeda";
    coin.image = "moeda";
    coin.level = 0;
    coin.life = 0;
    coin.damage = 0;
    coin.bounty = 1;
    coin.x = x;
    coin.y = y;
    return coin;
}

const cria_arma = (x, y) =>{

    arma = new Card();
    herois.sort(randOrd);
    arma.name = herois[0];
    arma.tipo = "arma";
    arma.image = herois[0];
    arma.level = 0;
    arma.life = 0;
    arma.x = x;
    arma.y = y;
    arma.damage = 0;
    arma.bounty = 0;
    return arma;
}


const cria_player = (x, y, nick) =>{
    p = new Card();
    herois.sort(randOrd);
    p.name = herois[0];
    heroi_na_sala.push(herois[0]);
    p.tipo = "heroi";
    p.nick = nick;
    p.image = herois[0];
    p.level = 0;
    p.life = 15;
    p.damage = 2;
    p.bounty = 0;
    p.x = x;
    p.y = y;
    return p;
}


const vec_func = [cria_moeda, cria_monstro, cria_monstro, cria_pot,cria_pot,cria_pot, cria_arma, cria_monstro, cria_moeda, cria_moeda, cria_moeda]

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
    for(i=0; i<6;i++){ 
        for(j=0; j<6;j++){
            vec_func.sort(randOrd);
            sala.posicoes[i][j] = vec_func[0](i, j);
        }
    }
    
    sala.players.sort(randOrd);
    sala.posicoes[1][1] = cria_player(1,1, sala.players[0].nickname)  
   
    // ATUALIZA MATRIZ PRO SOCKET
    return res.send({matriz: sala.posicoes}) 
});

//Esse é o metodo q vai iniciar a partida
router.post('/movimento', (req, res) => {

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
    if(dif_x+dif_y !=1)
        return res.send({ message: 0})
    
    
    if(sala.posicoes[x_mov][y_mov].name == 'poção'){
        sala.posicoes[x_atual][y_atual].life += 1;
    }    
    if(sala.posicoes[x_mov][y_mov].tipo == 'arma'){
        if(sala.posicoes[x_atual][y_atual].name == sala.posicoes[x_mov][y_mov].name){
            if( sala.posicoes[x_atual][y_atual].tipo == "heroi_armado"){
                 console.log("achou a arma mas ja tem");
                 sala.posicoes[x_atual][y_atual].bounty += 1;
            }
            sala.posicoes[x_atual][y_atual].damage = (sala.posicoes[x_atual][y_atual].damage*2)
            sala.posicoes[x_atual][y_atual].tipo = "heroi_armado";
        }else{
            sala.posicoes[x_atual][y_atual].bounty += 1;
        }
    }    
    if(sala.posicoes[x_mov][y_mov].name == 'moeda'){
        sala.posicoes[x_atual][y_atual].bounty += sala.posicoes[x_mov][y_mov].bounty;
    } 
    if(sala.posicoes[x_mov][y_mov].tipo == 'monstro'){

        //decrementa a vida do monstro, com o seu dano
        sala.posicoes[x_mov][y_mov].life -= sala.posicoes[x_atual][y_atual].damage;

        //decrementa a sua vida, de acordo com o dano do monstro
        sala.posicoes[x_atual][y_atual].life -= sala.posicoes[x_mov][y_mov].damage;
        
        //verifica se o monstro nao morreu
        if(sala.posicoes[x_mov][y_mov].life>0){
            //se morreu, retorna a matriz
            return res.send({ message: sala.posicoes})
        }

        if(sala.posicoes[x_atual][y_atual].life<=0){
            
            vec_func.sort(randOrd);

            sala.posicoes[x_atual][y_atual] = vec_func[0](x_atual, y_atual);

            //MORREU TIRA DO SOCKET RPA ELE NAO PODER MAIS MECHER
            return res.send({ message: 2, data: sala.posicoes})
        }
    }    

    if(sala.posicoes[x_mov][y_mov].tipo == 'heroi'){

        sala.posicoes[x_mov][y_mov].life -= sala.posicoes[x_atual][y_atual].damage;

        if(sala.posicoes[x_mov][y_mov].life>0){
            //se morreu, retorna a matriz
            return res.send({ message: sala.posicoes})
        }
    }    
   
    //a posição que deseja mover recebe o objeto q esta na posição atual.
    //sala.posicoes[x_mov][y_mov] = 
    c = new Card();
    c =  sala.posicoes[x_atual][y_atual];
    x =  parseInt((c.bounty/10)-(c.level));
    console.log(c.bounty/10)
    console.log(c.level)
    c.damage += x;
    c.life += (x*2);
    c.level = parseInt(c.bounty/10);

    //atualizou o x e y, do atual pro novo
    c.x = x_mov;
    c.y = y_mov;

    

    vec_func.sort(randOrd);

    n = vec_func[0]( x_atual, y_atual)
    sala.posicoes[x_mov][y_mov] = c;
    sala.posicoes[x_atual][y_atual] = n;

    return res.send({message: 1, data: sala.posicoes})
});





//Função que pode ser usada caso opte por ter turnos.
router.get('/rolar_dado', async (req, res) => {
    const dado =  [1, 2, 2, 3, 3, 3, 4, 4, 5, 6]
    dado.sort(randOrd)
    return res.send({ jogadas : dado[0]}) 
});

module.exports = app => app.use('/game', router);
    