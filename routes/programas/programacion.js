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
      
       // fecha ayer
       const fechaAnterior = new Date();
       fechaAnterior.setHours(fechaAnterior.getHours() -5);
       fechaAnterior.setUTCHours(0,0,0,0);
       fechaAnterior.setHours(fechaAnterior.getHours() - 24);
       console.log(fechaAnterior);

        // Fecha Actual
        const fechaAuto = new Date();
        fechaAuto.setHours(fechaAuto.getHours() -5);
        fechaAuto.setUTCHours(0,0,0,0);
        console.log(fechaAuto);
        
        // fecha mañana
       const fechaProxima = new Date();
       fechaProxima.setHours(fechaProxima.getHours() - 5);
       fechaProxima.setUTCHours(0,0,0,0);
       fechaProxima.setHours(fechaProxima.getHours() + 24);
       
       console.log(fechaProxima);
       
        const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
        const fechaIngreso =  fechaAuto.toISOString().split('T')[0];

        const programacionAnterior = await Programa.find({"fecha" : fechaAnterior});
        console.log(programacionAnterior);
        const programacion = await Programa.find({"fecha" : fechaAuto});
        console.log(programacion);
        const programacionProxima = await Programa.find({"fecha" : fechaProxima});
        console.log(programacionProxima);
        
        res.render('programacion', { programacion, programacionAnterior, programacionProxima, fecha: fechaAuto.toDateString('en-GB', options), fechaBusqueda: fechaAuto, fechaIngreso:fechaIngreso});
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
        console.log(nuevoPrograma);
        await nuevoPrograma.save()
        res.redirect('programacion'); 
    }
}))



module.exports = router;