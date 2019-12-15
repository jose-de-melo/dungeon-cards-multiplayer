const options = {
    host: "localhost",
    port: process.env.PORT || 3000
};

//Bibliotecas externas
const bodyParser = require('body-parser');
const cors = require('./config/cors');
const utils = require('./utils');
const Sala = require('./models/sala');
const Card = require('./models/card');

require('./controlers/auth_controler')(app);

//Sockets
var express = require('express');
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//Sala possui matriz e players // 8 monstros, 6 potes, 4 armas, 14 moedas
const sala = new Sala({
    posicoes:[[],[],[],[],[],[]], 
    players:[]
});

//Gerar numeros aleatorios
function randOrd() {
    return (Math.round(Math.random())-0.5);
}

const QTD_PLAYERS = 4;

// Valores de recompensa
const CURA_POTION = 2;
const RECOMPENSA_COIN = 1;
const RECOMPENSA_GUN = 1;

// Valores que controlam o nível dos monstros
var MOEDAS_GERAL = 0;
var DANO_MONSTRO = 2;
var VIDA_MONSTRO = 6;
var RECOMPENSA_MONTRO = 5;
// Quando as MOEDAS_GERAL atingirem esse valor o DANO_MONSTRO e VIDA_MOSTRO, são multiplicados pelo valor de CONST_UP
var LIMITE_UPLOAD = 100;
const CONST_UP = 2; 

//Vetores de geração aleatoria
var monstros = ["alien","aranha","cogumelo","esqueleto","javali","medusa","morcego","zumbi"];
var herois  = ["androide","barbaro","templario","ninja","ceifadora","elfo","necromante"];
var armas  = [];
const vec_func = [cria_moeda,cria_moeda, cria_moeda, cria_moeda, cria_monstro, cria_monstro, cria_pot,cria_pot,cria_pot, cria_arma, cria_monstro, ];

//Middleware, trabalhando com JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

const cria_monstro = (x, y) =>{
    monster = new Card();
    monster.tipo = "monstro";
    monster.level = 1;
    monster.life = VIDA_MONSTRO;
    monster.damage = DANO_MONSTRO;
    monster.bounty = RECOMPENSA_MONTRO;
    monster.x = x;
    monster.y = y;
    // Parte aleatória da geração de monstros
    monstros.sort(randOrd);
    monster.name = monstros[0];
    monster.image = monstros[0];
    
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
    arma.tipo = "arma";
    arma.level = 0;
    arma.life = 0;
    arma.x = x;
    arma.y = y;
    arma.damage = 0;
    arma.bounty = 0;
    //Parte aleatoria da geração de armas
    armas.sort(randOrd);
    arma.name = armas[0];
    arma.image = armas[0];

    return arma;
}

const cria_player = (x, y, nick, pos) =>{
    p = new Card();
    p.name = herois[pos];
    armas.push(herois[pos]);
    p.tipo = "heroi";
    p.nick = nick;
    p.image = herois[pos];
    p.level = 0;
    p.life = 15;
    p.damage = 2;
    p.bounty = 0;
    p.x = x;
    p.y = y;
    return p;
}

//Esse é o metodo q vai iniciar a partida
const iniciar = () =>{
    //Sorteia a ordem e herois para os jogadores
    sala.players.sort(randOrd);
    herois.sort(randOrd);

    //Posicioando jogadores
    sala.posicoes[1][1] = cria_player(1,1, sala.players[0].nick, 0)
    sala.posicoes[1][4] = cria_player(1,4, sala.players[1].nick, 1)  
    sala.posicoes[4][1] = cria_player(4,1, sala.players[2].nick, 2)  
    sala.posicoes[4][4] = cria_player(4,4, sala.players[3].nick, 3)  

    for(i=0; i<6;i++){ 
        for(j=0; j<6;j++){
            if(!sala.posicoes[i][j]){ //se ainda não foi prechido, gera qualquer coisa.
                vec_func.sort(randOrd);
                sala.posicoes[i][j] = vec_func[0](i, j);
            }else{
                //console.log(i, j) //é heroi
            }
        }
    } 
};

//Esse é o metodo q movimenta o jogador
const movimento = (x_atual, y_atual, x_mov, y_mov, nome_player) => {
    //Verifica as bordas
    if(x_mov>5)
        return 0;
    if(y_mov>5)
        return 0;
    if(x_mov<0)
        return 0;
    if(y_mov<0)
        return 0;
    
    //Verifica se não andou na diagonal ou mais de 1 casa
    dif_y = Math.abs((y_atual-y_mov))
    dif_x = Math.abs((x_atual-x_mov))
    if(dif_x+dif_y !=1)
        return 0;

    //console.log(nome_player)
    var p_name;

    //Verifica se o player ainda está vivo
    var achou = 0;
    for(i in sala.players){
        if (sala.players[i].nick === nome_player){
            p_name = nome_player;
            achou = 1
            break;
        }
    }
    if (achou == 0){ return 0; } //Se não achou o player ele está morto

    //Salvando posições
    var pos_atual = sala.posicoes[x_atual][y_atual];
    var pos_mov = sala.posicoes[x_mov][y_mov];

    //Sempre que a quantidade de moedas coletas atingir 100, o nível dos monstros aumenta.
    if (MOEDAS_GERAL == LIMITE_UPLOAD - 1){
        DANO_MONSTRO *= CONST_UP;
        VIDA_MONSTRO *= CONST_UP;
        RECOMPENSA_MONTRO *= CONST_UP;
        //Diminui a cura até 1
        if(CURA_POTION > 1) CURA_POTION = CURA_POTION/2;
        // Zera o contador
        MOEDAS_GERAL = 0;
    }
    
    //Se achou cura    
    if(pos_mov.name == 'poção'){
        pos_atual.life += CURA_POTION;
    }    

    // Se achou arma
    if(pos_mov.tipo == 'arma'){
        if(pos_atual.name == pos_mov.name){ // A arma é do heroi
            if( pos_atual.tipo == "heroi_armado"){ //Heroi já está armado => recompensa.
                 pos_atual.bounty += RECOMPENSA_GUN;
                 MOEDAS_GERAL += RECOMPENSA_GUN;
            }else{ // Heroi não armado => dobra o dano
                pos_atual.damage = (pos_atual.damage*2)
                pos_atual.tipo = "heroi_armado";
            }
        }else{ // Arma não é do heroi
            pos_atual.bounty += RECOMPENSA_GUN;
            MOEDAS_GERAL += RECOMPENSA_GUN;
        }
    }
    
    //Se achou moeda
    if(pos_mov.name == 'moeda'){
        pos_atual.bounty += RECOMPENSA_COIN;
        MOEDAS_GERAL += RECOMPENSA_COIN;
    }
    
    //Se achou monstro
    if(pos_mov.tipo == 'monstro'){
        pos_mov.life -= pos_atual.damage; //decrementa a vida do monstro, com o seu dano
        pos_atual.life -= pos_mov.damage; //decrementa a sua vida, de acordo com o dano do monstro
        
        //Se monstro morreu, heroi recebe recompensa
        if(pos_mov.life<0){
            pos_atual.bounty += pos_mov.bounty;
        }

        //verifica se o heroi morreu
        if(pos_atual.life<=0){
            console.log(pos_atual.nick+"MORREU")
            for(i in sala.players)
                if (sala.players[i].nick === pos_atual.nick ){
                    vec_func.sort(randOrd);
                    sala.posicoes[x_atual][y_atual] = vec_func[0](x_atual, y_atual); //NÃO alterar para pos_atual
                    sala.players[i].socket.emit('died',  JSON.stringify(sala.posicoes));
                    sala.players.splice(i, 1);
                    break;
                }
            return 2;
        }
    }    

    //Se achou heroi
    if(pos_mov.tipo == 'heroi' || pos_mov.tipo == 'heroi_armado' ){
        pos_mov.life -= pos_atual.damage;

        //Se o heroi atacado morreu
        if(pos_mov.life<=0){
            console.log(pos_mov.nick+"MORREU");
            for(i in sala.players)
                if (sala.players[i].nick === pos_mov.nick ){
                    vec_func.sort(randOrd);
                    sala.posicoes[x_mov][y_mov] = vec_func[0](x_mov, y_mov); //NÃO alterar para pos_mov
                    sala.players[i].socket.emit('died', JSON.stringify(sala.posicoes));
                    sala.players.splice(i, 1);
                    break;
                }
            return 2;
        }
        return 1;
    }    
   
    //Verificando se o player subiu de nível.
    x =  parseInt((pos_atual.bounty/10)-(pos_atual.level));
    sala.posicoes[x_atual][y_atual].damage += x;
    sala.posicoes[x_atual][y_atual].life += (x*2);
    sala.posicoes[x_atual][y_atual].level = parseInt(pos_atual.bounty/10);

    //Atualizando o x e y, do atual pro novo => assim realizando o movimento
    sala.posicoes[x_atual][y_atual].x = x_mov;
    sala.posicoes[x_atual][y_atual].y = y_mov;
    sala.posicoes[x_mov][y_mov] = sala.posicoes[x_atual][y_atual];

    //Gerando uma carta aleatória na posição que ficou vazia
    vec_func.sort(randOrd);
    sala.posicoes[x_atual][y_atual] = vec_func[0]( x_atual, y_atual);

    return 1;
}
  
io.on('connection', socket => {
    console.log("Socket:",socket.id,"CONECTADO !!");

    //Desconectado.
    socket.on('disconnect', () => { 
        console.log("Socket:",socket.id,"DESCONECTADO !!");
    });

    //Player entrou na sala
    socket.on('entraSala', nick => {
        console.log("Player",nick,"ENTROU NA SALA !!");
        
        sala.players.push({'nick': nick , 'socket' : socket})
        if(sala.players.length == QTD_PLAYERS){ //se a sala encheu => inicia o jogo
            iniciar()
            io.emit('renderizaMatriz', JSON.stringify(sala.posicoes))
        }else{ // se ainda não encheu => aguarda
            io.emit('cadastraPlayer', sala.players.length)
        }
    })

    // Player realizou movimento
    socket.on('movimentaHeroi', (x_atual, y_atual, x_mov, y_mov, nome_player) => {
        movimento(x_atual, y_atual, x_mov, y_mov, nome_player)
        io.emit('renderizaMatriz', JSON.stringify(sala.posicoes))
    })
})

//Inicia o server para escutar na porta 3000
server.listen(3000, function(){
    console.log('Girando e Rodando, Silvio! Qual porta vc vai escolher? 3000');
});