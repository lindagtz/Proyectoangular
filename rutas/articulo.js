
var express = require('express');
var router = express.Router();
var articulo = require('../controllers/articuloCRUD');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });

//index articulos
router.get('/', articulo);


router.get('prueba', articulo.prueba);

router.get('prensaa', articulo.prensaa);
//login
router.get('login', articulo.login);

router.get('articulos', articulo.articulo);
//obtener un id de la coleccion articulo
router.get('/show/:id', articulo.show);

//crear articulo
router.get('/create', md_upload, articulo.create);

//guardar paarticulo
router.post('/save', articulo.save);


//editar articulo
router.get('/edit/:id', articulo.edit);


//editar actializacion articulo
router.post('/update/:id', articulo.update);

//eliminar articulo
router.post('/delete/:id', articulo.delete);

module.exports = router;