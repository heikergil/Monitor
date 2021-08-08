const Programa = require("../../models/programa");
const Ingreso = require("../../models/ingresos");

const returnMateriaPrima = async function(programaciones) {
    let materiaPrimaRecibidad = []; 

    for (let programa of programaciones) {
      const lote = programa.lote;
      const ingresos = await Ingreso.find({ lote: lote });


      let remitido = 0;
      let tempObj = {};


      ingresos.forEach(function (x) {
        remitido += x.remitido;
        });


      const horaIngresos = ingresos.map(x => (x.fecha).getTime())

      if (horaIngresos.length > 0) { 
      const primerIngresoTime = horaIngresos.reduce(
          (acc,curr) => { return Math.min(curr, acc);}
          )
          let primerIngreso = new Date(primerIngresoTime);
          tempObj.primerIngreso = primerIngreso.getUTCHours() + ':' + primerIngreso.getUTCMinutes() + ':' + primerIngreso.getUTCSeconds();
        } else {
          tempObj.primerIngreso = 'POR LLEGAR';
        }

          tempObj.lote = lote;
          tempObj.proveedor = programa.proveedor;
          tempObj.producto = programa.producto;
          tempObj.cantidad = programa.cantidad;
          tempObj.piscina = programa.piscina;
          tempObj.total = remitido;
          
          tempObj.fecha = programa.fecha;

          materiaPrimaRecibidad.push(tempObj);    



      }

      return materiaPrimaRecibidad;

}

module.exports = returnMateriaPrima;
