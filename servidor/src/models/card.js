const mongoose = require('../database');
const bcrypt =  require('bcryptjs');

const CardSchema = mongoose.Schema({
    nick: {
        type: String,
        required: true,
        unique: true
    },
    level:{
        type: Number,
        default: 1
    },
    name:{
        type: String
    },
    tipo:{
        type: String
    },
    x:{
        type: Number
    },
    y:{
        type: Number
    },
    image: {
        type: String,
        required: true
    },
    life : {
        type: Number,
        default: 0
    },
    damage : {
        type: Number,
        default: 0
    },
    bounty : {
        type: Number,
        default: 0
    }
});

const Card =  mongoose.model('Card', CardSchema);

module.exports = Card;