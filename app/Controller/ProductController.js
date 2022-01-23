const product  = require("../models/product");
const customers = require("../models/customers");
const type = require("../models/types");
const supplier = require("../models/suppliers");
class ProductController {
    getProductDefault(req,res,next)
    {
        var itemsPerPage= 6 ; 
        // nếu có tài khoản thì hiển thị sản phẩm để có thể yêu thích hoặc đưa vào sản phẩm 
        product.find({},(err,productData)=>
        {
           type.find({},(err,typeData)=>
           {
               supplier.find({},(err,supplierData)=>
               {
                   if(req.isAuthenticated())
                   {
                       customers({"loginInformation.userName":req.session.passport.username},(err,customerData)=>
                       {
                           res.render("product",{
                               data : productData, 
                               types : typeData , 
                               suppliers : supplierData, 
                               itemsPerPage : itemsPerPage , 
                               currentPage : 1 , 
                               message : req.flash("success"),
                               customer : customerData 
                           })
                       })
                   }
                   else
                   {
                       res.render("product",{
                        data : productData, 
                        types : typeData , 
                        suppliers : supplierData, 
                        itemsPerPage : itemsPerPage , 
                        currentPage : 1 , 
                        message : req.flash("success"),
                        customer : undefined 
                       })
                   }
               })
           })
         
        })
    }
}
module.exports =  new ProductController();