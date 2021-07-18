const mongoose = require('mongoose');
const Ingreso = require('./models/ingresos');
const Programa = require('./models/programa');

// connection to mongoDB with mongoose
mongoose.connect('mongodb://localhost:27017/monitor-test', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('CONECTED TO DBS')
})
.catch((err) => {
    console.log('ERROR CONNECTING TO DB')
    console.log(err)
});

// {
//     _id: 60eba2c3f2c4353e205a281b,
//     proveedor: 'Produmar',
//     producto: 'ENTERO',
//     piscina: '30',
//     lote: 126987,
//     cantidad: 20000,
//     fecha: 2021-07-10T10:00:00.000Z,
//     __v: 0
//   }




 async function seed() {
    
    let lote = 1230000
    const dateToday = new Date();
        dateToday.setHours(dateToday.getHours() -5);
        dateToday.setUTCHours(0,0,0,0);
        dateToday.setDate(dateToday.getDate() - 1 );
    

for (let i = 1; i <= 12; i++ ) {

        
    
    let seedPrograma = {
        proveedor: 'Produmar',
        producto: 'ENTERO',
        piscina: '30',
        lote: lote,
        cantidad: 70000,
        fecha: dateToday
        }
        
        const programa = new Programa(seedPrograma);
        await programa.save()

            for (let x =0; x <= 4; x++) {

                let seedIngreso = {
                    proveedor: 'Produmar',
                    piscina: '30',
                    lote: lote,
                    piscina: 'test',
                    numeroBines: 10,
                    remitido:10000,
                    fecha: dateToday
                    }
        
            const nuevoIngreso = new Ingreso(seedIngreso)
            await nuevoIngreso.save()

            }

         lote += 1
        
        dateToday.setDate(dateToday.getDate() + 1 );
        console.log(dateToday)
}

}




seed();