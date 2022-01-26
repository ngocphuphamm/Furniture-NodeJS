const Customer = require("../models/customers");
const Types = require("../models/types");
const Product = require("../models/product");
const suppliers = require("../models/suppliers");
const product = require("../models/product");
const customers = require("../models/customers");
const OjectId = require('mongodb').ObjectId;
const types = require("../models/types");

class siteController {
  // hiển thị các loại sản phẩm
  //[GET]  /home
  home(req, res, next) {
    Types.find({}, (err, data) => {
      if (req.isAuthenticated()) {
        Customer.findOne(
          { "loginInformation.userName": req.session.passport.user.username },
          (err, customersData) => {
            res.render("index", {
              data: data,
              message: req.flash("success"),
              customer: customersData,
            });
          }
        );
      } else {
        res.render("index", {
          data: data,
          message: req.flash("success"),
          customer: undefined,
        });
      }
    });
  }

  // sản phẩm trong các loại sản phẩm
  //[GET] /cart
  getCartPage(req, res, next) {
    if (req.isAuthenticated()) {
      Customer.findOne(
        { "loginInformation.userName": req.session.passport.user.username },
        (err, customerResult) => {
          res.render("categories/cart", {
            customer: customerResult,
            message: req.flash("success"),
          });
        }
      );
    } else {
      res.redirect("/login");
    }
  }

  /////USER////
  //[GET] /login
  getLoginPage(req, res, next) {
    var messageError = req.flash("error");
    var messageSuccess = req.flash("success");
    res.render("authencation/loginuser", {
      message: messageError.length != 0 ? messageError : messageSuccess,
      typeMessage: messageSuccess.length != 0 ? messageSuccess : messageError,
    });
  }

  //[GET] /sign-up
  getRegisterPage(req, res, next) {
    res.render("authencation/sign-up", {
      message:
        req.flash("success").length != 0
          ? req.flash("success")
          : req.flash("error"),
    });
  }

  //[POST] /sign-up
  postRegisterUser(req, res, next) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var phone = req.body.phone;
    var cmnd = req.body.cmnd;
    var email = req.body.email;
    var password = req.body.password;
    var re_password = req.body.repassword;

    Customer.findOne(
      { "loginInformation.userName": username },
      (err, customerData) => {
        if (customerData) {
          req.flash("error", "Tài khoản đã tồn tại");
          res.redirect("/sign-up");
        } else {
          var data = {
            fullNameCustomer: { firstName: firstname, lastName: lastname },
            dateOfBirth: null,
            sex: null,
            identityCardNumber: cmnd,
            address: null,
            phoneNumber: phone,
            email: email,
            listProduct: [],
            listFavorite: [],
            loginInformation: {
              userName: username,
              password: password,
              type: "User",
              roles: [],
            },
            avatar: "/uploads/user-01.png",
          };
          var newUser = new Customer(data);
          newUser
            .save()
            .then(() => {
              req.flash("success", "Tạo tài khoản thành công");
              res.redirect("/login");
            })
            .catch((err) => {
              console.log(err);
              req.flash("error", "Tạo tài khoản không thành công!");
              res.redirect("/login");
            });
        }
      }
    );
  }

  // add sản phẩm vào giỏ hàng
  //[GET] /cart/:id
  getAddToCartSingle(req, res, next) {
    if (req.isAuthenticated()) {
      var id = req.params.id;
      var username = req.session.passport.user.username;
      Product.findOne({ _id: id }, (err, productResult) => {
        Customer.findOneAndUpdate(
          { "loginInformation.userName": username },
          {
            $push: {
              listProduct: [
                {
                  productID: productResult._id.toString(),
                  productName: productResult.productName,
                  productPrice: productResult.description.price,
                  productImage: productResult.description.imageList[0],
                  amount: 1,
                },
              ],
            },
          }
        )
          .then(() => {
            req.flash("success", "Sản phẩm đã thêm vào giỏ hàng");
            res.redirect("/product/");
          })
          .catch(next);
      });
    } else {
      res.redirect("/login");
    }
  }

  // update dữ liệu trong  giỏ hàng
  //[POST]  /cart/update/:id
  postUpdateQTYInCart(req, res, next) {
    const quantity = parseInt(req.body.amount);
    const idProduct = req.params.id;
    const userCustomer = req.session.passport.user.username;
    Customer.updateOne(
      {
        "loginInformation.userName": userCustomer,
        "listProduct.productID": idProduct,
      },
      {
        $set: {
          "listProduct.$.amount": quantity,
        },
      }
    )
      .then(() => {
        console.log("thành cơng");
        res.redirect("/cart");
      })
      .catch(next);
  }

  // XÓA SẢN PHẨM
  //[GET] /cart/delete/:id
  deleteProduct(req, res, next) {
    var idProduct = req.params.id;
    var user = req.session.passport.user.username;
    Customer.updateMany(
      { "loginInformation.userName": user },
      {
        $pull: {
          listProduct: {
            productID: idProduct,
          },
        },
      }
    )
      .then(() => {
        res.redirect("/cart");
      })
      .catch(next);
  }
  // search sản phẩm
  //[GET] /search
  search(req, res, next) {
      console.log("đã vào")
    var name = req.query.search;
    Types.find({}, (err, dataType) => {
      suppliers.find({}, (err, dataSupplier) => {
        product.find(
          { productName: { $regex: name, $options: "i" } },
          (err, productData) => {
            if (req.isAuthenticated()) {
              customers.findOne(
                {
                  "loginInformation.userName":
                    req.session.passport.user.username,
                },
                (err, customerData) => {
                  res.render("search", {
                    types: dataType,
                    suppliers: dataSupplier,
                    products: productData,
                    key: name,
                    customer: customerData,
                  });
                }
              );
            } else {
              res.render("search", {
                types: dataType,
                suppliers: dataSupplier,
                products: productData,
                key: name,
                customer: undefined,
              });
            }
          }
        );
      });
    });
  }
  
   // render list khách hàng yêu thich1
  //[GET] /favorite/
  getFavoritePage(req,res,next)
  {
    var itemsPerPage = 6;
    if(req.isAuthenticated()) {
      customers.findOne({'loginInformation.userName': req.session.passport.user.username}, (err, customerResult) => {
        types.find({}, (err, data) => {
          suppliers.find({}, (err, supplier) => {
            res.render("favorites", {
              data: customerResult.listFavorite,
              types: data,
              suppliers: supplier,
              itemsPerPage: itemsPerPage,
              currentPage: 1,
              message: req.flash('success'),
              customer: customerResult
            });
          });
        });
      });
    } else {
      res.redirect('/login');
    }
  }

  //[get] favorite/page/2
  getFavoriteAtPage(req,res,next)
  {
    var itemsPerPage = 6;
    var page = req.params.page;
    if(req.isAuthenticated()) {
      customers.findOne({'loginInformation.userName': req.session.passport.user.username}, (err, customerResult) => {
        types.find({}, (err, data) => {
          suppliers.find({}, (err, supplier) => {
            res.render("favorites", {
              data: customerResult.listFavorite,
              types: data,
              suppliers: supplier,
              itemsPerPage: itemsPerPage,
              currentPage: page,
              message: req.flash('success'),
              customer: customerResult
            });
          });
        });
      });
    } else {
      res.redirect('/login');
    }
  }

  //[GET] /product/favorite/delete/:id
  getDeleteFavorite(req, res, next) {
    if (req.isAuthenticated()) {
      var id = req.params.id;
      var user = req.session.passport.user.username;
      customers.updateMany({ 'loginInformation.userName': user }, { $pull: { listFavorite: { _id: OjectId(id) } } })
        .then(() => {
          req.flash("success", "Đã sản phẩm khỏi yêu thích!");
          res.redirect('/favorite');
        })
        .catch((err) => {
          console.log(err);
          next();
        });
    } else {
      res.redirect('/login');
    }
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

}
module.exports = new siteController();
