const express = require('express');
const Sala = require('../models/sala');

const router = express.Router();

router.get('/', async (req,res)=> {
    const salas = await Sala.find();
    return res.send(salas);
});

router.get('/create', async (req,res)=> {

    try {
        const sala = await Sala.create({
            posicoes:[[],[],[],[],[],[]], 
            players:[]
        });

        return res.send({ sala }) 

    }catch (err){
        console.log(err);
        return res.status(400).send({error : 'Falha ao cadastrar sala.'});
    }
});

router.delete('/:id', async (req,res)=> {
    const id = req.params.id

    const resp = await Sala.deleteOne({ _id: id })
    if (!resp.deletedCount)
        return res.status(400).send({ error : "Sala não cadastrada.", id});

    return res.send({status: "deletada", sala: id}) 
});

router.post('/join', async (req,res)=> {
    const { nickname, socket, id_sala } = req.body;

    const sala = await Sala.findOne({ _id: id_sala})
    if(!sala) 
        return res.status(400).send({ error: "Sala não cadastrada.", id_sala}) 

    const nplayers = sala.players.length
    if(nplayers == 4) 
        return res.status(400).send({ error: "Esta sala está completa.", id_sala}) 

    /* 
    Posições para iniciar players se considerado tamanho máximo 
    da matriz 6x6, em /create foi criado com 6 linhas.
        sala.posicoes[1][1]
        sala.posicoes[1][4]
        sala.posicoes[4][1]
        sala.posicoes[4][4]
    */
    linha = (nplayers <= 1)? 1 : 4
    coluna = (nplayers % 2 == 0)? 1 : 4

    sala.posicoes[linha][coluna] = nickname
    sala.players.push({nickname, socket})

    const resp = await Sala.update({_id: sala.id }, sala)
    if(!resp.nModified) return res.status(400).send({ error: "Não foi possível entrar na sala.", id_sala}) 

    return res.send({ status: "O player entrou na sala.", sala, linha, coluna}) 
});


module.exports = app => app.use('/salas', router);
    