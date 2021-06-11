const express = require('express');
const router = express.Router();
const Ingreso = require('../../models/ingresos');
const Programa = require('../../models/programa');

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

// VER BITACORA

router.get('/bitacora', wrapAsync(async (req, res, next) => {

    const { fechaBusqueda } = req.query;
    
    // when user input a date
    const date = new Date(fechaBusqueda)
    // set to 5 hours to ovoid problem with the local time zone.
    // after 19:00 new "ingresos" are logged with next day date because the server transforms dates to UTC (adding 5 hours)
    // Ecuador local Time is -5 GMT
    date.setUTCHours(5,0,0,0);
    const datePlus = new Date(date);
    datePlus.setDate(datePlus.getDate() + 1)
    
    
    
    if (fechaBusqueda) {
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    const ingresos = await Ingreso.find({"fecha" : {$gte: date, $lt: datePlus}});
    res.render('bitacora', { ingresos, fecha: date.toLocaleDateString('en-GB', options) });
    
    } else {
    // gets current date automatically
    const fechaAuto = new Date();
    // set to 5 hours to ovoid problem with the local time zone.
    // after 19:00 new "ingresos" are logged with next day date because the server transforms dates to UTC (adding 5 hours)
    // Ecuador local Time is -5 GMT
    const autoPlus = new Date(fechaAuto);
    autoPlus.setDate(autoPlus.getDate() - 1)
    // autoPlus.setUTCHours(-24,0,0,0);
    
    // Fecha busqueda programa del dia
    
    const fechaPrograma = new Date();
    fechaPrograma.setHours(fechaPrograma.getHours() -5);
    fechaPrograma.setUTCHours(0,0,0,0);
    
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    const ingresos = await Ingreso.find({"fecha" : {$gte: autoPlus, $lt: fechaAuto}});
    const lotes = await Programa.find({"fecha" : fechaPrograma })
    console.log(lotes);
    res.render('bitacora', { lotes, ingresos, fechaBusqueda: fechaAuto, fecha: fechaAuto.toLocaleDateString('en-GB', options)});
    }
    
     
    }
    ))

    // verificar lote
router.get('/verificar', wrapAsync(async (req, res, next) => {
        const  verificarLote  = req.query;
        
        const lote = verificarLote.lote;
        const itemPrograma = await Programa.find({"lote" : lote});
        const programa = itemPrograma[0];
        res.render("verificar", {programa} );
    }))

// nuevo ingreso bitacora

router.post('/new', wrapAsync(async (req, res, next) => {
    const nuevoIngreso = new Ingreso(req.body)

    
    if (nuevoIngreso.fecha) {
        nuevoIngreso.fecha = new Date(nuevoIngreso.fecha);
        await nuevoIngreso.save()
        res.redirect('bitacora'); 
    } else {
        // new ingreso with current date in UTC (+5 hours Ecuador local time)
        var date = new Date(); 
        nuevoIngreso.fecha = date;
        await nuevoIngreso.save()
        res.redirect('bitacora')  
    }
   
}))

// VER INGRESOS

router.get('/show/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const ingreso = await Ingreso.findById(id);
if (!ingreso) {
    return next(new AppError('Ingreso No Encontrado', 404));
}
    const date = ingreso.fecha; 
    const llegada = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const fecha = date.toLocaleDateString();
    res.render('show', { ingreso, llegada, fecha }) 
}))

//  VIEW PARA MODIFICAR INGRESOS

router.get('/update/:id', wrapAsync(async (req, res, next)=> {
    const { id } = req.params;
    const ingreso = await Ingreso.findById(id);
    const date = ingreso.fecha; 
    const llegada = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const fecha =  date.toISOString().split('T')[0];
    console.log(fecha);
    console.log(llegada);
    res.render('update', { ingreso, llegada, fecha });   
}))

// MODIFICAR INGRESO EN DB
router.put('/ingreso/update/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body)
    const  temp = req.body.fecha;
    const time = req.body.llegada;
    const fechaStr = temp +"T"+ time;
    console.log(fechaStr);
    const date = new Date(fechaStr);
    console.log(date);
    req.body.fecha = date;
    await Ingreso.findByIdAndUpdate(id, req.body, {runValidators: true, new: true, useFindAndModify: false })
    res.redirect('/bitacora')   
}))





// VER LOTE
router.get('/lote/:lote', wrapAsync( async (req, res, next) => {

const { lote } = req.params;
const ingresos = await Ingreso.find({"lote":lote})
var totalRemitido = 0;
var totalBines = 0;
    for (let ingreso of ingresos) {
        totalRemitido += ingreso.remitido;
        totalBines += ingreso.numeroBines
        }
res.render('lote', { ingresos, totalRemitido, totalBines, lote })

}))

// BORRAR INGRESO EN BITACORA
router.delete('/delete/:id', wrapAsync(async(req, res, next) => {
    const { id } = req.params;
    await Ingreso.findByIdAndDelete(id)
    res.redirect('/bitacora')
}))


module.exports = router;