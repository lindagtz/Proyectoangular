'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticuloSchema = Schema({
    id: Number,
    imagen: String,
    titulo: String,
    fecha: Date,
    introduccion: String
});

module.exports =mongoose.model('articulo',ArticuloSchema);
