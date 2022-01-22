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
}
module.exports= new siteController ();