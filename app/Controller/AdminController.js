const Admin = require('../models/admin');
const Product = require('../models/product');
const Bills = require('../models/bill');
const Type = require('../models/types');
class AdminController{
    //[GET] admin/login
    getLogin(req,res,next){
        res.render("authencation/loginAdmin",{message: req.flash("Lỗi")});
    }

    //[POST] admin/login
    // AND [GET] admin/dashboard
    // TỔNG QUÁT
   getDashboardPage(req,res,next){
        if(req.isAuthenticated())
        {
            Product.find({},(err,dataProduct)=>{
                Bills.find({},(err,dataBills)=>{
                    // kiểm tra admin thêm lần nữa
                    Admin.findOne({'loginInformation.userName':req.session.passport.user.username},(err,dataAdmin)=>{
                        res.render('dashboards/dashboard',{
                            message : req.flash("success"),
                            customer :  dataAdmin , 
                            abc : dataBills,
                            products : dataProduct
                        })
                 
                    })
                })
            })
        }
        else{
            res.redirect('./login');
        }
   }

   // [GET] /dashboard/categories-manager
   managerCategories(req,res,next){
       var numberItemPerpage = 6; 
        if(req.isAuthenticated())
        {
           Admin.findOne({"loginInformation.userName": req.session.passport.user.username},(err,dataAdmin)=>{
                 Type.find({},(err,dataType)=>{
                    res.render('dashboards/manager-categories', {
                        customer: dataAdmin,
                        categories: dataType,
                        page: 1,
                        numberItemPerpage: numberItemPerpage,
                        message: req.flash("success")
                      });
                 })
           })
        }   
        else
        {
            res.redirect('/admin/login');
        } 
   }
}
module.exports = new AdminController;