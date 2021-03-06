const express = require('express');
const router = express.Router();

const categoriesController = require("../app/Controller/CategoriesController");
/* GET users listing. */
router.get('/:id',categoriesController.getList);
router.get('/:id/page/:page',categoriesController.getListPage);

module.exports = router;
