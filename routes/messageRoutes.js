/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

var express = require('express');
var router = express.Router();
var messageDao= require('../dao/messageDao');
var $util = require('../util/util.js');


//引入阿里大于短信服务
var aliApp = require('alidayu-node');
var mApp = new aliApp('23318369', 'd876a0c1079ab16f93a4c17c687f7b5f');

router.post('/saveCreateMessage', function(req, res){
  messageDao.saveCreateMessage(req, res);
});

router.post('/getAllMessage', function(req, res){
  messageDao.getAllMessage(req, res);
});

router.post('/saveEditMessage', function(req, res){
  messageDao.saveEditMessage(req, res);
});

router.post('/deleteMessage', function(req, res){
  messageDao.deleteMessage(req, res);
});

router.post('/setMessageType', function(req, res){
  req.session.messageType=req.query.messageType;
  res.send({'result':true});
  res.end();
});

router.post('/getMessageType', function(req, res){
  res.send({'messageType':req.session.messageType});
  res.end();
});

function sendMessage(tels,msgid){
  if (tels.length==0) {
    return true;
  }

  var telStr='';//保存的电话号码必须小于200,阿里大于的限制
  for (var i = 0,count=0; ; i++) {
    if (i >=tels.length||count>=200) {//200就是限制的数字
      break;
    }
    count++;
    telStr+=tels[i]+',';
    tels.splice(i,1);
    --i;
  }

  if (telStr.charAt(telStr.length-1)==',') {
    telStr=telStr.substring(0,telStr.length-1);
  }
  console.log('telStr',telStr);

  var sendjson = {};
  sendjson.code = 'codestr';
  sendjson.product = "CSP";
  mApp.smsSend({
      sms_type: 'normal',
      sms_free_sign_name: '身份验证', //短信签名，参考这里 http://www.alidayu.com/admin/service/sign
      sms_param: JSON.stringify(sendjson),//短信变量，对应短信模板里面的变量
      rec_num: telStr, //接收短信的手机号
      sms_template_code: msgid //短信模板，参考这里 http://www.alidayu.com/admin/service/tpl
  },function(result) {
      console.log('发送短信成功3');
      if(result.alibaba_aliqin_fc_sms_num_send_response &&result.alibaba_aliqin_fc_sms_num_send_response.result.success === true) {
        console.log('发送短信成功1');
        if (tels.length>0) {
          console.log('发送短信成功2');
          return sendMessage(tels,msgid);
        }
        return true;
      }
      else {
        console.log('result',result);
        //这里对返回值没有处理,只是调用发送给所有的电话号码
        if (tels.length>0) {
          console.log('发送短信失败');
          return sendMessage(tels,msgid);
        }
        return false;
      }
  });

}

router.post('/sendMessage', function(req, res){
  var tels=[];
  if (req.query.single) {
    tels.push(req.query.tels);
  }
  else {
    tels=req.query.tels;
  }
  console.log('tels',tels,req.query.msgid);
  sendMessage(tels,req.query.msgid);

  return $util.jsonWrite(res,{'result':true});


});


module.exports = router;
