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
var operManageDao = require('../dao/opermanagedao');

router.get('/getallmaid',function(req,res) {
	return operManageDao.getAllMaid(req,res);
})

router.get('/getoidbymaid',function(req,res) {
	return operManageDao.getOidByMaid(req,res);
})

router.get('/getoperbyoid',function(req,res) {
	return operManageDao.getOperByOid(req,res);
})

router.post('/addoper',function(req,res) {
	return operManageDao.addOper(req,res);
})

router.post('/updateoper',function(req,res) {
	return operManageDao.updateOper(req,res);
})

router.post('/changeoperstat',function(req,res) {
	return operManageDao.changeOperStat(req,res);
})

router.post('/resetpass',function(req,res) {
	return operManageDao.resetPass(req,res);
})

router.get('/getcaidbymaid',function(req,res) {
	if(typeof(req.session.login_maid) != "undefined" && typeof(req.session.login_oid) != "undefined") {
		return operManageDao.getCaidByMaid(req,res);
	}
	else {
		res.send({"result":"failed","reason":"未授权的请求"});
		res.end();
	}
})

router.get('/gettridbycaid',function(req,res) {
	if(typeof(req.session.login_maid) != "undefined" && typeof(req.session.login_oid) != "undefined") {
		return operManageDao.getTridByCaid(req,res);
	}
	else {
		res.send({"result":"failed","reason":"未授权的请求"});
		res.end();
	}
})

router.post('/addtrader',function(req,res) {
	if(typeof(req.session.login_maid) != "undefined" && typeof(req.session.login_oid) != "undefined") {
		return operManageDao.addTrader(req,res);
	}
	else {
		res.send({"result":"failed","reason":"未授权的请求"});
		res.end();
	}
})

module.exports = router;
