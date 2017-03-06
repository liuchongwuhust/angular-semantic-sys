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
var operLoginDao = require('../dao/operloginDao');
router.post('/checklogin',function(req,res) {
	if(typeof(req.session.login_maid) != "undefined" && typeof(req.session.login_oid) != "undefined") {
		res.send({"result":"succeed","loginState":true});
		res.end;
	}
	else {
		res.send({"result":"succeed","loginState":false});
		res.end;
	}
})
router.post('/login',function(req,res) {
	return operLoginDao.login(req,res);
})

router.post('/checkandlogin',function(req,res) {
	if(typeof(req.session.login_maid) != "undefined" && typeof(req.session.login_oid) != "undefined") {
		res.send({"result":"succeed"});
		res.end;
	}
	else {
		if(req.query.cookieExist == "true") {
			return operLoginDao.checkAndLogin(req,res);
		}
		else {
			res.send({"result":"failed","reason":"登录失效"});
			res.end;
		}
	}
})

router.get('/checkgroupandgetlist',function(req,res) {
	if(typeof(req.session.login_maid) != "undefined" && typeof(req.session.login_oid) != "undefined") {
		return operLoginDao.checkGroupAndGetList(req,res);
	}
	else {
		res.send({"result":"failed","reason":"未授权的请求"});
		res.end;
	}
})

router.post('/loginout',function(req,res) {
	if(typeof(req.session.login_maid) != "undefined") {
		delete req.session.login_maid;
	}
	if(typeof(req.session.login_oid) != "undefined") {
		delete req.session.login_oid;
	}
	res.send({"result":"succeed"});
	res.end;
})

module.exports = router;
