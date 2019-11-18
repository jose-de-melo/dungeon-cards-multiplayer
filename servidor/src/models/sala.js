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


const Sala =  mongoose.model('Sala', SalaSchema);

module.exports = Sala;