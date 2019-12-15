const options = {
    host: "localhost",
    port: process.env.PORT || 3000
};

const bodyParser = require('body-parser');
const cors = require('./config/cors')
const utils = require('./utils')
const Sala = require('./models/sala');
const Card = require('./models/card');


var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
require('./controlers/auth_controler')(app);

const sala = new Sala({
    posicoes:[[],[],[],[],[],[]], 
    players:[]
});
/// 8 monstros, 6 potes, 4 armas, 14 moedas

function randOrd() {
    return (Math.round(Math.random())-0.5);
}

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

var monstros = ["alien","aranha","cogumelo","esqueleto","javali","medusa","morcego","zumbi"];

var herois  = ["androide","barbaro","templario","ninja","ceifadora","elfo","necromante"]

var armas  = []


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

const cria_monstro = (x, y) =>{
    monster = new Card();
    monster.tipo = "monstro";
    monstros.sort(randOrd);
    monster.name = monstros[0];
    monster.image = monstros[0];
    monster.level = 1;
    monster.life = VIDA_MONSTRO;
    monster.damage = DANO_MONSTRO;
    monster.bounty = RECOMPENSA_MONTRO;
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
    armas.sort(randOrd);
    arma.name = armas[0];
    arma.tipo = "arma";
    arma.image = armas[0];
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
    armas.push(herois[0]);
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

const vec_func = [cria_moeda,cria_moeda, cria_moeda, cria_moeda, cria_monstro, cria_monstro, cria_pot,cria_pot,cria_pot, cria_arma, cria_monstro, ]

const router = express.Router();

//Esse é o metodo q vai iniciar a partida
const iniciar = () =>{
    sala.players.sort(randOrd);
    sala.posicoes[1][1] = cria_player(1,1, sala.players[0].nickname)
    sala.posicoes[1][4] = cria_player(1,4, sala.players[1].nickname)  
    sala.posicoes[4][1] = cria_player(4,1, sala.players[2].nickname)  
    sala.posicoes[4][4] = cria_player(4,4, sala.players[3].nickname)  


    for(i=0; i<6;i++){ 
        for(j=0; j<6;j++){
            if(!sala.posicoes[i][j]){
                vec_func.sort(randOrd);
                sala.posicoes[i][j] = vec_func[0](i, j);
            }else{
                console.log(i, j)
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

    //Sempre que a quantidade de moedas coletas atingir 100, o nível dos mosntros recebe 0.
    if (MOEDAS_GERAL == LIMITE_UPLOAD - 1){
        DANO_MONSTRO *= CONST_UP;
        VIDA_MONSTRO *= CONST_UP;
        RECOMPENSA_MONTRO *= CONST_UP;

        if(CURA_POTION > 1) CURA_POTION = CURA_POTION/2;

        MOEDAS_GERAL = 0;
    }
    
    //Se achou cura    
    if(sala.posicoes[x_mov][y_mov].name == 'poção'){
        sala.posicoes[x_atual][y_atual].life += CURA_POTION;
    }    
    // Se achou arma
    if(sala.posicoes[x_mov][y_mov].tipo == 'arma'){
        if(sala.posicoes[x_atual][y_atual].name == sala.posicoes[x_mov][y_mov].name){
            if( sala.posicoes[x_atual][y_atual].tipo == "heroi_armado"){
                 sala.posicoes[x_atual][y_atual].bounty += RECOMPENSA_GUN;
                 MOEDAS_GERAL += RECOMPENSA_GUN;
            }else{
                sala.posicoes[x_atual][y_atual].damage = (sala.posicoes[x_atual][y_atual].damage*2)
                sala.posicoes[x_atual][y_atual].tipo = "heroi_armado";
            }
        }else{
            sala.posicoes[x_atual][y_atual].bounty += RECOMPENSA_GUN;
            MOEDAS_GERAL += RECOMPENSA_GUN;
        }
    }
    
    //Se achou moeda
    if(sala.posicoes[x_mov][y_mov].name == 'moeda'){
        sala.posicoes[x_atual][y_atual].bounty += RECOMPENSA_COIN;
        MOEDAS_GERAL += RECOMPENSA_COIN;
    }
    
    //Se achou monstro
    if(sala.posicoes[x_mov][y_mov].tipo == 'monstro'){

        //decrementa a vida do monstro, com o seu dano
        sala.posicoes[x_mov][y_mov].life -= sala.posicoes[x_atual][y_atual].damage;

        //decrementa a sua vida, de acordo com o dano do monstro
        sala.posicoes[x_atual][y_atual].life -= sala.posicoes[x_mov][y_mov].damage;
        
        //verifica se o monstro nao morreu
        if(sala.posicoes[x_mov][y_mov].life>0){
            //se nao morreu morreu, retorna a matriz
            return 1
        }

        //verifica se o heroi morreu
        if(sala.posicoes[x_atual][y_atual].life<=0){
            vec_func.sort(randOrd);
            sala.posicoes[x_atual][y_atual] = vec_func[0](x_atual, y_atual);

            //MORREU TIRA DO SOCKET RPA ELE NAO PODER MAIS MECHER
            //sala.player.remove([x_atual][x_atual].nick) esse codigo sera utilizado
            return 2
        }

        sala.posicoes[x_atual][y_atual].bounty += sala.posicoes[x_mov][y_mov].bounty;
    }    

    //Verifica se bateu em um heroi
    if(sala.posicoes[x_mov][y_mov].tipo == 'heroi'){
        sala.posicoes[x_mov][y_mov].life -= sala.posicoes[x_atual][y_atual].damage;

        if(sala.posicoes[x_mov][y_mov].life>0){
            //se morreu, retorna a matriz
            //sala.player.remove([x_mov][y_mov].nick) esse codigo sera utilizado

            return 2
        }
    }    
   
    //a posição que deseja mover recebe o objeto q esta na posição atual.
    //sala.posicoes[x_mov][y_mov] =  
    x =  parseInt((c.bounty/10)-(c.level));
    sala.posicoes[x_atual][y_atual].damage += x;
    sala.posicoes[x_atual][y_atual].life += (x*2);
    sala.posicoes[x_atual][y_atual].level = parseInt(c.bounty/10);

    //atualizou o x e y, do atual pro novo
    sala.posicoes[x_atual][y_atual].x = x_mov;
    sala.posicoes[x_atual][y_atual].y = y_mov;

    sala.posicoes[x_mov][y_mov] = sala.posicoes[x_atual][y_atual];;
    sala.posicoes[x_atual][y_atual] = vec_func[0]( x_atual, y_atual);

    return 1
}

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
});


app.use(cors);
app.use(router);

http.listen(3000, function(){
    console.log('listening on *:3000');
});
  
io.on('connection', socket => {
    socket.on('disconnect', () => { 
        console.log("O player " + socket.id + "desconectou.") 
    });

    socket.on('entrarSala', nickname => {
        sala.players.push({nick: {'socket': socket, 'name': nick}})
       
        console.log("O player ", nick, "se conectou.")

        if(sala.players.length == 4){
            iniciar()
            io.emit('renderizaMatriz', JSON.stringify(sala.posicoes))
        }else{
            io.emit('cadastraPlayer', sala.players.length)
        }
    })

    socket.on('movimentarHeroi', (x_atual, y_atual, x_mov, y_mov, nome_player) => {
        movimento(x_atual, y_atual, x_mov, y_mov, nome_player)
        io.emit('renderizaMatriz', JSON.stringify(sala.posicoes))
    })
})
