//Model 
const adminModel = require("./app/models/admin");
const customerModel = require("./app/models/customers");
///
const http = require("http");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require("passport");
const session = require("express-session");
const flash = require('connect-flash');
const LocalStrategy = require("passport-local").Strategy;

const route = require("./routes");

var app = express();


const hostname = '127.0.0.1';
const port = 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




// cài đặt session 
app.use(
  session({
    secret : "thesecret",
    saveUninitialized : true , 
    resave : false, 
    cookie : {maxAge : Infinity , path:'/'}
  })
)

app.use(
  session({
    secret : "secret",
    saveUninitialized : true, 
    resave : false , 
    cookie : {maxAge : Infinity , path:'/admin'}
  })
)
app.use(flash());

passport.use('admin-local',new LocalStrategy(function(username,password,done)
{
    adminModel.findOne({'loginInformation.userName':username},
    function(err,user)
    {
      if(err)
      {
        return done(err);
      }
      // user không đúng 
      if(!user)
      {
        return done(null,false,{message : 'Sai tên tài khoản hoặc mật khẩu'});
      }
      // mật khẩu không đúng 
      if(user.loginInformation.passport !==  password)
      {
        return done(null,false,{message : 'Sai tên tài khoản hoặc mật khẩu'});
      }
      return done(null,user,{message : 'Đăng nhập thành công'})
    })
}))

passport.use(
  'user-local',new LocalStrategy(function(username,password,done)
  {
    customerModel.findOne({'loginInformation.userName':username},
    function(err,user)
    {
      if(err)
      {
        return done(err);
      }
      
    })
  })
)

//passport.initialize : middleware được gọi ở từng request, 
//kiểm tra session lấy ra passport.user nếu chưa có thì tạo rỗng.
app.use(passport.initialize());

// passport.session: middleware sử dụng kịch bản Passport ,
//  sử dụng session lấy thông tin user rồi gắn vào req.user.
app.use(passport.session());

// passport.serializeUser: 
// hàm được gọi khi xác thực thành công để lưu thông tin user vào session
passport.serializeUser((user,done)=>
{
    return done(null,{username: user.loginInformation.userName, type : user.loginInformation.type});
})


// passport.deserializeUser : hàm được gọi bởi passport.session 
// .Giúp ta lấy dữ liệu user dựa vào thông tin lưu trên session và gắn vào req.user
passport.deserializeUser((user,done)=>
{
  if(user.type == 'Admin')
  {
      adminModel.findOne({'loginInformation.username':user.username},(err,data)=>
      {
        if(err) return done(err);
        if(!data) return done(null,false);
        if(data.loginInformation.userName == user.username)
        {
          return done(null,data);
        }
      })
  }
  else{
     customerModel.findOne({'loginInformation.username': user.username},(err,data)=>
     {
       if(err) return done(err); 
       if(!data) return done(null,false);
       if(data.loginInformation.username == user.username)
       {
         return done(null,data)
       }
     })
  }
})


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




// tạo route chứa các handle function
route(app);


// db connect 
const db = require("./config/index");
const admin = require("./app/models/admin");
db.connect();

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
module.exports = app;
