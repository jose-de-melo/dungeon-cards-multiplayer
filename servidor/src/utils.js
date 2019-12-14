const Sala = require('./models/sala');
const Card = require('./models/card');


exports.herois = ["androide","barbaro","templario","ninja","ceifadora","elfo","necromante"]
exports.monstros = ["alien","aranha","cogumelo","esqueleto","javali","medusa","morcego","zumbi"];

exports.randOrd = () => {
    return (Math.round(Math.random())-0.5);
}

exports.criarSala =  () =>{
    return new Sala({
        posicoes:[[],[],[],[],[],[]], 
        players:[]
    });
}

exports.generateCoins = (lista) => {
    for(i=0; i<14;i++){
        coin = new Card();
        coin.type = 4;
        coin.name = "moeda";
        coin.image = "moeda";
        coin.level = 0;
        coin.life = 0;
        coin.damage = 0;
        coin.bounty = 1;
        coin.tipo = "item"
        lista.push(coin);
    }
}

exports.generateMonsters = (lista, monstros) => {
    for(i=0; i<8;i++){
        monster = new Card();
        monster.type = 2;
        monster.name = monstros[i];
        monster.image = monstros[i];
        monster.tipo = "monstro"
        monster.level = 1;
        monster.life = 6;
        monster.damage = 2;
        monster.bounty = 3;
        lista.push(monster);
    }
}

exports.generatePotions = (lista) => {
    // ALTERAR AQUI, VOLTAR PARA i<10
    for(i=0; i<14;i++){
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
}

exports.generatePlayer = (heroi, player, sala, x, y) => {
    p = new Card();
    p.name = heroi;
    p.type = 0;
    p.nick = player.nickname;
    p.level = 1;
    p.life = 15;
    p.damage = 2;
    p.bounty = 0;
    p.x = x;
    p.y = y;
    sala.posicoes[x][y] = p;
}

exports.generateGun = (lista, heroi) => {
    arma = new Card();
    arma.name = heroi;
    arma.type = 1;
    arma.image = heroi + ".png";
    arma.level = 0;
    arma.life = 0;
    arma.damage = 0;
    arma.bounty = 0;
    lista.push(arma);
}