const Admin = require('../models/admin');
class AdminController{
    getLogin(req,res,next){
        res.render("authencation/loginAdmin",{message: req.flash("Lỗi")});
    }

   getDashboardPage(req,res,next){
     
   }
}
module.exports = new AdminController;