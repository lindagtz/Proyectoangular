'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClienteSchema = Schema({
    nombre : String,
    apellido: String,
});

module.exports = mongoose.model('Cliente', ClienteSchema);