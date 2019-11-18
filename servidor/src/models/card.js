const mongoose = require('../database');
const bcrypt =  require('bcryptjs');

const CardSchema = mongoose.Schema({
    nick: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    life : {
        type: Number,
        default: 0,
    },
    damage : {
        type: Number,
        default: 0,
    },
    bounty : {
        type: Number,
        default: 0,
    }
});

const Card =  mongoose.model('Card', CardSchema);

module.exports = Card;