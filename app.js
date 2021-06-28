const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const AppError = require('./AppError')
const morgan = require('morgan')
const engine = require('ejs-mate');
const programacion = require("./routes/programas/programacion");
const bitacora = require('./routes/bitacora/bitacora');

// Import variables
require('dotenv').config({path: 'vars.env'});


app.use(morgan('tiny'));

app.use(express.static(__dirname + '/public'));
// conectar con base de dato remota
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/monitor-test';

// conectar con base de datos local
// const dbUrl ='mongodb://localhost:27017/monitor-test';
// connection to mongoDB with mongoose
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
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

// ver bitacora
app.get('/bitacora', bitacora);

// Verificar lote a ingresar
app.get('/verificar', bitacora);

// nuevo ingreso en bitacora
app.post('/new', bitacora);

//ver ingreso de bitacora
app.get('/show/:id', bitacora);

// view modificar ingreso de bitacora
app.get('/update/:id', bitacora);

// modificar ingreso en db
app.put('/ingreso/update/:id', bitacora);

// ver informacion de lote ingresado en bitacora
app.get('/lote/:lote', bitacora);

// eliminar ingreso en bitacora
app.delete('/delete/:id', bitacora);



// ver programacion
app.get('/programacion', programacion);
// ingresar programacion
app.post('/programacion', programacion);
// corregir lote programado
app.get('/corregir/:id', programacion);



app.get('/', (req, res) => {

    res.send('This is monitor test APP, please go to  http://localhost:3000/bitacora ')
    })

app.use((err, req,res, next) => {
    console.log(err);
    // const { status = 500, message = 'Something Went Wrong' } = err;
    res.render('error', {err});
    })
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`MonitorApp listening on port ${port}`);
})