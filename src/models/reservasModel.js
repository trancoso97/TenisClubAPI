const mongoose = require('../database/reservasDB');

const ReservaSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        uppercase: true,
        enum: ['SAIBRO', 'HARD'],
    },  
    status: {
        type: String,
        default: 'ativa',
        enum: ['ativa', 'cancelada', 'paga'],
    },
    criadaEm: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    inicioEm: {
        type: Date,
        required: true,
        validate: {
            validator: (v) => {
                var test = /\d{4}-\d{2}-\d{2}T\d{2}:[0]{2}:[0]{2}.[0]{3}Z/.test(v.toISOString());
                var data = new Date;
                if(test && v > data){
                   return true;
                } else{
                    return false;
                }    
            }
        },
    },
    fimEm: {
        type: Date,
        required: true,
        validate: (v) => {
            validator: (v) => {
                var test = /\d{4}-\d{2}-\d{2}T\d{2}:[0]{2}:[0]{2}.[0]{3}Z/.test(v.toISOString());
                var data = new Date;
                if(test && v > data){
                   return true;
                } else{
                    return false;
                } 
            }      
        }
    },
    duracao: {
        type: Number,
        /*default: (v) => {
            v = (path.inicioEm - this.fimEm) * 60;
            return v;
        },*/
    },
    valor: {
        type: Number,
        /*default: function(v) {
            v = duracao * 0.5
        }*/
    },
    canceladaEm: {
        type: Date
    },
},{versionKey: false})

const ReservasModel = mongoose.model('Reserva', ReservaSchema);

module.exports = ReservasModel;