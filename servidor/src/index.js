const options = {
    host: "localhost",
    port: process.env.PORT || 3000
};

const server = require('http').createServer();
const io = require('socket.io')(server);

const Card = require('./models/card');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./config/cors')
const utils = require('./utils')

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

const sala = utils.criarSala()

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

require('./controlers/auth_controler')(app);
//require('./controlers/sala_controler')(app);
require('./controlers/project_controler')(app);


const router = express.Router();

router.get('/', async (req, res) => {
    return res.send('DungeonsDroid');
});

async function iniciar(){
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
            else{
                console.log(sala.posicoes[i][j])
            }
        }
    }

}

router.post('/movimentar', (req, res) =>{

    const {x_atual, y_atual, x_mov, y_mov} = req.body

    //Verifica as bordas
    if(x_mov>5)
        return res.send({code: 1, message:"Movimento inválido!"})
    if(y_mov>5)
        return res.send({code: 1, message:"Movimento inválido!"})
    if(x_mov<0)
        return res.send({code: 1, message:"Movimento inválido!"})
    if(y_mov<0)
        return res.send({code: 1, message:"Movimento inválido!"})

    console.log("XATUAL : " + x_atual + " YATUAL: " + y_atual + " XMOV: " + x_mov + " YMOV: " + y_mov)
    

    //Verifica se não andou na diagonal ou mais de 1 casa
    dif_y = Math.abs(y_atual - y_mov)
    dif_x = Math.abs(( x_atual - x_mov))
    if(dif_x+dif_y !=1)
        return res.send({code: 1, message:"Movimento inválido!"})

    //Sempre que a quantidade de moedas coletas atingir 100, o nível dos monstros recebe 0.
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
            }
            sala.posicoes[x_atual][y_atual].damage = (sala.posicoes[x_atual][y_atual].damage*2)
            sala.posicoes[x_atual][y_atual].tipo = "heroi_armado";
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
            //se morreu, retorna a matriz
            console.log("CAIU NO MONSTRO MORREU")
            sala.players[0].sock.emit('attMatriz', JSON.stringify(sala.posicoes));
            sala.players[0].sock.broadcast.emit('attMatriz', JSON.stringify(sala.posicoes));
        }

        //verifica se o heroi morreu
        if(sala.posicoes[x_atual][y_atual].life<=0){
            utils.vec_func.sort(utils.randOrd);
            sala.posicoes[x_atual][y_atual] = utils.vec_func[0](x_atual, y_atual);

            var socket
            for(i=0; i < sala.players.length; i++){
                if(sala.players[i].nick == sala.posicoes[x_atual][y_atual].nick){
                    socket = sala.players[i].sock
                }
            }

            socket.emit('died', 0);
            socket.broadcast.emit('attMatriz', JSON.stringify(sala.posicoes));
        }

        sala.posicoes[x_atual][y_atual].bounty += sala.posicoes[x_mov][y_mov].bounty
    }    

    //Verifica se bateu em um heroi
    if(sala.posicoes[x_mov][y_mov].tipo == 'heroi'){
        sala.posicoes[x_mov][y_mov].life -= sala.posicoes[x_atual][y_atual].damage;

        if(sala.posicoes[x_mov][y_mov].life <= 0){
            utils.vec_func.sort(utils.randOrd);
            sala.posicoes[x_mov][y_mov] = sala.posicoes[x_atual][y_atual]
            sala.posicoes[x_mov][y_mov].x = x_mov
            sala.posicoes[x_mov][y_mov].y = y_mov
            sala.posicoes[x_atual][y_atual] = utils.vec_func[0](x_atual, y_atual);
            
            var socket
            for(i=0; i < sala.players.length; i++){
                
                if(sala.players[i].nick == sala.posicoes[x_atual][y_atual].nick){
                    socket = sala.players[i].sock
                }
            }

            socket.emit('died', 0);
            socket.broadcast.emit('attMatriz', JSON.stringify(sala.posicoes));
        }
    }    
   
    //a posição que deseja mover recebe o objeto q esta na posição atual.
    //sala.posicoes[x_mov][y_mov] = 
    c = new Card();
    c =  sala.posicoes[x_atual][y_atual];
    x =  parseInt((c.bounty/10)-(c.level));
    c.damage += x;
    c.life += (x*2);
    c.level = parseInt(c.bounty/10);

    //atualizou o x e y, do atual pro novo
    c.x = x_mov;
    c.y = y_mov;

    var socket
    for(i=0; i < sala.players.length; i++){
        console.log(sala.players[i].nick, sala.posicoes[x_atual][y_atual])
        if(sala.players[i].nick == sala.posicoes[x_atual][y_atual].nick){
            socket = sala.players[i].sock
        }
    }

    utils.vec_func.sort(utils.randOrd);

    n = utils.vec_func[0]( x_atual, y_atual)
    sala.posicoes[x_mov][y_mov] = c;
    sala.posicoes[x_atual][y_atual] = n

    

    //console.log(socket)

    socket.emit('attMatriz', JSON.stringify(sala.posicoes))
    socket.broadcast.emit('attMatriz', JSON.stringify(sala.posicoes))

    return res.send({code:0, message: "Movimento válido."})
})


function movimentar(x_atual, y_atual, x_mov, y_mov) {
    //Verifica as bordas
    if(x_mov>5)
        return 1
    if(y_mov>5)
        return 1
    if(x_mov<0)
        return 1
    if(y_mov<0)
        return 1

    console.log("XATUAL : " + x_atual + " YATUAL: " + y_atual + " XMOV: " + x_mov + " YMOV: " + y_mov)
    

    //Verifica se não andou na diagonal ou mais de 1 casa
    dif_y = Math.abs(y_atual - y_mov)
    dif_x = Math.abs(( x_atual - x_mov))
    if(dif_x+dif_y !=1)
        return 1

    //Sempre que a quantidade de moedas coletas atingir 100, o nível dos monstros recebe 0.
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
                 console.log("achou a arma mas ja tem");
                 sala.posicoes[x_atual][y_atual].bounty += RECOMPENSA_GUN;
                 MOEDAS_GERAL += RECOMPENSA_GUN;
            }
            sala.posicoes[x_atual][y_atual].damage = (sala.posicoes[x_atual][y_atual].damage*2)
            sala.posicoes[x_atual][y_atual].tipo = "heroi_armado";
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
            //se morreu, retorna a matriz
            console.log("CAIU NO MONSTRO MORREU")
            return 0
        }

        //verifica se o heroi morreu
        if(sala.posicoes[x_atual][y_atual].life<=0){
            utils.vec_func.sort(randOrd);
            sala.posicoes[x_atual][y_atual] = vec_func[0](x_atual, y_atual);

            return 2
        }

        sala.posicoes[x_atual][y_atual].bounty += sala.posicoes[x_mov][y_mov].bounty
    }    

    //Verifica se bateu em um heroi
    if(sala.posicoes[x_mov][y_mov].tipo == 'heroi'){
        sala.posicoes[x_mov][y_mov].life -= sala.posicoes[x_atual][y_atual].damage;

        if(sala.posicoes[x_mov][y_mov].life <= 0){
            vec_func.sort(randOrd);
            sala.posicoes[x_mov][y_mov] = sala.posicoes[x_atual][y_atual]
            sala.posicoes[x_mov][y_mov].x = x_mov
            sala.posicoes[x_mov][y_mov].y = y_mov
            sala.posicoes[x_atual][y_atual] = utils.vec_func[0](x_atual, y_atual);
            return 3
        }
    }    
   
    //a posição que deseja mover recebe o objeto q esta na posição atual.
    //sala.posicoes[x_mov][y_mov] = 
    c = new Card();
    c =  sala.posicoes[x_atual][y_atual];
    x =  parseInt((c.bounty/10)-(c.level));
    c.damage += x;
    c.life += (x*2);
    c.level = parseInt(c.bounty/10);

    //atualizou o x e y, do atual pro novo
    c.x = x_mov;
    c.y = y_mov;

    utils.vec_func.sort(utils.randOrd);

    n = utils.vec_func[0]( x_atual, y_atual)
    sala.posicoes[x_mov][y_mov] = c;
    sala.posicoes[x_atual][y_atual] = n

    return 0
}

router.get('/numberOfPlayersOnRoom', async (req, res) => {
    return res.send({code: 200, numberOfPlayers: sala.players.length});
})

app.use('/game', router)

app.use(cors);

app.get('/', (req, res) =>{
    res.send('DungeonsDroid');
});

app.listen(options.port, function(){
    console.log(`Servidor rodando na porta ${options.port}`)
})


function getIdSocket(x, y){
    for(i = 0; i < sala.players.length; i++){
        if(sala.posicoes[x][y].nickname = sala.players[i].nick)
            return sala.players[i].id_socket
    }
}

io.on('connection', socket => {
    console.log("CLIENT CONNECT >> " + socket.id)

    socket.on('disconnect', () => { console.log("CLIENT DISCONNECTED >> " + socket.id) });

    socket.on('pushPlayer', nickname => {
        console.log("PUSH PLAYER: " + nickname)
        sala.players.push({nick: nickname, sock: socket})

        //console.log(socket)

        if(sala.players.length == 4){
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

    socket.on('movimento', (x_atual, y_atual, x_mov, y_mov) => {
        
        var result = movimentar(x_atual, y_atual, x_mov, y_mov)

        console.log("MOVIMENTO : RESULTADO " + result)

        switch(result){
            // Movimento válido
            case 0:
                socket.emit('attMatriz', JSON.stringify(sala.posicoes))
                socket.broadcast.emit('attMatriz', JSON.stringify(sala.posicoes))
                break;
            // Movimento inválido
            case 1:
                socket.emit('moveInvalid')
                break;
            // Movimento válido, mas o player morreu
            case 2:
                socket.emit('died', 'Você perdeu!')
                socket.broadcast.emit('attMatriz', JSON.stringify(sala.posicoes))
                break;
            // Movimento válido com um player derrotado
            case 3:
                var id_socket = getIdSocket(x_mov, y_mov)

                if (io.sockets.connected[id_socket]) {
                    io.sockets.connected[id_socket].emit('died', 'Você perdeu!');
                }
                socket.broadcast.emit('attMatriz', JSON.stringify(sala.posicoes))
                break;
        }
            
    })


})

server.listen(3001);