const express = require("express");
const router = express.Router();
const Programa = require("../../models/programa");
const returnMateriaPrima = require("./helper");

router.get(
  "/matprima",
  wrapAsync(async (req, res, next) => {
    // fecha ayer
    const fechaAnterior = new Date();
    fechaAnterior.setHours(fechaAnterior.getHours() - 5);
    fechaAnterior.setUTCHours(0, 0, 0, 0);
    fechaAnterior.setHours(fechaAnterior.getHours() - 24);
    const fechaAnterior_rango = new Date(fechaAnterior);
    fechaAnterior_rango.setHours(fechaAnterior_rango.getHours() + 23, 59, 59);

    // Fecha Actual
    const fechaAuto = new Date();
    fechaAuto.setHours(fechaAuto.getHours() - 5);
    fechaAuto.setUTCHours(0, 0, 0, 0);
    const fechaAuto_rango = new Date(fechaAuto);
    fechaAuto_rango.setHours(fechaAuto_rango.getHours() + 23, 59, 59);

    // fecha mañana
    const fechaProxima = new Date();
    fechaProxima.setHours(fechaProxima.getHours() - 5);
    fechaProxima.setUTCHours(0, 0, 0, 0);
    fechaProxima.setHours(fechaProxima.getHours() + 24);
    const fechaProxima_rango = new Date(fechaProxima);
    fechaProxima_rango.setHours(fechaProxima_rango.getHours() + 23, 59, 59);

    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const fechaIngreso = fechaAuto.toISOString().split("T")[0];

    
    const programacionAnterior = await Programa.find({
      fecha: { $gte: fechaAnterior, $lte: fechaAnterior_rango },
    });
<<<<<<< HEAD
    const programacionAnteriorNew = await returnMateriaPrima(programacionAnterior);
    
    const programacion = await Programa.find({
      fecha: { $gte: fechaAuto, $lte: fechaAuto_rango },
    });
    const  programacionNew = await returnMateriaPrima(programacion);
=======


    let programacionAnteriorNew = [];

    const forLoopy = async (_) => {

  
      for (let programa of programacionAnterior) {
        let remitidoy = 0;
        const lote = programa.lote;
        
        let ingresos = await Ingreso.find({ lote: lote });
    
        let tempObj = {};
        
        

        ingresos.forEach(function (x) {
          remitidoy += x.remitido;
                  });

                  const horaIngresos = ingresos.map(x => (x.fecha).getTime())
                  console.log(horaIngresos.length);

                  
                  const primerIngreso = horaIngresos.reduce(
                      (acc,curr) => 
                      {
                         return Math.min(curr, acc);
                      }
                      )
                      

                    
        

        tempObj.lote = lote;
        tempObj.proveedor = programa.proveedor;
        tempObj.producto = programa.producto;
        tempObj.cantidad = programa.cantidad;
        tempObj.piscina = programa.piscina;
        tempObj.total = remitidoy;
        tempObj.primerIngreso = new Date(primerIngreso);
        tempObj.fecha = programa.fecha;
        programacionAnteriorNew.push(tempObj);
      }
    };

    await forLoopy();
    console.log("************", programacionAnteriorNew);
   
    const programacion = await Programa.find({
      fecha: { $gte: fechaAuto, $lte: fechaAuto_rango },
    });
    console.log(programacion);
    let programacionNew = [];

    const forLoop = async (_) => {
      for (let programa of programacion) {
        let tempObj = {};
        const lote = programa.lote;
        const ingresos = await Ingreso.find({ lote: lote });
        if (ingresos == []) {
          return
        }

        let remitido = 0;
        
        ingresos.forEach(function (x) {
          remitido += x.remitido;
        });

        const horaIngresos = ingresos.map(x => (x.fecha).getTime())
        if (horaIngresos.length != 0 ) {
          const primerIngreso = horaIngresos.reduce(
            (acc,curr) => 
            {
               return new Date(Math.min(curr, acc));
            }
            )
        }
        


       

        tempObj.lote = lote;
        tempObj.proveedor = programa.proveedor;
        tempObj.producto = programa.producto;
        tempObj.cantidad = programa.cantidad;
        tempObj.piscina = programa.piscina;
        tempObj.total = remitido;
        tempObj.fecha = programa.fecha;
        tempObj.primerIngreso = primerIngreso;
        programacionNew.push(tempObj);
      }
    };

    await forLoop();
>>>>>>> d25e56e47aa31297254040374564d7cfbab1e3e9


    const programacionProxima = await Programa.find({
      fecha: { $gte: fechaProxima, $lte: fechaProxima_rango },
    });
    const programacionProximaNew = await returnMateriaPrima(programacionProxima);

<<<<<<< HEAD
    
=======
    console.log(programacionProxima);
    let programacionProximaNew = [];

    const forLoopP = async (_) => {
      for (let programa of programacionProxima) {
        let remitidoP = 0;
        const lote = programa.lote;
        const ingresos = await Ingreso.find({ lote: lote });
        
        let tempObj = {};

        ingresos.forEach(function (x) {
          remitidoP += x.remitido;
        });

        const horaIngresos = ingresos.map(x => (x.fecha).getTime())
        if (horaIngresos.length != 0 ) {
        const primerIngreso = horaIngresos.reduce(
            (acc,curr) => 
            {
               return new Date(Math.min(curr, acc));
            }
            )
        }

        tempObj.lote = lote;
        tempObj.proveedor = programa.proveedor;
        tempObj.producto = programa.producto;
        tempObj.cantidad = programa.cantidad;
        tempObj.piscina = programa.piscina;
        tempObj.total = remitidoP;
        tempObj.fecha = programa.fecha;
        tempObj.primerIngreso = primerIngreso;
        console.log(tempObj);
        programacionProximaNew.push(tempObj);
      }
    };
>>>>>>> d25e56e47aa31297254040374564d7cfbab1e3e9


    res.render("matprima", {
      programacionNew,
      programacionAnterior,
      programacionAnteriorNew,
      programacionProximaNew,
      fecha: fechaAuto.toDateString("en-GB", options),
      fechaBusqueda: fechaAuto,
      fechaIngreso: fechaIngreso,
    });
  })
);

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}
module.exports = router;
