const options = {
    host: "localhost",
    port: process.env.PORT || 3000
};

//Imports
const Card = require('./models/card');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./config/cors');
const utils = require('./utils');

//Definindo sockets
const app = express();
const server = require('http').createServer();
const io = require('socket.io')(server);

// Middleware utilizando json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
require('./controlers/auth_controler')(app);
//require('./controlers/sala_controler')(app);

// Criando salas e rotas
const sala = utils.criarSala();
const router = express.Router();

router.get('/', async (req, res) => {
    return res.send('DungeonsDroid');
});

// Função que movimenta o player
const movimento = (x_atual, y_atual, x_mov, y_mov, nome_player) => {
    //Verifica as bordas
    if( (x_mov>5) || (y_mov>5) )
        return 0;
    if( (x_mov<0) || (y_mov<0) )
        return 0;
    
    //Verifica se não andou na diagonal ou mais de 1 casa
    dif_y = Math.abs((y_atual-y_mov));
    dif_x = Math.abs((x_atual-x_mov));
    if(dif_x+dif_y != 1)
        return 0;
    
    // Verifica se o player ainda está vivo
    var achou = 0;
    for(i in sala.players){
        if (sala.players[i].nick === nome_player){
            achou = 1;
            break;
        }
    }
    if (achou == 0){ return 0; }

    var pos_atual = sala.posicoes[x_atual][y_atual];
    var pos_mov = sala.posicoes[x_mov][y_mov];

    //Sempre que MOEDAS_GERAL coletas atingir LIMITE_UPLOAD, o nível dos monstros recebe aumenta.
    if (utils.MOEDAS_GERAL == utils.LIMITE_UPLOAD){
        utils.DANO_MONSTRO *= utils.CONST_UP;
        utils.VIDA_MONSTRO *= utils.CONST_UP;
        utils.RECOMPENSA_MONTRO *= utils.CONST_UP;
        //Diminui a recompensa de vida até 1
        if(utils.CURA_POTION > 1) utils.CURA_POTION = utils.CURA_POTION/2;

        utils.MOEDAS_GERAL = 0;
    }
    
    // ##################    CURA    
    if(pos_mov.name == 'poção'){
        pos_atual.life += CURA_POTION;
    }

    // ##################    ARMA
    if(pos_mov.tipo == 'arma'){
        if(pos_atual.name == pos_mov.name ){ // Se a arma é do heroi
            if(pos_atual.tipo == "heroi_armado") { // Heroi já está armado => recompensa
                 pos_atual.bounty += utils.RECOMPENSA_GUN;
                 utils.MOEDAS_GERAL += utils.RECOMPENSA_GUN;
            }else{ // Heroi não armado => dobra o dano
                pos_atual.damage = (pos_atual.damage*2)
                pos_atual.tipo = "heroi_armado";
            }
        }else{ // Arma não é do heroi => recompensa
            pos_atual.bounty += utils.RECOMPENSA_GUN;
            utils.MOEDAS_GERAL += utils.RECOMPENSA_GUN;
        }
    }
    
    // ##################    MOEDA
    if(pos_mov.name == 'moeda'){
        pos_atual.bounty += utils.RECOMPENSA_COIN;
        utils.MOEDAS_GERAL += utils.RECOMPENSA_COIN;
    }
    
    // ##################    MONSTRO
    if(pos_mov.tipo == 'monstro'){
        //decrementa a vida do monstro, com o seu dano
        pos_mov.life -= sala.posicoes[x_atual][y_atual].damage;
        //decrementa a sua vida, de acordo com o dano do monstro
        pos_atual.life -= sala.posicoes[x_mov][y_mov].damage;
        
        //verifica se o monstro morreu
        if(pos_mov.life<0){
            pos_atual.bounty += pos_mov.bounty;
        }

        //Verifica se o heroi atacante morreu
        if(pos_atual.life<=0){
            console.log(pos_atual.nick,"MORREU !!");
            for(i in sala.players){
                if (sala.players[i].nick === pos_atual.nick ){
                    utils.vec_func.sort(utils.randOrd);
                    sala.posicoes[x_atual][y_atual] = utils.vec_func[0](x_atual, y_atual); // NÃO alterar para pos_atual
                    sala.players[i].socket.emit('died',  JSON.stringify(sala.posicoes));
                    sala.players.splice(i, 1);
                    break;
                }
            }
            return 2;
        }

        if(pos_mov.life>=0) return 1; //Se nem o monstro nem o heroi morreu
    }    

    // ##################    HEROI
    if(pos_mov.tipo == 'heroi' || pos_mov.tipo == 'heroi_armado' ){
        pos_mov.life -= pos_atual.damage; // Aplica o dano

        // Se o heroi atacado morreu
        if(sala.posicoes[x_mov][y_mov].life<=0){
            console.log(pos_atual.nick,"MATOU",pos_mov.nick,"!!");
            for(i in sala.players){
                if (sala.players[i].nick === pos_mov.nick ){
                    utils.vec_func.sort(utils.randOrd);
                    sala.posicoes[x_mov][y_mov] = utils.vec_func[0](x_mov, y_mov); // NÃO trocar para pos_mov
                    sala.players[i].socket.emit('died', JSON.stringify(sala.posicoes));
                    sala.players.splice(i, 1);
                }
            }
            // Ultimo herói vivo => vence a partida
            if (sala.players.length == 1){
                console.log("VENCEDOR:",sala.players[0]);
                if (sala.players[0].nick === pos_atual.nick ){
                    sala.players[0].socket.emit('win', JSON.stringify(sala.posicoes));
                }
            }
            return 2;
        }
        return 1;
    }    
   
    // Verifica se o player subiu de nível
    x =  parseInt((pos_atual.bounty/10)-(pos_atual.level));
    pos_atual.damage += x;
    pos_atual.life += (x*2);
    pos_atual.level = parseInt(pos_atual.bounty/10);

    // Atualiza o x e y para efetivamente realizar o movimento
    pos_atual.x = x_mov;
    pos_atual.y = y_mov;
    sala.posicoes[x_mov][y_mov] = pos_atual;

    // Gera uma carta aleatória na posição que ficou vazia
    utils.vec_func.sort(utils.randOrd);
    sala.posicoes[x_atual][y_atual] = utils.vec_func[0]( x_atual, y_atual);

    return 1;
}

// Inicia o jogo posicionando os cards
async function iniciar(){
    sala.players.sort(utils.randOrd)
    utils.herois.sort(utils.randOrd);
    sala.posicoes[1][1] = utils.generatePlayer(1,1, sala.players[0].nick, 0)
    sala.posicoes[1][4] = utils.generatePlayer(1,4, sala.players[1].nick, 1)
    sala.posicoes[4][1] = utils.generatePlayer(4,1, sala.players[2].nick, 2)
    sala.posicoes[4][4] = utils.generatePlayer(4,4, sala.players[3].nick, 3)

    for(i=0; i<6;i++){ 
        for(j=0; j<6;j++){
            if(!sala.posicoes[i][j]){ // se a posição ainda não pertence a um heroi
                utils.vec_func.sort(utils.randOrd);
                sala.posicoes[i][j] = utils.vec_func[0](i, j);
            }
        }
    }
}

// Verifica o numero de players na sala
router.get('/numberOfPlayersOnRoom', async (req, res) => {
    return res.send({code: 200, numberOfPlayers: sala.players.length});
})

app.use('/game', router);
app.use(cors);
app.get('/', (req, res) =>{
    res.send('DungeonsDroid');
});
app.listen(options.port, function(){
    console.log(`Servidor rodando na porta ${options.port}`)
});
 
// Configuração do socket.io
io.on('connection', socket => {
    console.log(socket.id, "CONECTADO !!");


    socket.on('disconnect', () => { 
        console.log(socket.id, "DESCONECTADO !!");
    });

    // Quando um player entra na sala
    socket.on('pushPlayer', nick => {
        console.log(nick, " entrou na sala !!");

        sala.players.push({'nick': nick , 'socket' : socket});
        if(sala.players.length == utils.QTD_PLAYERS){ // Se a sala está cheia => inicia a partida
            iniciar()
            io.emit('renderizaMatriz', JSON.stringify(sala.posicoes))
        }else{ // Senão aguarda demais jogadores
            io.emit('newPlayer', sala.players.length)
        }
    })

    // Quando um player movimenta o heroi
    socket.on('movimentaHeroi', (x_atual, y_atual, x_mov, y_mov, nome_player) => {
        var result = movimento(x_atual, y_atual, x_mov, y_mov, nome_player)

        if(result === 0 ){
            socket.emit('invalidMove', "Movimento inválido!")
        }else{
            io.emit('renderizaMatriz', JSON.stringify(sala.posicoes))
        }
    })
})

server.listen(3001);