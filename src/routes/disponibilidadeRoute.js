const express = require('express');
const router = express.Router();
const Reservas = require('../models/reservasModel')

router.post('/', async (req, res) => {
    var body = req.body;
    const resInicioEm = await Reservas.findOne({inicioEm: req.body.inicioEm});
    console.log(resInicioEm);
    console.log(resInicioEm.tipo);
    console.log(req.body.tipo);
    if(resInicioEm.tipo == req.body.tipo.toUpperCase()){
        let inicioEmHourBefore = parseInt(body.inicioEm.substring(11, 13)) - 1;
        inicioEmHourBefore = 'T' + inicioEmHourBefore.toString();
        let inicioEmBefore = body.inicioEm.replace(/T\d{2}/, inicioEmHourBefore);
        req.body.inicioEm = inicioEmBefore;
        const bodyBefore = req.body;

        let inicioEmHourAfter = parseInt(body.inicioEm.substring(11, 13)) + 2;
        inicioEmHourAfter = 'T' + inicioEmHourAfter.toString();
        let inicioEmAfter = body.inicioEm.replace(/T\d{2}/, inicioEmHourAfter);
        req.body.inicioEm = inicioEmAfter;
        let bodyAfter = req.body;

        let ReservasDisponiveis = {
            bodyBefore,
            bodyAfter
        }

        res.status(200).send(JSON.stringify(ReservasDisponiveis));   
    }else{
        res.status(200).send(req.body);
    }

})

module.exports = router;