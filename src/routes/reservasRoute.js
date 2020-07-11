const express = require('express');
const router = express.Router();
const Reservas = require('../models/reservasModel')

router.post('/', async (req, res) => {
    try {
        //pega o corpo do request
        var body = req.body;

        //pega os valores para calcular a duração
        var inicioEmHour = body.inicioEm.substring(11, 13);
        var fimEmHour = body.fimEm.substring(11, 13);
        if (inicioEmHour < 08 || fimEmHour > 20) {
            throw new FuncionamentoException("Horário inválido!");
        }

        //calcula os valores de duração e valor
        body.duracao = (fimEmHour - inicioEmHour) * 60;
        body.valor = body.duracao * 0.50;

        //validação de horario de funcionamento
        var inicioEmDay = body.inicioEm.substring(1, 10);
        var fimEmDay = body.fimEm.substring(1, 10);
        if (inicioEmDay != fimEmDay) {
            throw new FuncionamentoException("Horário inválido!");
        }


        //verificar disponibilidade
        const r = await Reservas.findOne({ inicioEm: body.inicioEm });
        if (r) {
            if (r.tipo = req.body.tipo) {
                return res.status(422).send({
                    error: {
                        message: 'O horário solicitado não está disponível, favor selecione um outro horário.',
                        code: 'HORARIO_INDISPONIVEL'
                    }
                })
            }
        } else {

            const reserva = await Reservas.create(body);

            return res.send({ reserva });
        }
    } catch (e) {
        if (e instanceof FuncionamentoException) {
            res.status(400).send({
                error: {
                    message: 'Horário de funcionamento de 08h às 20h'
                }
            })
        } else {
            res.status(400).send();
        }
    }
});

router.get('/', async (req, res) => {
    const reservas = await Reservas.find();

    return res.send({ reservas });
})

router.get('/:id', async (req, res) => {
    try {
        const ReservaId = req.params.id;

        const reserva = await Reservas.findById(ReservaId);
        if (reserva) {
            return res.send(reserva);
        } else {
            throw new ReservaInexistenteException("Id inválido!");
        }
    } catch (e) {
        if (e instanceof ReservaInexistenteException) {
            res.status(400).send({
                error: {
                    message: 'Id inválido!'
                }
            })
        } else {
            res.status(400).send();
        }
    }
})

router.put('/:id', async (req, res) => {
    try {
        //pega o corpo do request
        var body = req.body;

        //validar tipo
        var tipo = body.tipo;
        if (tipo != 'hard' && tipo != 'saibro') {
            throw new TipoException("Tipo de quadra inválido");
        }

        //pega os valores para calcular a duração
        var inicioEmHour = body.inicioEm.substring(11, 13);
        var fimEmHour = body.fimEm.substring(11, 13);
        if (inicioEmHour < 08 || fimEmHour > 20) {
            throw new FuncionamentoException("Horário inválido!");
        }

        //validação de duração
        var inicioEmMin = body.inicioEm.substring(14, 16);
        var fimEmMin = body.fimEm.substring(14, 16);
        if (inicioEmMin != 0 || fimEmMin != 0) {
            throw new DuracaoException("Duração inválida!");
        }

        //validação de horario de funcionamento
        var inicioEmDay = body.inicioEm.substring(1, 10);
        var fimEmDay = body.fimEm.substring(1, 10);
        if (inicioEmDay != fimEmDay) {
            throw new FuncionamentoException("Horário inválido!");
        }

        //calcula os valores de duração e valor
        body.duracao = (fimEmHour - inicioEmHour) * 60;
        body.valor = body.duracao * 0.50;

        //validação do valor status
        if (body.status) {
            if (body.status != 'ativa' || body.status != 'cancelada' || body.status != 'paga') {
                throw new StatusException("Status inválido!");
            }
        }

        //verificar disponibilidade
        const r = await Reservas.findOne({ inicioEm: body.inicioEm });
        if (r) {
            return res.status(422).send({
                error: {
                    message: 'O horário solicitado não está disponível, favor selecione um outro horário.',
                    code: 'HORARIO_INDISPONIVEL'
                }
            })
        } else {
            const reserva = await Reservas.findByIdAndUpdate(req.params.id, req.body, { new: true });

            return res.send(reserva);
        }
    } catch (e) {
        if (e instanceof DuracaoException) {
            return res.status(422).send();
        } else if (e instanceof StatusException) {
            return res.status(400).send();
        } else if (e instanceof FuncionamentoException) {
            res.status(400).send({
                error: {
                    message: 'Horário de funcionamento de 08h às 20h'
                }
            })
        } else {
            return res.status(400).send({
                error: {
                    message: 'Falha na reserva!'
                }
            });
        }
    }
})

router.delete('/:id', async (req, res) => {
    var data = new Date();
    req.body.canceladaEm = data;
    req.body.status = 'cancelada';
    const reserva = await Reservas.findByIdAndUpdate(req.params.id, req.body, { new: true });

    return res.send(reserva);
})

function DuracaoException(message) {
    this.message = message;
    this.name = "DuracaoException";
}

function StatusException(message) {
    this.message = message;
    this.name = "StatusException";
}

function TipoException(message) {
    this.message = message;
    this.name = "TipoException";
}

function FuncionamentoException(message) {
    this.message = message;
    this.name = "FuncionamentoException";
}

function ReservaInexistenteException(message) {
    this.message = message;
    this.name = "ReservaInexistenteException";
}

module.exports = router;