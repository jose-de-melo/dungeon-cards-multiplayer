const mongoose = require('../database');
const bcrypt =  require('bcryptjs');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    //pontos de liga
    PDL : {
        type: Number,
        default: 0,
    },
    vitorias : {
        type: Number,
        default: 0,
    },
    derrotas : {
        type: Number,
        default: 0,
    },
    createAt: {
        type: Date,
        default: Date.now,
    }
});

UserSchema.pre('save', async function(next){
    const hash =  await bcrypt.hash(this.password, 10);
    this.password = hash;   
    next();
});

const User =  mongoose.model('User', UserSchema);

module.exports = User;