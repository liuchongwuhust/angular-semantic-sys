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
var router = express.Router();
var usercenterDao= require('../dao/usercenter');

//引入阿里大于短信服务
var aliApp = require('alidayu-node');
var mApp = new aliApp('23318369', 'd876a0c1079ab16f93a4c17c687f7b5f');
//引入向前台返回数据
var $util = require('../util/util.js');

router.post('/getUserInfo', function(req, res){
  console.log("到usercenterDao了");
  usercenterDao.getUserInfo(req, res);
});

router.post('/setUserInfo', function(req, res){
  usercenterDao.setUserInfo(req, res);
});

router.post('/setPassword',
function(req, res)
{
  usercenterDao.setPassword(req, res);
});

router.post('/setCurrentPage',
function(req, res)
{
  req.session.usercenterPage=req.query.usercenterPage;
  req.session.save();
  res.send({result:true,usercenterPage:req.session.usercenterPage});
  res.end();
});

router.post('/getCurrentPage',
function(req, res)
{
  res.send({result:true,usercenterPage:req.session.usercenterPage});
  res.end();
});

router.post('/setCenterData',
function(req, res)
{
  req.session.centerData=req.query.centerData;
  //usercenterDao.setCenterData(req, res);
  res.send({result:true});
  res.end();

});

router.post('/getCenterData',
function(req, res)
{
  // usercenterDao.getCenterData(req,res);
  res.send(req.session.centerData);
  res.end();
});

router.post('/setWeChatAccount',
function(req, res)
{
  usercenterDao.setWeChatAccount(req,res);
});

router.post('/setEmail',
function(req, res)
{
  usercenterDao.setEmail(req,res);
});

router.post('/setPhone',
function(req, res)
{
  usercenterDao.setPhone(req,res);
});


router.post('/sendUserCenterCode',function(req,res){
  //生成短信随机验证码
  var codestr = "";
  for( var i = 0; i < 6; i ++) {
    codestr += Math.floor(Math.random()*10);
  }
  console.log('您的短信验证码为：(未发送)',codestr);


  //发送短信验证码
    var phoneNumber = req.query.phone;
    req.session.usercenterPhone = phoneNumber;
    var sendjson = {};
    sendjson.code = codestr;
    sendjson.product = "CSP";
    mApp.smsSend({
        sms_type: 'normal',
        sms_free_sign_name: '身份验证', //短信签名，参考这里 http://www.alidayu.com/admin/service/sign
        sms_param: JSON.stringify(sendjson),//短信变量，对应短信模板里面的变量
        rec_num: phoneNumber, //接收短信的手机号
        sms_template_code: 'SMS_25670578' //短信模板，参考这里 http://www.alidayu.com/admin/service/tpl
    },function(result) {
        if(result.alibaba_aliqin_fc_sms_num_send_response &&result.alibaba_aliqin_fc_sms_num_send_response.result.success === true) {
            console.log('您的短信验证码为：(已发送)',codestr);
            req.session.usercenterCode = codestr;
            return $util.jsonWrite(res,{'result':true});
        }
        else {
          console.log('result',result);
            return $util.jsonWrite(res,{'result':false});
        }
    });
})

router.post('/checkUserCenterCode',function(req,res){
  console.log('/checkUserCenterCode',req.query);
  console.log('checkUserCenterCode',req.session.usercenterPhone,req.query.phone,req.session.usercenterCode,req.query.code);
  if (typeof(req.session.usercenterPhone)=='undefined'||
  typeof(req.session.usercenterCode)=='undefined'||
      req.query.phone==''||
      req.query.code=='') {
    return $util.jsonWrite(res,{'result':false});
  }

  if(req.session.usercenterPhone===req.query.phone&&
      req.session.usercenterCode===req.query.code){
    return $util.jsonWrite(res,{'result':true});
  }

  return $util.jsonWrite(res,{'result':false});
});

module.exports = router;
