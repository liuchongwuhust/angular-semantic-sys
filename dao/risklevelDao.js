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

// var pool = mysql.createPool($util.extend({}, $conf.db));

var sql = {};

sql.getphone = function(req,res) {
	// pool.getConnection(function(err, connection){
		var querysql = 'select tel , ifnull(tname,"") as name, ifnull(idnumber,"") as number from user where uid = "'+req.session.uid+'"';
		console.log(querysql);
		csp.db.query(querysql,function(err,result){
			if(err) {
				res.send({'result':'failed'});
				res.end();
			}
			else {
				if(result.length > 0 && result[0] !== undefined) {
					res.send({'result':'succeed','data':result[0]});
					res.end();
				}
				else {
					res.send({'result':'failed'});
					res.end();
				}
			}
		})
	// })
};

sql.riskcommit = function(req,res) {
	// pool.getConnection(function(err, connection){
		var info = req.query;
		if(req.session.uid) {
			var idsql = 'select uid from user where tel = "' + info.phone +'"';
			csp.db.query(idsql,function(err,idresult){
				if(idresult.length > 0 && idresult[0] != undefined) {
					if(idresult[0].uid === req.session.uid) {
						//写入开始写数据库
						var updateuser = 'update user set risklevel_code = '+info.riskcode+', tname = "'+info.name+'",idnumber = "'+info.idnumber+'" where tel = "'+info.phone+'"';
						csp.db.query(updateuser,function(usererr,userresult) {
							if(usererr) {
								res.send({'result':'failed'});
								res.end();
							}
							else {
								res.send({'result':'succeed'});
								res.end();
							}
						})
					}
				}
			})
		}
		else {
			var loginsql = 'select uid from user where tel = "' + info.phone +'"';
			csp.db.query(loginsql,function(loginerr,loginresult){
				if(loginresult.length > 0 && loginresult[0] !== undefined) {
					req.session.uid = loginresult[0].uid;
					var updateuser1 = 'update user set risklevel_code = '+info.riskcode+', tname = "'+info.name+'",idnumber = "'+info.idnumber+'" where tel = "'+info.phone+'"';
					csp.db.query(updateuser1,function(usererr1,userresult1) {
						if(usererr1) {
							res.send({'result':'failed'});
							res.end();
						}
						else {
							res.send({'result':'succeed'});
							res.end();
						}
					})
				}
			})
		}
	// })
};

module.exports = sql;
