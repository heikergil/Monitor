const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Ingreso = require('./models/ingresos');
const methodOverride = require('method-override');
const { DateTime } = require("luxon");
const AppError = require('./AppError')
var morgan = require('morgan')
const engine = require('ejs-mate');



app.use(morgan('tiny'));

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
res.send('This is monitor test APP, please go to  http://localhost:3000/index ')
})

app.get('/index', wrapAsync(async (req, res, next) => {
    
        const { fechaBusqueda } = req.query;
        const fechaAuto = DateTime.now().toISODate();
    if (fechaBusqueda) {
        const ingresos = await Ingreso.find({"fecha" : fechaBusqueda});
        res.render('index.ejs', { ingresos, fecha: fechaBusqueda });
    } else {
        const ingresos = await Ingreso.find({"fecha" : fechaAuto});
        res.render('index.ejs', { ingresos, fechaBusqueda: fechaAuto, fecha: fechaAuto });
    }
   
         
}))


app.get('/error', (req, res) => {
    chicken.fly();
})
app.delete('/delete/:id', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
    const deletedProduct = await Ingreso.findByIdAndDelete(id);
    console.log('deleted');
    res.redirect('/index');
  
    
}))



app.get('/show/:lote', wrapAsync( async (req, res, next) => {
    
        const { lote } = req.params;
        const ingresos = await Ingreso.find({"lote":lote})
        var totalRemitido = 0;
            for (let ingreso of ingresos) {
                totalRemitido = totalRemitido + ingreso.remitido;
                }
        res.render('show', { ingresos, totalRemitido  })
    
}))


app.post('/new', wrapAsync(async (req, res, next) => {
        const nuevoIngreso = new Ingreso(req.body)
        await nuevoIngreso.save()
        res.redirect('index') 
}))


app.get('/ingreso/:id', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const ingreso = await Ingreso.findById(id);
    if (!ingreso) {
        return next(new AppError('Ingreso No Encontrado', 404));
    }
        res.render('ingreso', { ingreso }) 
}))

app.get('/update/:id', wrapAsync(async (req, res, next)=> {
        const { id } = req.params;
        const ingreso = await Ingreso.findById(id);
        res.render('update', { ingreso })   
}))

app.put('/ingreso/update/:id', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const ingreso = await Ingreso.findByIdAndUpdate(id, req.body, {runValidators: true, new: true, useFindAndModify: false })
        res.render('ingreso', { ingreso })     
}))

app.use((err, req,res, next) => {
    const { status = 500, message = 'Something Went Wrong' } = err;
    res.status(status).send(message);
})
app.listen(3000, () => {
    console.log('MonitorApp listening on port 3000');
})