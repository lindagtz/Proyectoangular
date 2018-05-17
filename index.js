var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.port || 3200;


mongoose.connect('mongodb://localhost/lhoglobal');
console.log(__dirname);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.set('view engine', 'ejs');


var articulo = require('./controllers/articuloCRUD');
app.use('/articulo', articulo);

app.listen(port, function () {
    console.log('Aplicacion corriendo exitosamente http://localhost ' + port);
});