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
var loginDao= require('../dao/login');




router.post('/sessionUid',function(req,res){
  req.session.uid=req.query.uid;
  req.session.save();
  console.log(JSON.stringify(req.session));
})

router.post('/userCheck', function(req, res){

  console.log("userCheck");
  console.log(req.session.uid);

  if(typeof (req.session.uid)=='undefined'){
    res.send({login:false});

    res.end();
  }else{
    res.send({login:true,uid:req.session.uid});
    res.end();
  }


})
router.post('/athen', function(req, res){
  console.log("到router了");
  loginDao.athen(req, res);
})
router.post('/lastLoginTime', function(req, res){
  loginDao.lastLoginTime(req, res);
})

module.exports = router;
