const express = require('express');
const router = express.Router();
const Programa = require('../../models/programa');
const Ingreso = require('../../models/ingresos');



router.get('/matprima', wrapAsync(async(req, res, next) => {
    // fecha ayer
    const fechaAnterior = new Date();
    fechaAnterior.setHours(fechaAnterior.getHours() -5);
    fechaAnterior.setUTCHours(0,0,0,0);
    fechaAnterior.setHours(fechaAnterior.getHours() - 24);
    const fechaAnterior_rango = new Date(fechaAnterior)
     fechaAnterior_rango.setHours(fechaAnterior_rango.getHours() + 23,59,59);

     // Fecha Actual
     const fechaAuto = new Date();
     fechaAuto.setHours(fechaAuto.getHours() -5);
     fechaAuto.setUTCHours(0,0,0,0);
     const fechaAuto_rango = new Date(fechaAuto)
     fechaAuto_rango.setHours(fechaAuto_rango.getHours() + 23,59,59);
     
     
     
     // fecha mañana
    const fechaProxima = new Date();
    fechaProxima.setHours(fechaProxima.getHours() - 5);
    fechaProxima.setUTCHours(0,0,0,0);
    fechaProxima.setHours(fechaProxima.getHours() + 24);
    const fechaProxima_rango = new Date(fechaProxima)
     fechaProxima_rango.setHours(fechaProxima_rango.getHours() + 23,59,59);
    
    
     const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
     const fechaIngreso =  fechaAuto.toISOString().split('T')[0];

     const programacionAnterior = await Programa.find({"fecha": {$gte:fechaAnterior, $lte: fechaAnterior_rango}});
     let remitido = 0;
        var programacionAnteriorNew = [];
        programacionAnteriorNew.push('hello world');

     programacionAnterior.forEach(async function(x) {

         programacionAnteriorNew.push('HELLO WORLD BUT IN ALL CAPS');
         
         const lote = x.lote;
         const ingresos = await Ingreso.find({"lote" : lote});
         var tempObj = {};
            ingresos.forEach(function(x) { 
                remitido += x.remitido
            });
                
                tempObj.lote = lote;
                tempObj.proveedor = x.proveedor;
                tempObj.cantidad = x.cantidad;
                tempObj.piscina = x.piscina;
                tempObj.total = remitido;
                tempObj.fecha = x.fecha;
                console.log(tempObj);
                programacionAnteriorNew.push(tempObj)


            });
            
     
            console.log('BUENAS BUENAS');
            console.log(programacionAnteriorNew);


     const programacion = await Programa.find({"fecha" : {$gte:fechaAuto, $lte:fechaAuto_rango}});
     const programacionProxima = await Programa.find({"fecha": {$gte: fechaProxima, $lte: fechaProxima_rango}});


res.render('matprima', { programacion, programacionAnterior,programacionAnteriorNew, programacionProxima, fecha: fechaAuto.toDateString('en-GB', options), fechaBusqueda: fechaAuto, fechaIngreso:fechaIngreso});
}))


function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}
module.exports = router;