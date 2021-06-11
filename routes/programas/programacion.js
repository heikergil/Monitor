const express = require('express');
const router = express.Router();
const Programa = require('../../models/programa');

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

// VER PROGRAMAS DE RECEPCION
router.get('/programacion', wrapAsync(async (req, res, next) => {

    const { fechaBusqueda } = req.query;
    
if (fechaBusqueda) {
    // when user input a date
    const date = new Date(fechaBusqueda)
    // date.setHours(date.getHours() + 5);
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    const programacion = await Programa.find({"fecha" : date});
    const fechaIngreso =  date.toISOString().split('T')[0];
    res.render('programacion', { programacion, fecha: date.toLocaleDateString('en-GB', options), fechaIngreso:fechaIngreso });

} else {
      // gets current date automatically
      const fechaAuto = new Date();
      fechaAuto.setHours(fechaAuto.getHours() -5);
      fechaAuto.setUTCHours(0,0,0,0);
      const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
      const fechaIngreso =  fechaAuto.toISOString().split('T')[0];
    const programacion = await Programa.find({"fecha" : fechaAuto});
    
    res.render('programacion', { programacion, fecha: fechaAuto.toDateString('en-GB', options), fechaBusqueda: fechaAuto, fechaIngreso:fechaIngreso});
}
}))


// INGRESAR PROGRAMAS DE RECEPCION

router.post('/programacion', wrapAsync(async (req, res, next) => {
    const nuevoPrograma = new Programa(req.body)
    const nuevoLote = nuevoPrograma.lote;
    const verificarLote = await Programa.findOne({"lote" : nuevoLote});
    if (verificarLote) {
        res.send(`Lote ya esta asignado a ${verificarLote.proveedor} piscina: ${verificarLote.piscina}`);
    } else {
        await nuevoPrograma.save()
        res.redirect('programacion'); 
    }
}))



module.exports = router;