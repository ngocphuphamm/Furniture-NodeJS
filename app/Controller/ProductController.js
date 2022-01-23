const product = require("../models/product");
const customers = require("../models/customers");
const type = require("../models/types");
const supplier = require("../models/suppliers");
class ProductController {
    // hiển thị dữ liệu các sản phẩm
    //[GET] /product/
  getProductDefault(req, res, next) {
    var itemsPerPage = 6;
    // nếu có tài khoản thì hiển thị sản phẩm để có thể yêu thích hoặc đưa vào sản phẩm
    product.find({}, (err, productData) => {
      type.find({}, (err, typeData) => {
        supplier.find({}, (err, supplierData) => {
          if (req.isAuthenticated()) {
            customers.findOne(
              { "loginInformation.userName": req.session.passport.user.username },
              (err, customerData) => {
                res.render("product", {
                  data: productData,
                  types: typeData,
                  suppliers: supplierData,
                  itemsPerPage: itemsPerPage,
                  currentPage: 1,
                  message: req.flash("success"),
                  customer: customerData,
                });
              }
            );
          } else {
            res.render("product", {
              data: productData,
              types: typeData,
              suppliers: supplierData,
              itemsPerPage: itemsPerPage,
              currentPage: 1,
              message: req.flash("success"),
              customer: undefined,
            });
          }
        });
      });
    });
  }


       // thêm vào sản phẩm yêu thích
  // [GET] /product/favorite/:id
  getAddFavorite(req, res, next) {
    // kiểm tra người dùng đăng nhập hay chưa
    if (req.isAuthenticated()) {
      var id = req.params.id;
      // session được lưu đã  được config trong passport
      var user = req.session.passport.user.username;
      // tìm kiểm sản phẩm được add vào giỏ hàng 
      product.find({ _id: id }, (err, productData) => {
          // add dữ liệu sản phẩm vào customer
        customers.findOneAndUpdate(
          { "loginInformation.userName": user },
          {
            $push: {
              listFavorite: [productData],
            },
          }
        )
          .then(()=>
          {
              req.flash("success","Đã thêm vào danh sách");
              res.redirect(`/product/`)
          })
          .catch(next)
      });
    }
    else
    {
      res.redirect("/login");
    }
  }
  
}
module.exports = new ProductController();
