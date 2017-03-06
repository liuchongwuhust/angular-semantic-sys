/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */


var $util = require('../util/util.js');
var http=require('http');
var request = require('request');

var sql = {};

sql.checkRiskState = function (req,res) {
	var querySql = 'select risklevel_code from user where uid ="'+req.session.uid+'"';
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({'result':'failed'});
			res.end();
		}
		else {
			if(result.length > 0 && result[0] != undefined) {
				if(result[0].risklevel_code === 0) {
					res.send({'result':'succeed','riskstate':false});
					res.end();
				}
				else {
					res.send({'result':'succeed','riskstate':true});
					res.end();
				}
			}
			else {
				res.send({'result':'failed'});
				res.end();
			}
		}
	})
};

sql.checkAuth = function(req,res) {
	var querysql = 'select conlevel from user where uid = "'+req.session.uid+'"';
	csp.db.query(querysql,function(err,result) {
		console.log(result);
		if(err) {
			res.send({'result':'failed'});
			res.end();
		}
		else {
			if(result.length > 0 && result[0] ) {
				if(result[0].conlevel === 1 || result[0].conlevel === 2) {
					res.send({'result':'succeed'});
					res.end();
				}
				else  {
					res.send({'result':'failed'});
					res.end();
				}
			}
			else {
				res.send({'result':'failed'});
				res.end();
			}
		}
	})
};

sql.getAllProduct = function(req,res) {
	var querysql = "select t1.id,t1.caption,t1.contents,t1.piclink,t1.releasetime,t2.username from product t1, user t2 where t1.uid = t2.uid";
	csp.db.query(querysql,function(err,result) {
		console.log(err,result);
		if(err) {
			res.send({'result':'failed'});
			res.end();
		}
		else {
			if(result.length > 0 ) {
				res.send({'result':'succeed','product':result});
				res.end();
			}
			else {
				res.send({'result':'failed'});
				res.end();
			}
		}
	})
}

sql.getAccessToken = function(req,res) {
	var codeToAccess_token={};
	codeToAccess_token.appid='wxaec09771f7c5323d';
	codeToAccess_token.secret='607a7436eab3f1b84999fe2119758938';
	codeToAccess_token.code=req.query.code;
	codeToAccess_token.grant_type='authorization_code';

	var accesstokenReq='https://api.weixin.qq.com/sns/oauth2/access_token?appid='+codeToAccess_token.appid+'&secret='+codeToAccess_token.secret+'&code='+codeToAccess_token.code+'&grant_type=authorization_code';
	console.log('codeToAccess_token',codeToAccess_token,'accesstokenReq',accesstokenReq);

	request(accesstokenReq, function (error, response, body) {
  if (!error && response.statusCode == 200) {
		var access_tokenObj= JSON.parse(body);

		if(typeof(access_tokenObj.access_token)=='undefined'){
			console.log('获取access_token失败',access_tokenObj);
			var reply={};
			reply.result=false;
			reply.reason='获取access_token失败';
			return $util.jsonWrite(res,reply);
		}
		else{
			console.log('获取access_token成功',typeof(access_tokenObj),access_tokenObj.access_token,'access_token.openid',access_tokenObj.openid);
			var userinfoReq='https://api.weixin.qq.com/sns/userinfo?access_token='+access_tokenObj.access_token+'&openid='+access_tokenObj.openid;
			console.log('userinfoObj',userinfoReq);

			request(userinfoReq, function (error, response, body2) {
		  if (!error && response.statusCode == 200) {
				var userinfoObj= JSON.parse(body2);
				if(typeof(userinfoObj)=='undefined'){
					var reply={};
					reply.result=false;
					reply.reason='获取access_token失败';
					return $util.jsonWrite(res,reply);
				}
				//设置openid
				req.session.openid=userinfoObj.openid;
				req.session.unionid=userinfoObj.unionid;

				console.log('userinfoObj',userinfoObj,'req.session.unionid',req.session.unionid);
				return $util.jsonWrite(res,userinfoObj);
			}
			else {
				var reply={};
				reply.result=false;
				reply.reason='获取用户信息失败';
				return $util.jsonWrite(res,reply);
			}
			});
		}
  }
	else {
		var reply={};
		reply.result=false;
		reply.reason='获取access_token失败';
		return $util.jsonWrite(res,reply);
	}
	});
}

sql.WechatLogin = function(req,res) {
	var querysql = 'select * from user where unionid="'+req.query.unionid+'"';
	console.log(' WechatLogin querysql',querysql);
	csp.db.query(querysql,function(err,result){
		if(err)
		return;
		console.log(result,result.length);
		var userObj={};
		userObj.length=result.length;

		if(result.length===1){
			userObj=result[0];
			userObj.result=true;
			userObj.uid=userObj.uid;
			req.session.uid=userObj.uid;
		}
		else if(result.length>1){
			userObj.reason='该账户被多次绑定,请与系统管理员联系解决此问题';
			userObj.result=false;
		}else{
			req.session.regOpenid=req.query.openid;
			req.session.regUnionid=req.query.unionid;
			req.session.regWechatName=req.query.nickname;
			userObj.result=false;
			userObj.reason='没有找到指定的账户信息,未注册的微信号'+req.query.nickname+req.query.unionid;
		}

		return $util.jsonWrite(res,userObj);

	});

}

sql.getConLevel = function(req,res) {
	var querysql = 'select * from conlevel';
	console.log(' getConLevel querysql',querysql);
	csp.db.query(querysql,function(err,result){
		if(err){
			var obj={};
			obj.result=false;
			return $util.jsonWrite(res,obj);
		}

		console.log(result,result.length);
		return $util.jsonWrite(res,result);

	});

}

sql.getRiskLevel = function(req,res) {
	var querysql = 'select * from risklevel_info';
	console.log(' getConLevel querysql',querysql);
	csp.db.query(querysql,function(err,result){
		if(err){
			var obj={};
			obj.result=false;
			return $util.jsonWrite(res,obj);
		}

		console.log(result,result.length);
		return $util.jsonWrite(res,result);
	});

}

sql.checkAndLoginByCookie = function(req,res) {
	//判断登录名是用户名还是手机号
	var username = req.query.username;
	var reg = /^1[34578]\d{9}$/;
	var querySql1;
	var querySql2;
	if(reg.test(username)) {
		querySql1 = 'update `user` set last_logintm = now() where tel = "'+username+'" and pass = "'+req.query.password+'"';
		querySql2 = 'select uid , risklevel_code from `user` where tel = "'+username+'" and pass = "'+req.query.password+'"';
	}
	else {
		querySql1 = 'update `user` set last_logintm = now() where username = "'+username+'" and pass = "'+req.query.password+'"';
		querySql2 = 'select uid , risklevel_code from `user` where username = "'+username+'" and pass = "'+req.query.password+'"';
	}
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed","reason":"账号信息已过期"});
			res.end()
		}
		else {
			csp.db.query(querySql2,function(err2,result2) {
				if(err2) {
					res.send({"result":"failed","reason":"服务器出错了"});
					res.end()
				}
				else {
					if(result2.length > 0 && typeof(result2[0].uid) != "undefined" && typeof(result2[0].risklevel_code) != "undefined") {
						req.session.uid = result2[0].uid;
						var gr = false;
						if(result2[0].risklevel_code == 0) {
							gr = true;
						}
						res.send({"result":"succeed","gorisk":gr});
						res.send();
					}
					else {
						res.send({"result":"failed","reason":"服务器出错了"});
						res.end()
					}
				}
			})
		}
	})
}

module.exports = sql;
