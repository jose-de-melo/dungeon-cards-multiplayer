//Um exemplo de projeto utilizando o middleware com validação de tokens


//Exemplo de token:
//          Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... etc etc
const express = require('express');
const authMiddleware = require('../middlewares/auth')

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res)=>{
    res.send({
        ok: true,
        //retornando o id do usuario
        //caso seja necessario identificar qual usuario esta executando a requisiçã
        user: req.userId
    });
});

module.exports = app => app.use('/projects', router);