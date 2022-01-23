const Customer =  require("../models/customers");
const Types = require("../models/types");
class siteController{
    //[GET]  /home
    home(req,res,next)
    {
        Types.find({},(err,data)=>
        {
            if(req.isAuthenticated())
            {
                Customer.findOne({"loginInformation.userName" : req.session.passport.user.username}
                ,(err,customersData)=>
                {
                    res.render("index",
                    {
                        data: data ,
                        message : req.flash("success"),
                        customer : customersData  
                    })
                })
            }
            else
            {
                res.render("index", { data: data, message: req.flash("success"), customer: undefined });
            }
        })
    
    }
    //[GET] /cart 
    getCartPage(req,res,next)
    {
        var customer = req.session.passport.user.username;
      // kiểm tra xác thực người dùng đã đăng nhập chưa 
      if(req.isAuthenticated())
      {
          Customer.findOne({"loginInformation.userName":customer},(err,dataCustomer)=>
          {
              res.render("cart",{
                  customer:customersData,
                  message : req.flash("thành công")
                })
          })
      }
    }

    //[GET] /login
    getLoginPage(req,res,next)
    {
        var messageError = req.flash("error");
        var messageSuccess = req.flash("success");
        res.render("loginuser",{ message : messageError.length !=0 ? messageError : messageSuccess,
                                 typeMessage : messageSuccess.length != 0 ? messageSuccess : messageError })
    }
}
module.exports= new siteController ();