const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Ingreso = require('./models/ingresos');
const Programa = require('./models/programa');
const methodOverride = require('method-override');
const AppError = require('./AppError')
const morgan = require('morgan')
const engine = require('ejs-mate');

app.use(morgan('tiny'));

app.use(express.static(__dirname + '/public'));

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

app.get('/programacion', wrapAsync(async (req, res, next) => {

    const { fechaBusqueda } = req.query;

    
if (fechaBusqueda) {
    // when user input a date
    const date = new Date(fechaBusqueda)
    
    date.setHours(date.getHours() - 5);
    date.setUTCHours(0,0,0,0);
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    const programacion = await Programa.find({"fecha" : date});
    console.log(programacion);
    res.render('programacion', { programacion, fecha: date.toLocaleDateString('en-GB', options) });

} else {
      // gets current date automatically
      const fechaAuto = new Date();
      console.log(fechaAuto)
      fechaAuto.setHours(fechaAuto.getHours() - 5);
      fechaAuto.setUTCHours(0,0,0,0)
    console.log(fechaAuto);
    const programacion = await Programa.find({"fecha" : fechaAuto});
    
    res.render('programacion', { programacion, fechaBusqueda: fechaAuto});
}
}))

app.post('/programacion', wrapAsync(async (req, res, next) => {
    const nuevoPrograma = new Programa(req.body)
    const dateUTC = new Date;
    dateUTC.setHours(dateUTC.getHours() - 5);
    dateUTC.setUTCHours(0,0,0,0)
    nuevoPrograma.fecha = dateUTC;
    await nuevoPrograma.save()
    res.redirect('programacion'); 
}))


module.exports.app = app;