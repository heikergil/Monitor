const { text } = require('express');
const { DateTime } = require('luxon');
const mongoose = require('mongoose');


const ingresoSchema = new mongoose.Schema({
    lote: {
        type: Number,
        require: true
    },
    proveedor: {
        type: String,
        required: true
    },
    piscina: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
    },
    // llegada: {
    //     type:String,
    //     required: true,
    // },
    numeroBines: {
        type: Number,
        required: true
    },
    remitido: {
        type: Number,
        required: true
    }
})

const Ingreso = mongoose.model('Ingreso', ingresoSchema);

module.exports = Ingreso;