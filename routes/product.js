var express = require('express');
var router = express.Router();

const ProductController = require("../app/Controller/ProductController")
/* GET users listing. */
router.get('/',ProductController.getProductDefault);

module.exports = router;
