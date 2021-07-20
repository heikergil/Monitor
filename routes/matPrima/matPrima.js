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
        
        let programacionAnteriorNew = [];
 
            const forLoopy = async _ => {
              
                for (let programa of programacionAnterior) {
                    let remitidoy = 0;
                    const lote = programa.lote;
                    const ingresos = await Ingreso.find({"lote" : lote});

                    let tempObj = {};
                    tempObj.llegada = new Date(0);
                    let llegada = tempObj.llegada;
                    ingresos.forEach(function(x) { 
                        remitidoy += x.remitido
                        let compare = x.fecha;
                        if (llegada.getTime() >= compare.getTime()) {
                            tempObj.llegada = compare;
                        }
                    });

                    tempObj.lote = lote;
                    tempObj.proveedor = programa.proveedor;
                    tempObj.producto = programa.producto;
                    tempObj.cantidad = programa.cantidad;
                    tempObj.piscina = programa.piscina;
                    tempObj.total = remitidoy;
                    tempObj.fecha = programa.fecha;
                    programacionAnteriorNew.push(tempObj);
                }
                
            
              }

              await forLoopy();

     const programacion = await Programa.find({"fecha" : {$gte:fechaAuto, $lte:fechaAuto_rango}});
     console.log(programacion);
    
     let programacionNew = [];

         const forLoop = async _ => {
            
             for (let programa of programacion) {
                let tempObj = {};
                 const lote = programa.lote;
                 const ingresos = await Ingreso.find({"lote" : lote});

                 let remitido = 0;
                 tempObj.llegada = new Date(0);
                 let llegada = tempObj.llegada;

                 ingresos.forEach(function(x) { 
                     remitido += x.remitido
                            
                     let compare = x.fecha;

                     if (llegada.getTime() <= compare.getTime()) {
                         llegada = compare;
                     }
                     tempObj.llegada= llegada;
                     console.log(tempObj.llegada);
                 });

                 tempObj.lote = lote;
                 tempObj.proveedor = programa.proveedor;
                 tempObj.producto = programa.producto;
                 tempObj.cantidad = programa.cantidad;
                 tempObj.piscina = programa.piscina;
                 tempObj.total = remitido;
                 tempObj.fecha = programa.fecha;
                 programacionNew.push(tempObj);
             }
             
         
           }

           await forLoop();






     const programacionProxima = await Programa.find({"fecha": {$gte: fechaProxima, $lte: fechaProxima_rango}});



    
     let programacionProximaNew = [];

         const forLoopP = async _ => {
           
             for (let programa of programacionProxima) {
                let remitidoP = 0;
                 const lote = programa.lote;
                 const ingresos = await Ingreso.find({"lote" : lote});

                 let tempObj = {};

                 ingresos.forEach(function(x) { 
                    remitidoP += x.remitido
                 });

                 tempObj.lote = lote;
                 tempObj.proveedor = programa.proveedor;
                 tempObj.producto = programa.producto;
                 tempObj.cantidad = programa.cantidad;
                 tempObj.piscina = programa.piscina;
                 tempObj.total = remitidoP;
                 tempObj.fecha = programa.fecha;
                 programacionProximaNew.push(tempObj);
             }
             
         
           }

           await forLoopP();

res.render('matprima', { programacionNew, programacionAnterior,programacionAnteriorNew, programacionProximaNew, fecha: fechaAuto.toDateString('en-GB', options), fechaBusqueda: fechaAuto, fechaIngreso:fechaIngreso});
}))


function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}
module.exports = router;