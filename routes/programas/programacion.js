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

        // Fecha Actual
        const fechaAuto = new Date();
        fechaAuto.setHours(fechaAuto.getHours() -5);
        fechaAuto.setUTCHours(0,0,0,0);
        
        // fecha mañana
       const fechaProxima = new Date();
       fechaProxima.setHours(fechaProxima.getHours() - 5);
       fechaProxima.setUTCHours(0,0,0,0);
       fechaProxima.setHours(fechaProxima.getHours() + 24);
       
       
        const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
        const fechaIngreso =  fechaAuto.toISOString().split('T')[0];

        const programacionAnterior = await Programa.find({"fecha" : fechaAnterior});
        const programacion = await Programa.find({"fecha" : fechaAuto});
        const programacionProxima = await Programa.find({"fecha" : fechaProxima});
        
        res.render('programacion', { programacion, programacionAnterior, programacionProxima, fecha: fechaAuto.toDateString('en-GB', options), fechaBusqueda: fechaAuto, fechaIngreso:fechaIngreso});
}
}))


// INGRESAR PROGRAMAS DE RECEPCION

router.post('/programacion', wrapAsync(async (req, res, next) => {
    console.log(req.body)
    const datos = req.body;
    const fecha = datos.fecha;
    const hora = datos.hora;
    const fechaLlegada = fecha +'T'+ hora;
    const llegada = new Date(fechaLlegada);
    llegada.setHours(llegada.getHours() - 5);
    datos.fecha = llegada;
    delete datos.hora;
    const nuevoPrograma = new Programa(datos)
    const nuevoLote = nuevoPrograma.lote;
    const verificarLote = await Programa.findOne({"lote" : nuevoLote});
    if (verificarLote) {
         res.send(`Lote ya esta asignado a ${verificarLote.proveedor} piscina: ${verificarLote.piscina}`);
     } else {
      await nuevoPrograma.save()
      res.redirect('/programacion'); 
     }
}))

// VER LOTE PROGRAMADO

router.get('/programacion/corregir/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const lotePrograma = await Programa.findById(id);
    const date = lotePrograma.fecha; 
    const fecha =  date.toISOString().split('T')[0];
    res.render('corregir', { lotePrograma, fecha }); 
}))


// MODIFICAR LOTE PROGRAMADO EN DB
router.put('/programacion/corregir/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const  temp = req.body.fecha;
    const date = new Date(temp);
    req.body.fecha = date;
    await Programa.findByIdAndUpdate(id, req.body, {runValidators: true, new: true, useFindAndModify: false })
    res.redirect('/programacion');   
}))

// BORRAR LOTE PROGRAMADO
router.delete('/programacion/delete/:id', wrapAsync(async(req, res, next) => {
    const { id } = req.params;
    await Programa.findByIdAndDelete(id)
    res.redirect('/programacion');
}))

module.exports = router;