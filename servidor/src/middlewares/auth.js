const jwt =  require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = (req, res, next) =>{
    console.log("O token está sendo verificado");

    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({error: "No token provided."});
    
    //Um token jwt sempre começa com Bearer e um hash aleatorio
    const parts = authHeader.split(' ');
    
    if(!parts.lenght === 2)
        return res.status(401).send({error: "Token error."});
    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({error: "Token format error."})
    
    jwt.verify(token, authConfig.secret, (err, decoded)=>{
        if(err) return res.status(401).send({ error: "Token Invalido."})

        req.userId = decoded.id;
        return next();
    });
};