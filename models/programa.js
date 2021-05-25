const mongoose = require('mongoose');


const programaSchema = new mongoose.Schema({
    proveedor: {
        type: String,
        required: true
    },
    producto: {
        type: String,
        required: true
    },
    cantidad: {
        type:Number,
        required:true
    },
    piscina:{
        type: String,
        required:true
    },
    lote: {
        type: Number,
        required: true
    },
    fecha: {
        type:Date,
        required:true
    }

})

const Programa = mongoose.model('Programa', programaSchema);

module.exports = Programa;