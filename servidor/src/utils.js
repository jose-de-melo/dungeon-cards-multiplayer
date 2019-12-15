const Sala = require('./models/sala');
const Card = require('./models/card');


exports.herois = ["androide","barbaro","templario","ninja","ceifadora","elfo","necromante"]
exports.monstros = ["alien","aranha","cogumelo","esqueleto","javali","medusa","morcego","zumbi"];
exports.armas  = []

exports.randOrd = () => {
    return (Math.round(Math.random())-0.5);
}

exports.criarSala =  () =>{
    return new Sala({
        posicoes:[[],[],[],[],[],[]], 
        players:[]
    });
}

exports.generateCoins = (x, y) => {
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

exports.generateMonsters = (x, y) =>{
    monster = new Card();
    monster.tipo = "monstro";
    this.monstros.sort(this.randOrd);
    monster.name = this.monstros[0];
    monster.image = this.monstros[0];
    monster.level = 1;
    monster.life = 6;
    monster.damage = 2;
    monster.bounty = 5;
    monster.x = x;
    monster.y = y;
    return monster;
}

exports.generatePotions = (x, y) =>{
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

exports.generatePlayer = (x, y, nick, pos) =>{
    p = new Card();
    p.name = this.herois[pos];
    this.armas.push(this.herois[pos]);
    p.tipo = "heroi";
    p.nick = nick;
    p.image = this.herois[pos];
    p.level = 0;
    p.life = 15;
    p.damage = 2;
    p.bounty = 0;
    p.x = x;
    p.y = y;
    return p;
}

exports.generateGun = (x, y) =>{
    arma = new Card();
    this.armas.sort(this.randOrd);
    arma.name = this.armas[0];
    arma.tipo = "arma";
    arma.image = this.armas[0];
    arma.level = 0;
    arma.life = 0;
    arma.x = x;
    arma.y = y;
    arma.damage = 0;
    arma.bounty = 0;
    return arma;
}


exports.vec_func = [this.generateCoins, this.generateMonsters, this.generateMonsters, 
                    this.generatePotions, this.generatePotions, this.generatePotions, this.generateGun, 
                    this.generateMonsters, this.generateCoins, this.generateCoins, 
                    this.generateCoins
                   ]