const Customer =  require("../models/customers");
const Types = require("../models/types");
const Product = require("../models/product");

class siteController{
    // hiển thị các loại sản phẩm
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
    
    // sản phẩm trong các loại sản phẩm 
    //[GET] /cart 
    getCartPage(req,res,next)
    {
  
        if (req.isAuthenticated()) {
            Customer.findOne(
              { "loginInformation.userName": req.session.passport.user.username },
              (err, customerResult) => {
                res.render("categories/cart", { customer: customerResult, message: req.flash('success') });
              }
            );
          } else {
            res.redirect("/login");
          }
    }


    /////USER////
    //[GET] /login
    getLoginPage(req,res,next)
    {
        var messageError = req.flash("error");
        var messageSuccess = req.flash("success");
        res.render("authencation/loginuser",{ message : messageError.length !=0 ? messageError : messageSuccess,
                                 typeMessage : messageSuccess.length != 0 ? messageSuccess : messageError })
    }

    //[GET] /sign-up
    getRegisterPage(req,res,next)
    {
        res.render("authencation/sign-up",
        {
            message : req.flash("success").length != 0 ? req.flash("success") : req.flash("error")
        })
    }


    //[POST] /sign-up
    postRegisterUser(req,res,next)
    {
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var username = req.body.username;
        var phone = req.body.phone;
        var cmnd = req.body.cmnd;
        var email = req.body.email;
        var password = req.body.password;
        var re_password = req.body.repassword;

        Customer.findOne({"loginInformation.userName": username},(err,customerData)=>
        {
            if(customerData)
            {
                req.flash("error","Tài khoản đã tồn tại");
                res.redirect("/sign-up")
            }
            else
            {
                var data = { 
                    'fullNameCustomer': {'firstName': firstname, 'lastName': lastname},
                    'dateOfBirth': null,
                    'sex': null,
                    'identityCardNumber': cmnd,
                    'address': null,
                    'phoneNumber': phone,
                    'email': email,
                    'listProduct': [],
                    'listFavorite': [],
                    'loginInformation': {'userName': username, 'password': password, 'type': 'User', roles: []},
                    'avatar': '/uploads/user-01.png'
                }
                var newUser = new Customer(data);
                newUser.save()
                .then(()=>
                {
                    req.flash("success","Tạo tài khoản thành công");
                    res.redirect("/login")
                })
                .catch((err) => {
                    console.log(err);
                    req.flash('error', 'Tạo tài khoản không thành công!');
                    res.redirect('/login');
                  });
            }
        })
    }


    // add sản phẩm vào giỏ hàng
    //[GET] /cart/:id
    getAddToCartSingle(req,res,next)
    {
        if(req.isAuthenticated())
        {
            var  id = req.params.id; 
            var username = req.session.passport.user.username; 
            Product.findOne({_id:id},(err,productResult)=>
            {
                Customer.findOneAndUpdate({"loginInformation.userName":username},{
                    $push : { 
                        listProduct :[
                         {   productID: productResult._id.toString(),
                            productName: productResult.productName,
                            productPrice: productResult.description.price,
                            productImage: productResult.description.imageList[0],
                            amount: 1,}
                        ]
                    }
                })
                .then(()=>
                {
                    req.flash("success","Sản phẩm đã thêm vào giỏ hàng");
                    res.redirect("/product/");
                })
                .catch(next);
            })
        }
        else
        {
            res.redirect("/login");
        }
    }
    

    // update dữ liệu trong  giỏ hàng 
    //[POST]  /cart/update/:id
    postUpdateQTYInCart(req,res,next)
    {
        const quantity = parseInt(req.body.amount); 
        const idProduct = req.params.id; 
        const userCustomer = req.session.passport.user.username; 
        Customer.updateOne({"loginInformation.userName":userCustomer,"listProduct.productID":idProduct},
        {
            $set : { 
                "listProduct.$.amount": quantity
            }
        })
        .then(()=>
        {
            console.log("thành cơng")
            res.redirect("/cart");

        })
        .catch(next);
    }
}
module.exports= new siteController ();