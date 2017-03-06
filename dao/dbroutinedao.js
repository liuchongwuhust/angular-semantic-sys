/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */
var async = require("async");
var sql = {};

sql._getNewSqlParamEntity = function(sql, callback) {
	if (callback) {
        return callback(null, {
            "sql": sql
        });
    }
    return {
        "sql": sql
    };
}

sql.execTrans = function(sqlparamsEntities,callback) {
	csp.db.beginTransaction(function(err) {
		if(err) {
			callback(err,null);
		}
		else {
			var funcAry = [];
			sqlparamsEntities.forEach(function (sql_param) {
                var temp = function (cb) {
                    var sql = sql_param.sql;
                    csp.db.query(sql,function (tErr, rows, fields) {
                        if (tErr) {
                            csp.db.rollback(function () {
														return cb(tErr,null);
                            });
                        } else {
                            return cb(null, 'ok');
                        }
                    })
                };
                funcAry.push(temp);
            });
			async.series(funcAry, function (err, result) {
                if (err) {
                    csp.db.rollback(function (err1) {
                        return callback(err, null);
                    });
                } else {
                    csp.db.commit(function (err2, info) {
                        if (err2) {
                            csp.db.rollback(function (err3) {
                                return callback(err2, null);
                            });
                        } else {
                            return callback(null, info);
                        }
                    })
                }
            })
		}
	})
}

//另一种的事务处理
sql.executeSqlTrans=function(sqlArray,callbackAll){
	var tasks=[];
	console.log(sqlArray);

	var first= function(callback){
	      // 开启事务
	     	csp.db.beginTransaction(function(err) {
	        callback(err);
	      });
	    }
	tasks.push(first);

	sqlArray.forEach(function(sqlQuery){
		var temp=function(callback){
			console.log(sqlQuery);
			csp.db.query(sqlQuery,function (err, info1) {
				callback(err);
			});
		}
		tasks.push(temp);
	});

	var last=function(callback){
		csp.db.commit(function(err){
			callback(err);
		});
	}
	tasks.push(last);


	async.series(tasks,function(err,result) {
		if(err) {
			csp.db.rollback();
			// res.send({"result":false,'reason':'写数据库失败!'});
			// res.end();
			console.log('写数据库失败!');
			callbackAll(err,result);
		}
		else {

			// res.send({"result":true});
			// res.end();
			console.log('写数据库成功!');
			callbackAll(err,result);
		}
	});
}

module.exports =  sql;
