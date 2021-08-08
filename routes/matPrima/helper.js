const express = require("express");
const router = express.Router();
const Programa = require("../../models/programa");
const Ingreso = require("../../models/ingresos");

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
    console.log("linea 35", programacionAnterior);

    let programacionAnteriorNew = [];

    const forLoopy = async (_) => {

  
      for (let programa of programacionAnterior) {
        let remitidoy = 0;
        const lote = programa.lote;
        
        ingresos = await Ingreso.find({ lote: lote });
    
        let tempObj = {};
        
        

        ingresos.forEach(function (x) {
          remitidoy += x.remitido;
                  });

                  const horaIngresos = ingresos.map(x => (x.fecha).getTime())
                  console.log(horaIngresos.length);

                  if (horaIngresos.length != 0 ) {
                  const primerIngreso = horaIngresos.reduce(
                      (acc,curr) => 
                      {
                         return new Date(Math.min(curr, acc));
                      }
                      )
                      tempObj.primerIngreso = primerIngreso;
                    }
        

        tempObj.lote = lote;
        tempObj.proveedor = programa.proveedor;
        tempObj.producto = programa.producto;
        tempObj.cantidad = programa.cantidad;
        tempObj.piscina = programa.piscina;
        tempObj.total = remitidoy;
        
        tempObj.fecha = programa.fecha;
        programacionAnteriorNew.push(tempObj);
      }
    };