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
var layoutManageDao = require('../dao/layoutmanagedao');

router.get('/getshowproduct',function(req,res) {
	return layoutManageDao.getShowProduct(req,res);
})

router.get('/getallproducts',function(req,res) {
	return layoutManageDao.getAllProducts(req,res);
})

router.post('/updatelayout',function(req,res) {
	return layoutManageDao.updateLayout(req,res);
})

module.exports = router;
