var path = require('path');
var mongoose = require('mongoose');
var Articulo = require('../models/articulo.model');
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fse = require('fs-extra')
const fs = require('fs')

//index Articulos

router.get('/', function (req, res) {
    res.render('articulos/articulo');
});

//crear vistas articulo
router.get('/create', function (req, res) {
    res.render('articulos/create');
});

//crear insert a mongo
router.post('/save', (req, res) => {

    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files) {

        console.log(fields);

        var path1 = files.imagen[0].path;

        var titulo = fields.titulo;
        var fecha = fields.fecha;
        var introduccion = fields.introduccion;
        var imagen = files.imagen[0].originalFilename;
        var params = req.body;
        var artId = req.params.id;

        var articulo = new Articulo({ titulo, imagen, fecha, introduccion });

        
        new Promise((resolve, reject) => {
            Articulo.find().sort({ $natural: -1 }).limit(1)
                .then((article) => {
                    resolve(article);
                });
        }).then((Articulo) => {
            if (Articulo[0]) {
                var contador = Articulo[0].id;
                contador = contador + 1;
                articulo.id = contador;
    
            } else {
                articulo.id = 1;
            }
            return true;
        }).then(()=>{
   // Aqui se copia la imagen al proyecto en uploads con el nombre de la imagen
   fse.copy(path1, "./uploads/" + files.imagen[0].originalFilename, err => {
    if (!err) {
        console.log("File transferred successfully!");
    } else {
        console.log(err);
    }
})
        }).then(()=>{
  // Aqui se guarda los daos del articulo
  articulo.save().then((articulo) => {
    Articulo.find().then((articulo) => {
        console.log(articulo);
        res.redirect('/articulo/read');
    });
    console.log(articulo);
});
        })
    
    });
});




//leer todos los articulos
router.get('/read', function (req, res) {
    Articulo.find().then((articulo) => {
        res.render('articulos/read', { articulo: articulo });
    });
});

//redireccionar a update

router.post('/update/:id', (req, res) => {
    Articulo.findOne({ _id: req.params.id }).exec((err, articulo) => {
        if (!err) {
            res.render('articulos/update', { articulo: articulo });
        } else {
            console.log('Error', err);
        };
    });
});

//actualizar en la base
router.post('/update/save/:id', (req, res) => {
    Articulo.findByIdAndUpdate(req.params.id, {
        titulo: req.body.titulo,
        fecha: req.body.fecha,
        intro: req.body.introduccion
    }, (err, articulo) => {
        if (!err) {
            Articulo.find().then((articulo) => {
                res.render('articulos/read', { articulo: articulo });
            });
        } else {
            console.log('Error: ', err);
        }
    });
});

//redireccinoar a delete
router.post('/delete/:id', (req, res) => {
    Articulo.findOne({ _id: req.params.id }).exec((err, articulo) => {
        if (!err) {
            res.render('articulos/delete', { articulo: articulo });
        } else {
            console.log('Error: ', err);
        }
    });
});

//delete en la base
router.post('/delete/drop/:id', (req, res) => {
    Articulo.findByIdAndRemove(req.params.id, (err) => {
        if (!err) {
            res.render('articulos/articulo');

        } else {
            console.log('Error: ', err);
        }
    });
});



//esportar router 
module.exports = router;