const express = require('express');
const router = express.Router();
const Programa = require('../../models/programa');



router.get('/matprima', wrapAsync(async(req, res, next) => {
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
  
  res.render('matprima', { programacion, programacionAnterior, programacionProxima, fecha: fechaAuto.toDateString('en-GB', options), fechaBusqueda: fechaAuto, fechaIngreso:fechaIngreso});
}))


function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}
module.exports = router;