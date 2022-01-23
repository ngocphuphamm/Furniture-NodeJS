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

    //[GET] /sign-up
    getRegisterPage(req,res,next)
    {
        res.render("sign-up",
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
}
module.exports= new siteController ();