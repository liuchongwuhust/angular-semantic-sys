/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

// var mysql = require('mysql');
// var $conf = require('../config/config.default.json');
var $util = require('../util/util.js');
//
// var pool = mysql.createPool($util.extend({}, $conf.db));

//引入moment，格式化当前时间
var moment = require('moment');

var sql = {};
sql.checkPhone = function(req,res) {
	// pool.getConnection(function(err, connection){
		var phone = req.query.phone;
		var querySql = 'select * from user where tel ="'+phone+'"';

	  csp.db.query(querySql,function(err,result){
		console.log(result,result.length);
		if(result.length === 0 ) {
			// connection.release();
			return $util.jsonWrite(res,{'result':'succeed'});
		}
		else {
			// connection.release();245
			return $util.jsonWrite(res,{'result':'failed','reason':'账号已被注册'});
		}
	  })
	// })
};
sql.toRegister = function(req,res) {
	// pool.getConnection(function(err, connection){
		var namequery = "SELECT fgetseed('user.username') as nameid";
		csp.db.query(namequery,function(err,nameresult){
			console.log(err,nameresult);
			if(err) {
				return $util.jsonWrite(res,{'result':'failed','reason':'写入数据库失败'});
			}
			else {
				if(nameresult.length > 0 && nameresult[0] !== undefined) {
					var namestr = JSON.stringify(nameresult[0]);
					var namejson = JSON.parse(namestr);
					var tel = req.query.phone;
					var username = 'u_'+namejson.nameid;
					var pass = tel.substring(tel.length - 6);
					var stat = '0';
					var openid = "";
					var unionid = "";
					var regWechatName = "";
					if(req.session.regOpenid) {
						openid = req.session.regOpenid;
					}
					if(req.session.regUnionid) {
						unionid = req.session.regUnionid;
					}
					if(req.session.regWechatName) {
						regWechatName = req.session.regWechatName;
					}
					var querySql = "insert into user (uid,username,pass,tel,email,risklevel_code,openid,unionid,last_logintm,stat,tname,idnumber,conlevel,wechatname,reg_date) values(uuid_short(),'"+username+"','"+pass+"','"+tel+"','',0,'"+openid+"','"+unionid+"',now(),'"+stat+"','','',0,'"+regWechatName+"',date(now()))";
					console.log(querySql);
					csp.db.query(querySql,function(err,result){
						console.log(err,result);
						if(err) {
							return $util.jsonWrite(res,{'result':'failed','reason':'写入数据库失败'});
						}
						else {
							return $util.jsonWrite(res,{'result':'succeed'});
						}
					})
				}
				else {
					return $util.jsonWrite(res,{'result':'failed','reason':'写入数据库失败'});
				}
			}
		})

	// })
};
sql.changeLoginState = function(req,res) {
	var querysql = 'select uid from user where tel = "'+req.session.phone+'"';
	csp.db.query(querysql,function(error,result) {
		if(result.length > 0 && result[0] !== undefined) {
			req.session.uid = result[0].uid;
			delete req.session.phone;
		    delete req.session.regCheckCode;
		    if(req.session.regWechat) {
		        delete req.session.regWechat;
		    }
			res.send({'result':'succeed'});
			res.end();
		}
		else {
			delete req.session.phone;
		    delete req.session.regCheckCode;
		    if(req.session.regWechat) {
		        delete req.session.regWechat;
		    }
			res.send({'result':'failed'});
			res.end();
		}
	})
}
module.exports = sql;
