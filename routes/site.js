const express = require("express");
const passport = require("passport");
const SiteController = require("../app/Controller/SiteController");
const router =express.Router();

const siteController = require("../app/Controller/SiteController")


router.get("/",siteController.home);
//cart 
router.get("/cart",siteController.getCartPage)
router.get("/cart/:id",siteController.getAddToCartSingle)
router.get("/cart/delete/:id",siteController.deleteProduct);

router.post("/cart/update/:id",siteController.postUpdateQTYInCart)


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

router.get("/search",siteController.search);

// lưu dữ liệu khi khách hàng ấn yêu thích 
router.get("/product/favorite/:id",siteController.getAddFavorite);

// redner ra list  yêu thích của khach1h hàng 
router.get("/favorite",siteController.getFavoritePage)
// lấy dữ liệu phận trang sau trang 1 của yêu thích 
router.get("/favorite/page/:page",siteController.getFavoriteAtPage)
// XÓA DỮ LIỆU  YÊU THÍCH SẢN PHẨM 
router.get('/product/favorite/delete/:id', siteController.getDeleteFavorite);

// đặt hàng
router.get("/checkout",siteController.getCheckOutPage);
// xuất đơn đặt hàng
router.post("/checkout/bills",siteController.postCheckOut);

const regions = require("../app/models/regions");
router.get("/hello",(req,res,next)=>{
    regions.find({})
    .then((data)=>{
        res.send(data);
    })
})

module.exports = router; 