const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Ingreso = require('./models/ingresos');
const methodOverride = require('method-override');
const { DateTime } = require("luxon");
const AppError = require('./AppError')
const morgan = require('morgan')
const engine = require('ejs-mate');



app.use(morgan('tiny'));

app.use(express.static(__dirname + '/public'));

// connection to mongoDB with mongoose
mongoose.connect('mongodb://localhost:27017/monitor-test', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('CONECTED TO DBS')
})
.catch((err) => {
    console.log('ERROR CONNECTING TO DB')
    console.log(err)
});

app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

app.get('/', (req, res) => {

res.send('This is monitor test APP, please go to  http://localhost:3000/bitacora ')
})


app.post('/new', wrapAsync(async (req, res, next) => {
        const nuevoIngreso = new Ingreso(req.body)

        // TO DO: MAKE SETTING THE DATE AND TIME MANUALLY WORK!
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


app.get('/show/:id', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const ingreso = await Ingreso.findById(id);
    if (!ingreso) {
        return next(new AppError('Ingreso No Encontrado', 404));
    }
        res.render('show', { ingreso }) 
}))

app.get('/update/:id', wrapAsync(async (req, res, next)=> {
        const { id } = req.params;
        const ingreso = await Ingreso.findById(id);
        const date = ingreso.fecha; 
        const llegada = date.getHours() + ":" + date.getMinutes();
        console.log(ingreso.fecha);
        console.log(llegada);
        res.render('update', { ingreso, llegada })   
}))

app.put('/ingreso/update/:id', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        console.log(req.body)
        const  temp = req.body.fecha;
        fecha = new Date(temp);
        fecha.setUTCHours(5,0,0,0);
        req.body.fecha = fecha;
        await Ingreso.findByIdAndUpdate(id, req.body, {runValidators: true, new: true, useFindAndModify: false })
        res.redirect('/bitacora')   
}))

app.use((err, req,res, next) => {
    const { status = 500, message = 'Something Went Wrong' } = err;
    res.status(status).send(message);
})


app.get('/bitacora', wrapAsync(async (req, res, next) => {
    
    const { fechaBusqueda } = req.query;

    // when user input a date
    const date = new Date(fechaBusqueda)
    // set to 5 hours to ovoid problem with the local time zone.
    // after 19:00 new "ingresos" are logged with next day date because the server transforms dates to UTC (adding 5 hours)
    // Ecuador local Time is -5 GMT
    date.setUTCHours(5,0,0,0);
    const datePlus = new Date(date);
    datePlus.setDate(datePlus.getDate() + 1)


    // gets current date automatically
    const fechaAuto = new Date();
    // set to 5 hours to ovoid problem with the local time zone.
    // after 19:00 new "ingresos" are logged with next day date because the server transforms dates to UTC (adding 5 hours)
    // Ecuador local Time is -5 GMT
    const autoPlus = new Date(fechaAuto);
    autoPlus.setDate(autoPlus.getDate() - 1)
    // autoPlus.setUTCHours(-24,0,0,0);

if (fechaBusqueda) {
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    const ingresos = await Ingreso.find({"fecha" : {$gte: date, $lt: datePlus}});
    res.render('bitacora', { ingresos, fecha: date.toLocaleDateString('en-GB', options) });

} else {

    
    console.log(fechaAuto);
    console.log(autoPlus);
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    const ingresos = await Ingreso.find({"fecha" : {$gte: autoPlus, $lt: fechaAuto}});
    res.render('bitacora', { ingresos, fechaBusqueda: fechaAuto, fecha: fechaAuto.toLocaleDateString('en-GB', options)});
}

     
}
))

app.get('/lote/:lote', wrapAsync( async (req, res, next) => {
    
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

app.delete('/delete/:id', wrapAsync(async(req, res, next) => {
        const { id } = req.params;
        await Ingreso.findByIdAndDelete(id)
        res.redirect('/bitacora')
}))

app.listen(3000, () => {
    console.log('MonitorApp listening on port 3000');
})