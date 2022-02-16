const Admin = require('../models/admin');
const Product = require('../models/product');
const Bills = require('../models/bill');
class AdminController{
    getLogin(req,res,next){
        res.render("authencation/loginAdmin",{message: req.flash("Lỗi")});
    }

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
}
module.exports = new AdminController;