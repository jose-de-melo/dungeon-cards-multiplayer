const Sala = require('./models/sala');
const Card = require('./models/card');
const User = require('./models/user');

// Vetores de geração aleatória
exports.herois = ["androide","barbaro","templario","ninja","ceifadora","elfo","necromante"]
exports.monstros = ["alien","aranha","cogumelo","esqueleto","javali","medusa","morcego","zumbi"];
exports.armas  = []


// Quantidade de players para o jogo
exports.QTD_PLAYERS = 4;

// Valores de recompensa
exports.CURA_POTION = 2;
exports.RECOMPENSA_COIN = 1;
exports.RECOMPENSA_GUN = 1;

// Valores que controlam o nível dos monstros
exports.MOEDAS_GERAL = 0;
exports.DANO_MONSTRO = 2;
exports.VIDA_MONSTRO = 6;
exports.RECOMPENSA_MONSTRO = 5;

// Quando as MOEDAS_GERAL atingirem esse valor o DANO_MONSTRO e VIDA_MOSTRO, são multiplicados pelo valor de CONST_UP
exports.LIMITE_UPLOAD = 50;
exports.CONST_UP = 2;

const PDL_WIN = 2;
const PDL_LOSE = 1;

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
    monster.level = 1;
    monster.life = this.VIDA_MONSTRO;
    monster.damage = this.DANO_MONSTRO;
    monster.bounty = this.RECOMPENSA_MONSTRO;
    monster.x = x;
    monster.y = y;

    // Parte de gerar monstro aleatorio
    this.monstros.sort(this.randOrd);
    monster.name = this.monstros[0];
    monster.image = this.monstros[0];
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

exports.vitoria = async (name) => {
    const user = await User.findOne({ name });
    user.PDL += PDL_WIN;
    user.vitorias += 1;

    await User.updateOne({_id : user.id}, user);
}

exports.derrota = async (name, posicao) => {
    const user = await User.findOne({ name });

    user.PDL -= posicao - PDL_LOSE;
    user.derrotas += 1;

    await User.updateOne({_id: user.id}, user)
}

exports.vec_func = [this.generateCoins, this.generateMonsters, this.generateMonsters, 
    this.generatePotions, this.generatePotions, this.generatePotions, this.generateGun, 
    this.generateMonsters, this.generateCoins, this.generateCoins, 
    this.generateCoins
   ]