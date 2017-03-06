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

//引入registerDao
var registerDao = require('../dao/registerDao');
//引入阿里大于短信服务
var aliApp = require('alidayu-node');
var mApp = new aliApp('23318369', 'd876a0c1079ab16f93a4c17c687f7b5f');
//引入向前台返回数据
var $util = require('../util/util.js');

router.post('/checkPhone',function(req,res){
  console.log('检查手机号是否已被注册');
  return registerDao.checkPhone(req,res);
})

router.post('/sendCheckCode',function(req,res){
  //生成短信随机验证码
  var codestr = "";
  for( var i = 0; i < 6; i ++) {
    codestr += Math.floor(Math.random()*10);
  }
  console.log('您的短信验证码为：',codestr);
  req.session.regCheckCode = codestr;

  //发送短信验证码
    var phoneNumber = req.query.phone;
    req.session.phone = phoneNumber;
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
            return $util.jsonWrite(res,{'result':'succeed'});
        }
        else {
            return $util.jsonWrite(res,{'result':'failed'});
        }
    });
})

router.post('/toRegister',function(req,res) {
    var info = req.query;
    console.log('要检查的信息为：',info.phone,info.code,req.session);
    if(req.session.regCheckCode === info.code && info.phone === req.session.phone) {
        //写入数据库
        return registerDao.toRegister(req,res);
    }
    else {
        return $util.jsonWrite(res,{'result':'failed','reason':'验证码错误'});
    }
})

router.get('/toDeleteSession',function(req,res){
    var phone = req.session.phone;
    var pass = phone.substring(phone.length - 6);
    var sendjson = {};
    sendjson.code = pass;
    sendjson.product = "CSP";
    mApp.smsSend({
        sms_type: 'normal',
        sms_free_sign_name: '身份验证', //短信签名，参考这里 http://www.alidayu.com/admin/service/sign
        sms_param: JSON.stringify(sendjson),//短信变量，对应短信模板里面的变量
        rec_num: phone, //接收短信的手机号
        sms_template_code: 'SMS_25760603' //短信模板，参考这里 http://www.alidayu.com/admin/service/tpl
    },function(result) {
        console.log("注册账号推送密码发送状态",result);
    });
    //将uid添加到session中
    registerDao.changeLoginState(req,res);
})
module.exports = router;
