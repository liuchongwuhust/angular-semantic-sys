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
var groupExchangeDao = require('../dao/groupexchangedao');

router.get('/getgroupinfoandstock',function(req,res) {
    if(typeof(req.session.login_maid) != "undefined" && typeof(req.session.login_oid) != "undefined") {
		return groupExchangeDao.getGroupInfoAndStock(req,res);
	}
	else {
		res.send({"result":"failed","reason":"未授权的请求"});
		res.end();
	}
})

router.get('/getgroupstock',function(req,res) {
    if(typeof(req.session.login_maid) != "undefined" && typeof(req.session.login_oid) != "undefined") {
		return groupExchangeDao.getGroupStock(req,res);
	}
	else {
		res.send({"result":"failed","reason":"未授权的请求"});
		res.end();
	}
})

router.get('/writedb',function(req,res) {
    return groupExchangeDao.writedb(req,res);
})

router.post('/addexchange',function(req,res) {
    if(typeof(req.session.login_maid) != "undefined" && typeof(req.session.login_oid) != "undefined") {
		return groupExchangeDao.addExchange(req,res);
	}
	else {
		res.send({"result":"failed","reason":"未授权的请求"});
		res.end();
	}
})

router.post('/deleteexchange',function(req,res) {
    if(typeof(req.session.login_maid) != "undefined" && typeof(req.session.login_oid) != "undefined") {
		return groupExchangeDao.deleteExchange(req,res);
	}
	else {
		res.send({"result":"failed","reason":"未授权的请求"});
		res.end();
	}
})

router.post('/addaskexchange',function(req,res) {
    if(typeof(req.session.login_maid) != "undefined" && typeof(req.session.login_oid) != "undefined") {
		return groupExchangeDao.addAskExchange(req,res);
	}
	else {
		res.send({"result":"failed","reason":"未授权的请求"});
		res.end();
	}
})

router.get('/getexchangenews',function(req,res) {
    if(typeof(req.session.login_maid) != "undefined" && typeof(req.session.login_oid) != "undefined") {
		return groupExchangeDao.getExchangeNews(req,res);
	}
	else {
		res.send({"result":"failed","reason":"未授权的请求"});
		res.end();
	}
})

module.exports = router;
