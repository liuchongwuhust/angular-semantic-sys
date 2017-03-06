/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

var sql = {};

//引入moment，格式化当前时间
var moment = require('moment');

sql.wchatRegDB = function(req,res) {
	//先判断是否存在
	var phone = req.query.phone;
	var querySql = 'select * from user where tel ="'+phone+'"';
	csp.db.query(querySql,function(err,result){
  		if(err) {
  			res.send({'result':'failed'})
  			res.end();
  		}
  		else {
			var openid = "";
			var unionid = "";
			var wchatname = "";
			var last_logintm = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
			if(req.session.regOpenid && req.session.regUnionid && req.session.regWechatName) {
				openid = req.session.regOpenid;
				unionid = req.session.regUnionid;
				wchatname = req.session.regWechatName;
  				if(result.length === 0) {
	  				//现在注册
					var namequery = "SELECT fgetseed('user.username') as nameid";
					csp.db.query(namequery,function(nameerr,nameresult){
						if(nameerr) {
							res.send({'result':'failed','reason':'写入数据库失败'});
							res.end();
						}
						else {
							if(nameresult.length > 0 && nameresult[0] !== undefined) {
								var namestr = JSON.stringify(nameresult[0]);
								var namejson = JSON.parse(namestr);
								var username = 'u_'+namejson.nameid;
								var pass = phone.substring(phone.length - 6);
								var insertSql = "insert into user (uid,username,pass,tel,email,risklevel_code,openid,unionid,last_logintm,stat,tname,idnumber,conlevel,wechatname) values(uuid_short(),'"+username+"','"+pass+"','"+phone+"','',0,'"+openid+"','"+unionid+"','"+last_logintm+"','0','','',0,'"+wchatname+"')";
								csp.db.query(insertSql,function(inserterr,insertresult){
									if(inserterr) {
										res.send({'result':'failed','reason':'写入数据库失败'});
										res.end();
									}
									else {
										req.session.wchatregNew = true;
										res.send({'result':'succeed'});
										res.end();
									}
								})
							}
							else {
								res.send({'result':'failed','reason':'写入数据库失败'});
								res.end();
							}
						}
					})
	  			}
  				else {
	  				//更换微信号
					var updateSql = 'update user set openid = "'+openid+'", unionid = "'+ unionid+'",last_logintm = "'+last_logintm+'",wechatname = "'+wchatname+'" where tel = "'+phone+'"';
					csp.db.query(updateSql,function(updateerr,updateresult) {
						if(updateerr) {
							res.send({'result':'failed','reason':'写入数据库失败'});
							res.end();
						}
						else {
							req.session.wchatregNew = false;
							res.send({'result':'succeed'});
							res.end();
						}
					})
  				}
			}
			else {
				res.send({'result':'failed'});
				res.end();
			}
		}
    })
}

sql.wchatAutoLogin  = function(req,res) {
	var phone = req.session.wchatregphone;
	var querySql = 'select uid from user where tel = "'+phone+'"';
	if(req.session.wchatregphone !== undefined) {
		delete req.session.wchatregphone;
	}
	if(req.session.wchatRegCheckCode !== undefined ) {
		delete req.session.wchatRegCheckCode;
	}
	if(req.session.wchatRegCode !== undefined ) {
		delete req.session.wchatRegCode;
	}
	if(req.session.wchatRegNew !== undefined) {
		delete req.session.wchatRegNew;
	}
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({'result':'failed'});
			res.end();
		}
		else {
			if(result.length > 0 && result[0] && result[0].uid) {
				req.session.uid = result[0].uid;
				res.send({'result':'succeed'});
				res.end();
			}
			else {
				res.send({'result':'failed'});
				res.end();
			}
		}
	})
}
module.exports = sql;
