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
//引入向前台返回数据
var $util = require('../util/util.js');
//引入risklevelDao
var risklevelDao = require('../dao/risklevelDao');

router.get('/getphone',function(req,res) {
	if(req.session.uid) {
		return risklevelDao.getphone(req,res);
	}
	else {
		return $util.jsonWrite(res,{'result':'failed'})
	}
})

router.post('/riskcommit',function(req,res) {
	return risklevelDao.riskcommit(req,res);
})

module.exports = router;
