const mongoose = require('../database');
const bcrypt =  require('bcryptjs');

const SalaSchema = mongoose.Schema({
    posicoes: {
        type: Object,
        required: true,
    },
    players: {
        type: Object,
        required: true,
    }
});

/*SalaSchema.pre('save', async function(next){
    const hash =  await bcrypt.hash(this.password, 10);
    this.password = hash;   

    next();
});*/

const Sala =  mongoose.model('Sala', SalaSchema);

module.exports = Sala;