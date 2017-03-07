/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

var express = require('express');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'upload/' });
 nodeExcel = require('excel-export');
 Step = require("./app/lib/Step/Step")

//这里引入Session和cookie
var cookieParser = require('cookie-parser');
var session = require('express-session');

var bodyParser = require('body-parser');


// var login = require('./routes/login');
//
//
var unitManageRoutes = require('./routes/unitManageRoutes');
var tradeUnitStockRoutes = require('./routes/tradeUnitStockRoutes');

var operlogin = require('./routes/operloginroutes');
var allocateStockRoutes = require('./routes/allocateStockRoutes');
var operManage = require('./routes/opermanageroutes');

var wishList = require('./routes/wishListRoutes');
var random = require('./routes/randomRoutes');
var groupexchange = require('./routes/groupexchangeroutes');



//配置文件
if(typeof csp=='undefined') csp = {}
try{
  csp.config = require('./config/config.default.json')
}catch(e){
  console.error(e);
  process.exit();
}


//加载数据库

require("./config/db.js");


// 加载推送服务
require("./webSocket/pushService.js")


// 设置express
var app = express();
//form 与json 请求的解析规则
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//托管静态资源
app.use( express.static('app'));
//设置session存在内存中，30分钟有效
app.use(cookieParser());

app.use(session({
    secret: "12345",
    key: "name",
    cookie: {
        maxAge: 60*60*1000,
        secure: false
    },
    resave: true,
    saveUninitialized: true
}));


//设置启动主页面
app.get('/', function(req, res){
  // req.session.logincode=req.query.code;
  // req.session.loginstate=req.query.state;
  console.log('get code',req.query);


  res.redirect("/index2.html");
});


app.use('/unitManageService',unitManageRoutes);
app.use('/tradeUnitStockService',tradeUnitStockRoutes);
app.use('/operlogin',operlogin);

app.use('/tradeTeamManage',allocateStockRoutes);
app.use('/opermanage',operManage);

app.use('/wishList', wishList)
app.use('/random', random)
app.use('/groupexchange',groupexchange);

var server = require('http').createServer(app);
server.listen(5000);


console.log("\r\nlisten http://127.0.0.1:5000");
