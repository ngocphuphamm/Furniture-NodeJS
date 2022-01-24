const product = require("../models/product");
const customers = require("../models/customers");
const type = require("../models/types");
const supplier = require("../models/suppliers");
const types = require("../models/types");
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
              {
                "loginInformation.userName": req.session.passport.user.username,
              },
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
        customers
          .findOneAndUpdate(
            { "loginInformation.userName": user },
            {
              $push: {
                listFavorite: [productData],
              },
            }
          )
          .then(() => {
            req.flash("success", "Đã thêm vào danh sách");
            res.redirect(`/product/`);
          })
          .catch(next);
      });
    } else {
      res.redirect("/login");
    }
  }

  // lọc dữ liệu loại
  // /product/product-filter
  filterProduct(req, res, next) {
    // selection loại sản phẩm
    var selection = req.body.selection;
    // select loại thương hiệu sản xuất
    var supplierFilter = req.body.supplier;
    req.session.selection = selection;
    req.session.supplierFilter = supplierFilter;
    console.log(req.session);
    var itemsPerPage = 6;
    if (selection) {
      if (supplierFilter) {
        // tìm sản phẩm với những điều kiện lọc filter
        product.find(
          {
            description: {
              $elementMatch: {
                types: selection,
                supplierCode: supplierFilter,
              },
            },
          },
          (err, dataProduct) => {
            // tìm tất cả loại sản phảm
            types.find({}, (err, dataType) => {
              // tìm tất cả nhà cung cấp 
              supplier.find({}, (err, dataSupplier) => {
                // nếu đã đăng nhập thì set session cookie để có gì cho vào được giỏ hàng hay yêu thích 
                if(req.isAuthenticated())
                {
                  customers.findOne({"loginInformation.userName" : req.session.passport.user.username},(err,customerData)=>
                  {
                    console.log("vao dang nhap thanh cong")
                    res.send({
                              data:dataProduct,
                              types :dataType,
                              supplier : dataSupplier , 
                              itemsPerPage : itemsPerPage, 
                              currentPage : 1 , 
                              customer : customerData,
                              message : req.flash("Thanh Cong"),
                              selected : selection , 
                             supplierFilter : supplierFilter  })
                  })
                }
                else
                {
                  console.log("vao hanh cong")
                  res.send({
                    data:dataProduct,
                    types :dataType,
                    supplier : dataSupplier  , 
                    itemsPerPage : itemsPerPage, 
                    currentPage : 1 , 
                    customer : undefined,
                    message : req.flash("Thanh Cong"),
                    selected : selection , 
                   supplierFilter : supplierFilter  })
                }
              });
            });
          }
        );
      }
    }
  }
}
module.exports = new ProductController();
