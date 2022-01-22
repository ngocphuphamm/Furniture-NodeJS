const Customer =  require("../models/customers");
const Types = require("../models/types");
class siteController{
    home(req,res,next)
    {
        // Types.find({},(err,data)=>
        // {
        //     if(req.isAuthenticated())
        //     {
        //         Customer.findOne({"loginInformation.userName" : req.session.passport.user.username})
        //     }
        // })
    
    }
}
module.exports= new siteController ();