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

var aliApp = require('alidayu-node');
var mApp = new aliApp('23318369', 'd876a0c1079ab16f93a4c17c687f7b5f');

var wchatRegDao = require('../dao/wchatregDao');
router.get('/checkwchatimgcode',function(req,res) {
    if(req.query.imgcode && req.session.wchatRegCode && req.query.imgcode === req.session.wchatRegCode) {
        res.send({'result':'succeed','error':false})
        res.end();
    }
    else {
        res.send({'result':'succeed','error':true})
        res.end();
    }
});

router.post('/wchatregsendcode',function(req,res) {
    //生成短信随机验证码
    var codestr = "";
    for( var i = 0; i < 6; i ++) {
      codestr += Math.floor(Math.random()*10);
    }
    console.log('您的短信验证码为：',codestr);
    req.session.wchatRegCheckCode = codestr;

    //发送短信验证码
      var phoneNumber = req.query.phone;
      req.session.wchatregphone = phoneNumber;
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
              res.send({'result':'succeed','error': false});
              res.end();
          }
          else {
              res.send({'result':'succeed','error': true});
              res.end();
          }
      });
});

router.post('/wchatregcheckcode',function(req,res) {
    if(req.query.phone === req.session.wchatregphone && req.query.code === req.session.wchatRegCheckCode) {
        res.send({'result':'succeed','match':true});
        res.end();
    }
    else {
        res.send({'result':'succeed','match':false});
        res.end();
    }
});

router.post('/wchatregdb',function(req,res) {
    return wchatRegDao.wchatRegDB(req,res);
})

router.post('/wchatautologin',function(req,res) {
    if(req.session.wchatRegNew === true) {
        var phone = req.session.wchatregphone;
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
    }
    return wchatRegDao.wchatAutoLogin(req,res);
})

router.get('/checkwchatregstate',function(req,res) {
    if(req.session.regOpenid && req.session.regUnionid && req.session.regWechatName && !req.session.uid) {
        res.send({'result':'succeed'});
        res.end();
    }
    else {
        res.send({'result':'failed'});
        res.end();
    }
})
module.exports = router;
