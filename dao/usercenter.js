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

sql.getUserInfo = function(req,res) {
		var tempid =req.session.uid;
		var querySql = 'select * from user where uid ="'+tempid+'"';
		console.log("querySql",querySql);
	  csp.db.query(querySql,function(err,result){
			if(err){
				return;
			}
			// console.log("res.tel",result[0].tel)
			console.log(result,result.length,typeof result);

			for(var i=0;i<result.length;i++)
				delete result[i].pass;

			if(result.length===1){
				result.result=true;
			}
			else {
				result.result=false;
				result.reason='没有找到指定的账户信息';
			}
			return $util.jsonWrite(res,result[0]);
	  });
};

sql.setUserInfo = function(req,res) {
	// pool.getConnection(function(err, connection)
	// {
		var tempid =req.session.uid;
		var querySql='update user set tel="'+req.query.tel+'",email="'+req.query.email+'",tname="'+req.query.tname+'",idnumber="'+req.query.idnumber+'" where uid="'+tempid+'"';
		console.log(querySql);
		csp.db.query(querySql,function(err,result){
			if(err){
				return;
			}

			if(result.affectedRows===1){
				querySql = 'select * from user where uid ="'+tempid+'"';
				console.log(querySql);
			  csp.db.query(querySql,function(err,result){
					console.log(result,result.length);
					if(err){
						return;
					}
					for(var i=0;i<result.length;i++)
						delete result[i].pass;

					if(result.length===1)
						result.result=true;
						else {
							result.result=false;
							result.reason='没有找到指定的账户';
						}
					// connection.release();
					return $util.jsonWrite(res,result);

			  });
			}else {
				// connection.release();
				return $util.jsonWrite(res,{'result':false,'reason':'更新信息失败'});
			}
			console.log("result.affectedRows",result.affectedRows);
		});

	// });
};

sql.setPassword = function(req,res)
{
		var querySql = 'select uid from user where uid ="'+req.session.uid+'" and pass="'+req.query.oldPassword+'"';
		console.log(querySql);
	  csp.db.query(querySql,function(err,result)
		{
				if(err)
				{
					console.log("select error");
					return;
				}
				if(result.length===1)
				{
					querySql = 'update user set pass="'+req.query.firstNewPassword+'" where uid ="'+req.session.uid+'"';
					console.log(querySql);
					csp.db.query(querySql,function(err,result)
					{
						if(err)
						{
							console.log("update error");
							return ;
						}
						if(result.affectedRows===1)
							result.result=true;
						else
						{
							result.result=false;
							result.reason='update failed';
						}
						return $util.jsonWrite(res,result);
					});
				}
				else
				{
					return $util.jsonWrite(res,{'result':false,'reason':'密码不正确'});
				}

	  });

};


sql.setWeChatAccount = function(req,res) {
	var querySql='select uid from user where unionid="'+req.query.unionid+'"';
	csp.db.query(querySql,function(err,result){
			if(err){
				console.log("select error");
				return $util.jsonWrite(res,{'result':false,'reason':'检查当前微信是否已绑定失败'});
			}
			console.log('setWeChatAccount',querySql,result);
			if(result.length==1){
				if (result[0].uid!=req.query.uid) {
					return $util.jsonWrite(res,{'result':false,'reason':'当前微信已绑定,请使用其他微信重试'});
				}else{
					return $util.jsonWrite(res,{'result':false,'reason':'不允许绑定相同的微信号'});
				}
			}else if (result.length>1) {
				return $util.jsonWrite(res,{'result':false,'reason':' 该账户被多次绑定,请与系统管理员联系解决此问题'});
			}

			querySql='update user set openid="'+req.query.openid+'",unionid="'+req.query.unionid+'",wechatname="'+req.query.nickname+'" where uid="'+req.query.uid+'"';
			console.log(querySql);
			csp.db.query(querySql,function(err,result){
					if(err){
						console.log("update error");
						return $util.jsonWrite(res,{'result':false});
					}
					return $util.jsonWrite(res,{'result':true});
				});

		});


}

sql.setEmail = function(req,res) {

	var querySql='update user set email="'+req.query.newEmail+'" where uid="'+req.session.uid+'"';
	console.log(querySql);
	csp.db.query(querySql,function(err,result){
			if(err){
				console.log("update error");
				return;
			}
		});
	return $util.jsonWrite(res,{'result':true});
}

sql.setPhone = function(req,res) {
		var querySql='update user set tel="'+req.query.newPhoneNumber+'" where uid="'+req.session.uid+'"';
		console.log(querySql);
		csp.db.query(querySql,function(err,result){
				if(err){
					console.log("update error");
					return;
				}
			});
		return $util.jsonWrite(res,{'result':true});
}

module.exports = sql;
