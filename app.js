const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Ingreso = require('./models/ingresos');
const methodOverride = require('method-override');
const { DateTime } = require("luxon");



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
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.get('/index', async (req, res) => {
    const { fecha } = req.query;
    const fechaAuto = DateTime.now().toISO();
    if (fecha) {
        console.log(fecha);
        const ingresos = await Ingreso.find({"fecha" : fecha});
        console.log(ingresos[0].fecha)
        res.render('index.ejs', { ingresos, fecha });
    } else {
        console.log("auto0");
        const ingresos = await Ingreso.find({"fecha" : fechaAuto});
        res.render('index.ejs', { ingresos, fecha: fechaAuto });
    }
     
    
})




app.get('/fecha', async (req, res) => {
    const fecha = "2021-02-23T05:09:47.521Z";
    const ingresos = await Ingreso.find({"fecha":{$lt:"2021-02-23T00:00:00.00Z",$gte:"2021-02-22T00:00:00.00Z" }});
    console.log(ingresos);
    res.render('index.ejs', { ingresos });
})

app.listen(3000, () => {
    console.log('MonitorApp listening on port 3000');
})