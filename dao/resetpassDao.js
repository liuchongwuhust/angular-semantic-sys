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

sql.checkPhone = function(req,res) {
	// pool.getConnection(function(err, connection){
		var phone = req.query.phone;
    	var querySql = 'select * from user where tel ="'+phone+'"';

	    csp.db.query(querySql,function(err,result){
		    console.log(result,result.length);
			if(result.length === 0 ) {
				// connection.release();
				return $util.jsonWrite(res,{'result':'failed','reason':'账号不存在'});
			}
			else {
				// connection.release();
				return $util.jsonWrite(res,{'result':'succeed'});
			}
	    })
	// })
};
sql.toUpdateUser = function(req,res) {
	// pool.getConnection(function(err,connection){
		var phone = req.query.phone;
		var pass = req.query.pass;
		var querySql = 'update user set pass = "' + pass + '" where tel = "'+phone+'"';
		csp.db.query(querySql,function(err,result) {
			if(err) {
				return $util.jsonWrite(res,{'result':'failed'});
			}
			else {
				return $util.jsonWrite(res,{'result':'succeed'});
			}
		})
	// })
};

module.exports = sql;
