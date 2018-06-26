var path = require('path');
var mongoose = require('mongoose');
var Articulo = require('../models/articulo.model');
var Cliente = require('../models/cliente.model');
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fse = require('fs-extra')
const fs = require('fs')


//index Articulos

router.get('/', function (req, res) {
    //res.render('./index');
    Articulo.find().then((articulo) => {
        res.render('./index', { articulo: articulo });
    });
})


router.get('/articulos', function (req, res) {
    res.render('./articulos/articulo');
})

router.get('/login', function (req, res) {
    res.render('./usuario/login');
})

/*
router.get('/', function (req, res) {
    res.render('articulos/articulo');
});
*/
//crear vistas articulo
router.get('/create', function (req, res) {
    res.render('articulos/create');
});


router.get('/prensaa/:id', (req, res) => {
    Articulo.findOne({ id: req.params.id }).exec((err, articulo) => {
        if (!err) {
            Articulo.find().then((articulos) => {
                res.render('articulos/prensaa', { articulo: articulo, articulos: articulos });
            });
        } else {
            console.log('Error', err);
        };
    });
});

//crear insert a mongo
router.post('/save', (req, res) => {

    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files) {

        console.log(fields);

        var path1 = files.imagen[0].path;

        var titulo = fields.titulo;
        var fecha = new Date();
        var introduccion = fields.introduccion;
        var imagen = files.imagen[0].originalFilename;
        var ruta = fields.ruta;
        var params = req.body;
        var artId = req.params.id;

        var articulo = new Articulo({ titulo, imagen, fecha, introduccion, ruta });


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
        }).then(() => {
            // Aqui se copia la imagen al proyecto en uploads con el nombre de la imagen
            fse.copy(path1, "./uploads/" + files.imagen[0].originalFilename, err => {
                if (!err) {
                    console.log("File transferred successfully!");
                } else {
                    console.log(err);
                }
            })
        }).then(() => {
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


//login
router.get('/login', function (req, res) {
    res.redirect('./login')
})


//router.get('/prensaa/:id',function(err,res){
//  res.render('articulos/prensaa');
//})





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
        intro: req.body.introduccion,
        ruta: req.body.ruta
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

router.post('/confirmar_edicion', (req, res) => {
    Cliente.findByIdAndUpdate(req.query.id_cliente,{nombre:req.query.nombre,apellido:req.query.apellido},
        (error, ClienteUpdate) => {
            if(error){
                res.status(500).send({message:'No se ha podido realizar la peticion'+error});
            }else{
                if(!ClienteUpdate){
                    res.status(404).send({message:'No se encontro el cliente'});
    
                }else{
                    res.status(200).send({MensajeActualizado:"El cliente ha sido actualizado correctamente",check:true});
    
                }
            }
    });
});

//eliminar

router.delete('/confirmar_delete', (req, res) => {
    console.log(req.query);
    Cliente.findByIdAndRemove(req.query.id_cliente,
        (error, ClienteDelete) => {
            if(error){
                res.status(500).send({message:'No se ha podido realizar la peticion'+error});
            }else{
                if(!ClienteDelete){
                    res.status(404).send({message:'No se encontro el cliente'});
    
                }else{
                    res.status(200).send({MensajeBorrado:"El cliente ha sido borrado correctamente",check:true});
    
                }
            }
    });
});

router.post('/mostrar_edicion_cliente', (req,res)=>{
    var params=req.query;
    console.log(params.id_cliente)
    Cliente.findById(params.id_cliente,(error, cliente)=>{
        if(error){
            res.status(500).send({message:'No se ha podido realizar la peticion'+error});
        }else{
            if(!cliente){
                res.status(404).send({message:'No se encontro el cleinte'});

            }else{
                console.log('entro else de bien'+cliente)
                res.status(200).send({nombre:cliente.nombre, apellido:cliente.apellido, message:true, id_cliente:cliente._id });
            }
        }
    });
});

//
router.post('/registra_usuarioc', (req,res)=>{
    var cliente = new Cliente();
    var params=req.query;
    console.log(params)
    cliente.nombre=params.nombre;
    cliente.apellido=params.apellido;

    if(cliente.nombre!=null && cliente.apellido!=null ){
        cliente.save((err,clientestored)=>{
            if(!err){
                if(!clientestored){
                    res.status(404).send({message:'No se ha registrado al cliente'});
                }else{
                    res.status(200).send({user:clientestored, message:'cliente registrado exitosamente',status:true})
                    console.log(clientestored)
                }
            }else{
                res.status(500).send("Error al guardar el cliente");
            }
        })
    }else{
        res.status(200).send({message:'Introduce los datos necesarios'})
    }
});


//consultar
router.post('/buscar_clientes',(req, res)=>{
    Cliente.find({}).sort({_id:-1}).exec(function(err, result) {
        var json={}
        for(var i = 0; i < result.length;i++){
            var arreglo={}
            arreglo['_id']=result[i]._id;
            arreglo['nombre']=result[i].nombre;
            arreglo['apellido']=result[i].apellido;
            json[i]=arreglo
        }
       
        if (err) throw err;
            return res.status(200).send({resultado_consulta:json});
      });
})

//esportar router 
module.exports = router;