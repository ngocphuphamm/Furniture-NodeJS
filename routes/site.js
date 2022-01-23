const express = require("express");
const passport = require("passport");
const SiteController = require("../app/Controller/SiteController");
const router =express.Router();

const siteController = require("../app/Controller/SiteController")


router.get("/",siteController.home);
router.get("/cart",siteController.getCartPage)


// user 
router.get("/login",siteController.getLoginPage);
//  passport.authenticate gọi như event emiter
router.post("/login",
            passport.authenticate('user-local',
            {
              
                successRedirect : "/",
                failureRedirect :"/login",
                successFlash : true , 
                failureFlash : true 
            }))
router.get("/sign-up",siteController.getRegisterPage);

router.post("/sign-up",siteController.postRegisterUser);
module.exports = router; 