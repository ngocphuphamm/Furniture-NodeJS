var express = require('express');
var router = express.Router();

const ProductController = require("../app/Controller/ProductController")
/* GET users listing. */
router.get('/',ProductController.getProductDefault);
router.get("/favorite/:id",ProductController.getAddFavorite);

router.post("/product-filter",ProductController.filterProduct)

router.get('/product-filter/:page', ProductController.filterProductAtPage)
module.exports = router;
