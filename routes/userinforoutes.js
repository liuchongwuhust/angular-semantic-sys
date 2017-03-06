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

//引入userinfoDao
var userinfoDao = require('../dao/userinfoDao');
//引入向前台返回数据
var $util = require('../util/util.js');

router.post('/checkloginstate',function(req,res) {
	if(req.session.uid !== undefined) {
		return $util.jsonWrite(res,{'result':'succeed','loginState':true,'uid':req.session.uid});
	}
	else {
		return $util.jsonWrite(res,{'result':'succeed','loginState':false})
	}
});

router.post('/checkWechatCode',function(req,res) {
		console.log('checkWechatCode',req.query.code);

		userinfoDao.getAccessToken(req,res);

});

router.post('/WechatLogin',function(req,res) {
		console.log('WechatLogin service', req.query.openid,req.session.openid);
		userinfoDao.WechatLogin(req,res);

});

router.get('/checkriskstate',function(req,res) {
	return userinfoDao.checkRiskState(req,res);
});
router.get('/loginout',function(req,res) {
	if(req.session.uid) {
		delete req.session.uid;
		req.session.save();
		res.send({'result':'succeed','loginout':true});
		res.end();
	}
	else {
		res.send({'result':'succeed','loginout':false});
		res.end();
	}

})

router.get('/checkauth',function(req,res) {
	return userinfoDao.checkAuth(req,res);
})

router.get('/getallproduct',function(req,res) {
	return userinfoDao.getAllProduct(req,res);
})

router.post('/getConLevel',function(req,res) {
		userinfoDao.getConLevel(req,res);
});

router.post('/getRiskLevel',function(req,res) {
		userinfoDao.getRiskLevel(req,res);

});

router.post('/checkAutoLogin',function(req,res) {
	console.log('/checkAutoLogin',req.session.autoLogin);
	if (req.session.autoLogin==1) {
		res.send({'result':false});
		res.end();
	}else {
		res.send({'result':true});
		res.end();
	}
});

//autoLogin=1表示不允许自动登录,2为允许自动登录
router.post('/setAutoLoginState',function(req,res) {
	console.log('/setAutoLoginState',req.session.autoLogin,req.query.autoLogin);

	req.session.autoLogin=req.query.autoLogin;
	if (req.session.autoLogin===req.query.autoLogin) {
		res.send({'result':true});
		res.end();
	}else {
		res.send({'result':false});
		res.end();
	}


});

//根据cookie自动登录
router.post('/checkandloginbycookie',function(req,res) {
	if(typeof(req.session.uid) != "undefined") {
		res.send({"result":"succeed","gorisk":false});
		res.end();
	}
	else {
		if(req.query.exist == "true") {
			return userinfoDao.checkAndLoginByCookie(req,res);
		}
		else {
			res.send({"result":"failed","reason":"登录已失效"});
			res.end();
		}
	}
})

module.exports = router;
