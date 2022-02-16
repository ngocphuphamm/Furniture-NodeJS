const express = require("express");
const route = express.Router();
const passport = require("passport");
const { router } = require("../app");


const  adminController = require("../app/Controller/AdminController");

route.get('/login',adminController.getLogin);
// sử dụng passport  sử dụng  trong app.js nơi chứa server 
// kiểm tra local admin-local xem có tài khoản đó không nếu thất bại thì chuyển qua  trang login 
route.post('/login',passport.authenticate('admin-local',{failureRedirect:'/admin/login',successFlash:true,failureFlash:true})
                    ,adminController.getDashboardPage);

module.exports = route; 