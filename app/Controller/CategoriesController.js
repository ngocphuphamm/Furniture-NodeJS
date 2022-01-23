const Suppliers = require("../models/suppliers");
const Product =  require("../models/product");
const Types = require("../models/types");

class CategoriesController{
  getList(req,res,next)
  {
    
    var id = req.params.id; 
      // đặt biến phân trang 
    var itemsPerPage = 6; 
    // gán dữ liệu session id sản phẩm vào 
    req.session.categories = id ; 
    // tim các sản phẩm có loại dựa trên params id 
    Product.find({"description.typeCode": id}, (err,dataProduct)=>
    {
      // tìm tất cả nhà sản xuất 
      Suppliers.find({},(err,suppliersData)=>
      {
          // tìm loại hiện sản phẩm hiện tại 
          Types.findOne({_id : id},(err,typeData)=>
          {
              res.render("categories/categories-list-item",{
                suppliers: suppliersData,
                products: dataProduct,
                type: typeData,
                itemsPerPage: itemsPerPage,
                currentPage: 1
              })
          })
      })
    })
  }
}
module.exports= new CategoriesController();