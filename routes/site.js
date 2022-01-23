const express = require("express");
const router =express.Router();

const siteController = require("../app/Controller/SiteController")

router.get("/",siteController.home);
router.get("/cart",siteController.getCartPage)


// user 
router.get("/login",siteController.getLoginPage);
module.exports = router; 