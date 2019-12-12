const Sala = require('./models/sala');
const Card = require('./models/card');


exports.herois = ["androide","barbaro","templario","ninja","ceifadora","elfo","necromante"]
exports.monstros = ["alien.png","aranha.png","cogumelo.png","esqueleto.png","javali.png","medusa.png","morcego.png","zumbi.png"];

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
        coin.image = "coin.png";
        coin.level = 0;
        coin.life = 0;
        coin.damage = 0;
        coin.bounty = 1;
        lista.push(coin);
    }
}

exports.generateMonsters = (lista, monstros) => {
    for(i=0; i<8;i++){
        monster = new Card();
        monster.type = 2;
        monster.name = monstros[i].replace(".png","");
        monster.image = monstros[i];
        monster.level = 1;
        monster.life = 6;
        monster.damage = 2;
        monster.bounty = 3;
        lista.push(monster);
    }
}

