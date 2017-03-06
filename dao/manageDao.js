/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

//引入moment，格式化当前时间
var moment = require('moment');
var m_async = require('async');
var fs = require('fs');
var dbHelper = require('../dao/dbroutinedao');
var sql = {};

sql.addProduct = function(req,res) {
	var info = req.query;
	var uid = req.session.uid;
	//这里先存文件
	var querySql1 = 'select fgetseed("html") as seed';
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			var path = "editfiles/productdes_" + result1[0].seed + ".html";
			fs.writeFile("./app/" + path,info.contentshtml,function(ferr) {
				if(ferr) {
					res.send({"result":"failed"});
					res.end();
				}
				else {
					var querySql = "insert into product (caption,contents,piclink,releasetime,uid,tsid,fundmanager,prostatus,seriesid,risklevelid,blackout_period,subscribe_point,subscribe_rate,manage_rate,redeem_rate,merit_pay) values ";
					querySql += "('"+info.caption+"','"+path+"','"+info.piclink+"',date(now()),'"+uid+"','"+info.tsid+"','"+info.fundmanager+"','"+info.prostatus+"',"+info.seriesid+","+info.risklevelid+",'"+info.blackout_period+"',"+info.subscribe_point+","+info.subscribe_rate + "/100,";
					querySql += info.manage_rate + "/100,"+info.redeem_rate+"/100,"+info.merit_pay+"/100)";
					var routine = [];
					routine.push(dbHelper._getNewSqlParamEntity(querySql));
					if(info.toaddhome == 1) {
						var querySql1 = 'insert into product_layout (protype,proid,priority) values (1,'+result.insertId+','+info.priority+')  ON DUPLICATE KEY UPDATE proid = ' + result.insertId;
						routine.push(dbHelper._getNewSqlParamEntity(querySql1));
					}
					dbHelper.execTrans(routine,function(err,result) {
						if(err) {
							fs.unlinkSync("./app/"+ path);
							res.send({"result":"failed","reason":"服务器出错了"});
							res.end();
						}
						else {
							res.send({"result":"succeed"});
							res.end();
						}
					})
				}
			})
		}
	})
}
sql.updateProduct = function(req,res) {
	var info = req.query;
	var querySql = "";
	//写文件
	fs.writeFile("./app/"+info.contents,info.contentshtml,function(err) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			querySql += "update product set caption = '"+info.caption+"',contents = '"+info.contents+"'";
			querySql += ",piclink = '"+info.piclink+"',tsid = '"+info.tsid+"',fundmanager = '"+info.fundmanager+"'";
			querySql += ",prostatus = '"+info.prostatus+"', seriesid = "+info.seriesid+" ,risklevelid = "+info.risklevelid+",blackout_period = '" + info.blackout_period+"'";
			querySql += ",subscribe_point = "+info.subscribe_point+", subscribe_rate = "+info.subscribe_rate+"/100 ,manage_rate = "+info.manage_rate
			querySql += "/100, redeem_rate = "+info.redeem_rate+"/100, merit_pay = "+ info.merit_pay+"/100 where id = " + info.id;
			var routine = [];
			routine.push(dbHelper._getNewSqlParamEntity(querySql));
			var querySql1 = "";
			if(info.toaddhome == 1) {
				querySql1 = 'insert into product_layout (protype,proid,priority) values (1,'+info.id+','+info.priority+')  ON DUPLICATE KEY UPDATE proid = ' + info.id;
				routine.push(dbHelper._getNewSqlParamEntity(querySql1));
			}
			if(info.toaddhome == 2) {
				querySql1 = 'delete from product_layout where protype = 1 and priority =' + info.priority;
				routine.push(dbHelper._getNewSqlParamEntity(querySql1));
			}
			dbHelper.execTrans(routine,function(err,result) {
				if(err) {
					res.send({"result":"failed","reason":"产品说明文件已更新，但其余数据更新失败"});
					res.end();
				}
				else {
					res.send({"result":"succeed"});
					res.end();
				}
			})
		}
	})
}
sql.addTactics = function(req,res) {
	var name = req.query.tacticsName;
	var des = req.query.tacticsDes;
	var querySql = "insert into tactics (tsname,tsdesc) values ('"+name+"','"+des+"')";
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})

}
sql.getAllTactics = function(req,res) {
	if(typeof(req.query.page) == "undefined") {
		var querySql2 = 'select tsid,tsname,tsdesc from tactics';
		csp.db.query(querySql2,function(err2,result2) {
			if(err2) {
				res.send({"result":"failed"});
				res.end();
			}
			else {
				res.send({"result":"succeed",'data':result2});
				res.end();
			}
		})
	}
	else {
		var page = req.query.page;
	    var pageCount = req.query.pageCount;
	    var start = (page - 1) * pageCount;
		var querySql1 = 'select COUNT(tsid) as totalcount from tactics';
		var querySql = 'select tsid,tsname,tsdesc from tactics limit ' + start + ',' + pageCount;
		csp.db.query(querySql1,function(err1,result1){
			if(err1) {
				res.send({"result":"failed"});
				res.end();
			}
			else  {
				csp.db.query(querySql,function(err,result){
					if(err) {
						res.send({"result":"failed"});
						res.end();
					}
					else  {
						res.send({"result":"succeed",'data':result,'count':result1[0].totalcount});
						res.end();
					}
				})
			}
		})
	}
}
sql.deleteTactics = function(req,res) {
	var tsid = req.query.tsid;
	var querySql = 'delete from tactics where tsid = '+ tsid ;
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.updateTactics = function(req,res) {
	var tsname = req.query.tsname;
	var tsdesc = req.query.tsdesc;
	var tsid = req.query.tsid;
	var querySql = "update tactics set tsname = '"+tsname+"', tsdesc = '"+tsdesc+"' where tsid = " +tsid;
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.getAllProduct = function(req,res) {
	var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;
	var querySql2 = 'select COUNT(id) as totalcount from product ';
	var querySql = 'select t1.id,t1.piclink,t1.caption,t1.contents,ifnull(t1.tsid,"") as tacticsList,DATE_FORMAT(t1.releasetime,"%Y-%m-%d") as time,t1.fundmanager,t1.prostatus, IFNULL(t3.priority,0) as priority , IFNULL(t4.id,-1) as serid, IFNULL(t4.name,"-") as sername from product t1 left join product_layout t3 on t3.protype = 1 and t3.proid = t1.id left join product_series t4 on t4.id = t1.seriesid limit ' + start + ',' + pageCount;
	var querySql1 = 'select tsid,tsname from tactics';
	csp.db.query(querySql2,function(err2,result2){
		if(err2) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			csp.db.query(querySql,function(err,result){
				if(err) {
					res.send({"result":"failed"});
					res.end();
				}
				else  {
					csp.db.query(querySql1,function(err1,result1) {
						if(err1) {
							res.send({"result":"failed"});
							res.end();
						}
						else {
							res.send({"result":"succeed","data_product":result,"data_tactics":result1,'count':result2[0].totalcount});
							res.end();
						}
					})
				}
			})
		}
	})
}
sql.getNetByProductId = function(req,res) {
	var proid = req.query.proid;
	var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;
	var querySql1 = 'select COUNT(ID) as totalcount from netproduct where proid = ' + proid;
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			var querySql = 'select ID, net,totalnet,accrate,yearrate,DATE_FORMAT(date,"%Y-%m-%d") as time from netproduct where proid = '+proid+' order by date desc limit ' + start + ',' + pageCount;
			csp.db.query(querySql,function(err,result){
				if(err) {
					res.send({"result":"failed"});
					res.end();
				}
				else  {
					res.send({"result":"succeed","data":result,'count':result1[0].totalcount});
					res.end();
				}
			})
		}
	})
}
sql.deleteProduct = function( req,res) {
	var proid = req.query.id;
	var path = "./app/" + req.query.contents;
	var routine = [];
	var querySql1 = 'delete from product where id = '+proid;
	routine.push(dbHelper._getNewSqlParamEntity(querySql1));
	var querySql2 = 'delete from netproduct where proid = '+proid;
	routine.push(dbHelper._getNewSqlParamEntity(querySql2));
	var querySql3 = ' delete from product_layout where proid =' + proid + ' and protype = 1';
	routine.push(dbHelper._getNewSqlParamEntity(querySql3));
	var querySql4 = ' delete from product_notice where proid =' + proid + ' and protype = 1';
	routine.push(dbHelper._getNewSqlParamEntity(querySql4));
	var querySql5 = ' delete from spot where proid =' + proid + ' and protype = 1';
	routine.push(dbHelper._getNewSqlParamEntity(querySql5));
	dbHelper.execTrans(routine,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			fs.unlinkSync(path);
			res.send({"result":"succeed"})
			res.end();
		}
	})
}

sql.renameImage = function(req,res) {
    var querySql = 'select fgetseed("img") as seed';
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed"});
            res.end();
		}
		else {
			if(result.length > 0 && typeof(result[0].seed) !== "undefined") {
				var uploadedPath = req.query.uploadedPath;
                var filekindarr = uploadedPath.split(".");
                var kind = filekindarr[filekindarr.length -1];
                var dstPath = './app/files/img_' + result[0].seed+"."+kind;
                var retPath = "img_"+result[0].seed+"."+kind;
                //重命名为真实文件名
                fs.rename(uploadedPath, dstPath, function(err){
                    if(err) {
                        res.send({"result":"failed"});
                        res.end();
                    }
                    else {
                        res.send({"result":"succeed","piclink":"files/" + retPath});
                        res.end();
                    }
                })
			}
			else {
                res.send({"result":"failed"});
                res.end();
			}
		}
	})
}
sql.addSingleNet = function(req,res) {
	var info = req.query;
	var querySql = 'insert into netproduct (date,proid,net,totalnet,accrate,yearrate) values("'+info.date+'",'+info.proid+','+info.net+','+info.totalnet+','+info.accrate+','+info.yearrate+')';
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed","data":result});
			res.end();
		}
	})
}
sql.updateSingleNet = function(req,res) {
	var info = req.query;
	var querySql = 'update netproduct set net = '+info.net+', totalnet = '+info.totalnet+',accrate = '+info.accrate+',yearrate = '+info.yearrate+' where ID ='+info.ID;
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed","data":result});
			res.end();
		}
	})
}
sql.deleteSingleNet = function(req,res) {
	var info = req.query;
	var querySql = 'delete from netproduct where ID = '+info.ID;
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed","data":result});
			res.end();
		}
	})
}
sql.importInsertToDb = function(req,res) {
	var info = req.query;
	var querySql = 'insert into netproduct (date,proid,net,totalnet,accrate,yearrate) values ';
	if(info.count === '1') {
		var json1 = JSON.parse(info.nets);
		var con1 = '("'+json1.date+'",'+info.proid+','+json1.net+','+json1.totalnet+','+json1.accrate+','+json1.yearrate+')';
		querySql += con1;
	}
	else {
		for(var i = 0; i < info.nets.length; i ++) {
			var json = {};
			json = JSON.parse(info.nets[i]);
			var con = "";
			if(i !== info.nets.length -1) {
				con = '("'+json.date+'",'+info.proid+','+json.net+','+json.totalnet+','+json.accrate+','+json.yearrate+'),';
			}
			else {
				con = '("'+json.date+'",'+info.proid+','+json.net+','+json.totalnet+','+json.accrate+','+json.yearrate+')';
			}
			querySql += con;
		}
	}
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.getCheckUser = function(req,res) {
	var querySql1 = 'select conlevel from user where uid = "'+req.session.uid+'"';
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			if(result1[0].conlevel == 2) {
				var querySql2 = 'select t1.uid,t1.tel,t1.tname,DATE_FORMAT(t1.reg_date,"%Y-%m-%d") as regDate,t1.idnumber,t1.au_stat,t1.conlevel,t1.risklevel_code,t2.name as member_level, ifnull(t3.risklevel_name,"") as risklevel from user t1 LEFT JOIN conlevel t2 ON t1.conlevel = t2.id LEFT JOIN risklevel_info t3 ON t1.risklevel_code = t3.risklevel_code where t1.au_stat = 0 and t1.conlevel != 2'
				csp.db.query(querySql2,function(err2,result2){
					if(err2) {
						res.send({"result":"failed"});
						res.end();
					}
					else  {
						res.send({"result":"succeed","data":result2});
						res.end();
					}
				})
			}
			else {
				var querySql3 = 'select t1.uid,t1.tel,t1.tname,DATE_FORMAT(t1.reg_date,"%Y-%m-%d") as regDate,t1.idnumber,t1.au_stat,t1.conlevel,t1.risklevel_code,t2.name as member_level, ifnull(t3.risklevel_name,"") as risklevel from user t1 LEFT JOIN conlevel t2 ON t1.conlevel = t2.id LEFT JOIN risklevel_info t3 ON t1.risklevel_code = t3.risklevel_code where t1.au_stat = 0 and t1.conlevel != 1 and t1.conlevel != 2';
				csp.db.query(querySql3,function(err3,result3){
					if(err3) {
						res.send({"result":"failed"});
						res.end();
					}
					else  {
						res.send({"result":"succeed","data":result3});
						res.end();
					}
				})
			}
		}
	})
}
sql.getAllUser = function(req,res) {
	var kind = req.query.kind;
	var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;
	var querySql1 = 'select conlevel from user where uid = "'+req.session.uid+'"';
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			if(result1[0].conlevel == 2) {
				if(kind == "1") {
					var querySql211  = 'select COUNT(uid) as totalcount from user where au_stat = 0 and conlevel != 2';
					csp.db.query(querySql211,function(err211,result211) {
						if(err211) {
							res.send({"result":"failed"});
							res.end();
						}
						else {
							var querySql212 = 'select t1.uid,t1.tel,t1.tname,DATE_FORMAT(t1.reg_date,"%Y-%m-%d") as regDate,t1.idnumber,t1.au_stat,t1.conlevel,t1.risklevel_code,t2.name as member_level, ifnull(t3.risklevel_name,"") as risklevel from user t1 LEFT JOIN conlevel t2 ON t1.conlevel = t2.id LEFT JOIN risklevel_info t3 ON t1.risklevel_code = t3.risklevel_code  where t1.au_stat = 0 and t1.conlevel != 2 order by t1.au_stat asc limit ' + start + ',' + pageCount;
							csp.db.query(querySql212,function(err212,result212){
								if(err212) {
									res.send({"result":"failed"});
									res.end();
								}
								else  {
									res.send({"result":"succeed","data":result212,'count':result211[0].totalcount});
									res.end();
								}
							})
						}
					})
				}
				else {
					var querySql221  = 'select COUNT(uid) as totalcount from user where conlevel != 2';
					csp.db.query(querySql221,function(err221,result221) {
						if(err221) {
							res.send({"result":"failed"});
							res.end();
						}
						else {
							var querySql222 = 'select t1.uid,t1.tel,t1.tname,DATE_FORMAT(t1.reg_date,"%Y-%m-%d") as regDate,t1.idnumber,t1.au_stat,t1.conlevel,t1.risklevel_code,t2.name as member_level, ifnull(t3.risklevel_name,"") as risklevel from user t1 LEFT JOIN conlevel t2 ON t1.conlevel = t2.id LEFT JOIN risklevel_info t3 ON t1.risklevel_code = t3.risklevel_code  where t1.conlevel != 2 order by t1.au_stat asc limit ' + start + ',' + pageCount;
							csp.db.query(querySql222,function(err222,result222){
								if(err222) {
									res.send({"result":"failed"});
									res.end();
								}
								else  {
									res.send({"result":"succeed","data":result222,'count':result221[0].totalcount});
									res.end();
								}
							})
						}
					})
				}
			}
			else {
				if(kind == "1") {
					var querySql311 = 'select COUNT(uid) as totalcount from user where au_stat = 0 and conlevel != 2 and conlevel != 1';
					csp.db.query(querySql311,function(err311,result311) {
						if(err311) {
							res.send({"result":"failed"});
							res.end();
						}
						else {
							var querySql312 = 'select t1.uid,t1.tel,t1.tname,DATE_FORMAT(t1.reg_date,"%Y-%m-%d") as regDate,t1.idnumber,t1.au_stat,t1.conlevel,t1.risklevel_code,t2.name as member_level, ifnull(t3.risklevel_name,"") as risklevel from user t1 LEFT JOIN conlevel t2 ON t1.conlevel = t2.id LEFT JOIN risklevel_info t3 ON t1.risklevel_code = t3.risklevel_code where t1.conlevel != 2 and t1.conlevel != 1 and t1.au_stat = 0  order by t1.au_stat asc limit ' + start + ',' + pageCount;
							csp.db.query(querySql312,function(err312,result312){
								if(err312) {
									res.send({"result":"failed"});
									res.end();
								}
								else  {
									res.send({"result":"succeed","data":result312,'count':result311[0].totalcount});
									res.end();
								}
							})
						}
					})
				}
				else {
					var querySql321 = 'select COUNT(uid) as totalcount from user where conlevel != 2 and conlevel != 1';
					csp.db.query(querySql321,function(err321,result321) {
						if(err321) {
							res.send({"result":"failed"});
							res.end();
						}
						else {
							var querySql322 = 'select t1.uid,t1.tel,t1.tname,DATE_FORMAT(t1.reg_date,"%Y-%m-%d") as regDate,t1.idnumber,t1.au_stat,t1.conlevel,t1.risklevel_code,t2.name as member_level, ifnull(t3.risklevel_name,"") as risklevel from user t1 LEFT JOIN conlevel t2 ON t1.conlevel = t2.id LEFT JOIN risklevel_info t3 ON t1.risklevel_code = t3.risklevel_code where t1.conlevel != 2 and t1.conlevel != 1 order by t1.au_stat asc limit ' + start + ',' + pageCount;
							csp.db.query(querySql322,function(err322,result322){
								if(err322) {
									res.send({"result":"failed"});
									res.end();
								}
								else  {
									res.send({"result":"succeed","data":result322,'count':result321[0].totalcount});
									res.end();
								}
							})
						}
					})
				}
			}
		}
	})
}
sql.getMemberLevel = function(req,res) {
	var querySql1 = 'select conlevel from user where uid = "'+req.session.uid+'"';
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			if(result1[0].conlevel == 2 ) {
				var querySql2 = 'select id,name from conlevel where id != 2';
				csp.db.query(querySql2,function(err2,result2){
					if(err2) {
						res.send({"result":"failed"});
						res.end();
					}
					else  {
						res.send({"result":"succeed","data":result2});
						res.end();
					}
				})
			}
			else {
				var querySql3 = 'select id,name from conlevel where id != 2 and id != 1';
				csp.db.query(querySql3,function(err3,result3){
					if(err3) {
						res.send({"result":"failed"});
						res.end();
					}
					else  {
						res.send({"result":"succeed","data":result3});
						res.end();
					}
				})
			}
		}
	})

}
sql.changeUserLevel = function(req,res) {
	var querySql = 'update user set conlevel = ' + req.query.conlevel + ' where uid = "'+req.query.uid+'"';
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.changeUserCheckState = function(req,res) {
	var querySql = 'update user set au_stat = 1  where uid = "'+req.query.uid+'"';
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.checkNetExist = function(req,res) {
	var querySql = 'select ID from netproduct where proid = '+ req.query.proid+' and date = "'+req.query.date+'"';
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			if(result.length !== 0) {
				res.send({"result":"succeed","exist":true});
			}
			else {
				res.send({"result":"succeed","exist":false});
			}
			res.end();
		}
	})
}
sql.multipleDeleteNets = function(req,res) {
	var info = req.query;
	var querySql;
	if(info.count == 1) {
		querySql = 'delete from netproduct where ID = ' + info.data;
	}
	else {
		querySql = ' delete from netproduct where ID in (';
		for(var i = 0 ; i < info.count; i++) {
			if (i == 0) {
				querySql += info.data[i];
			}
			else {
				querySql += "," + info.data[i] ;
			}
		}
		querySql += ")";
	}
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}

//模拟产品
sql.addanalogProduct = function(req,res) {
	var info = req.query;
	var uid = req.session.uid;
	//这里先存文件
	var querySql1 = 'select fgetseed("html") as seed';
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			var path = "editfiles/analogProductdes_" + result1[0].seed + ".html";
			fs.writeFile("./app/" + path,info.contentshtml,function(ferr) {
				if(ferr) {
					res.send({"result":"failed"});
					res.end();
				}
				else {
					var querySql = "";
					querySql += "insert into product_2 (caption,contents,piclink,releasetime,uid,tsid";
					querySql += ",fundmanager,prostatus,seriesid,risklevelid,blackout_period,subscribe_point";
					querySql += ",subscribe_rate,manage_rate,redeem_rate,merit_pay) values ";
					querySql += " ('"+info.caption+"','"+path+"','"+info.piclink+"',date(now()),'"+uid+"'";
					querySql += ",'"+info.tsid+"','"+info.fundmanager+"','"+info.prostatus+"',"+info.seriesid;
					querySql += ","+info.risklevelid+",'"+info.blackout_period+"',"+info.subscribe_point;
					querySql += ","+info.subscribe_rate+"/100,"+info.manage_rate+"/100,"+info.redeem_rate+"/100,"+info.merit_pay+"/100)";
					var routine = [];
					routine.push(dbHelper._getNewSqlParamEntity(querySql));
					if(info.toaddhome == 1) {
						var querySql1 = 'insert into product_layout (protype,proid,priority) values (2,'+result.insertId+','+info.priority+')  ON DUPLICATE KEY UPDATE proid = ' + result.insertId;
						routine.push(dbHelper._getNewSqlParamEntity(querySql1));
					}
					dbHelper.execTrans(routine,function(err,result) {
						if(err) {
							fs.unlinkSync("./app/"+ path);
							res.send({"result":"failed","reason":"服务器出错了"});
							res.end();
						}
						else {
							res.send({"result":"succeed"});
							res.end();
						}
					})
				}
			})
		}
	})
}
sql.updateanalogProduct = function(req,res) {
	var info = req.query;
	var querySql = "";
	fs.writeFile("./app/"+info.contents,info.contentshtml,function(err) {
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			querySql += "update product_2 set caption = '"+info.caption+"',contents = '"+info.contents;
			querySql += "',piclink = '"+info.piclink+"',tsid = '"+info.tsid+"',fundmanager = '"+info.fundmanager;
			querySql += "',prostatus = '"+info.prostatus+"' , seriesid = "+info.seriesid+",risklevelid = "+info.risklevelid;
			querySql += ", blackout_period = '"+info.blackout_period+"',subscribe_point = "+info.subscribe_point;
			querySql += ",subscribe_rate = "+info.subscribe_rate+"/100, manage_rate = "+info.manage_rate;
			querySql +="/100,redeem_rate = "+info.redeem_rate+"/100, merit_pay = "+info.merit_pay+"/100 where id = " + info.id;
			var routine = [];
			routine.push(dbHelper._getNewSqlParamEntity(querySql));
			var querySql1 = "";
			if(info.toaddhome == 1) {
				querySql1 = 'insert into product_layout (protype,proid,priority) values (2,'+info.id+','+info.priority+')  ON DUPLICATE KEY UPDATE proid = ' + info.id;
				routine.push(dbHelper._getNewSqlParamEntity(querySql1));
			}
			if(info.toaddhome == 2) {
				querySql1 = 'delete from product_layout where protype = 2 and priority =' + info.priority;
				routine.push(dbHelper._getNewSqlParamEntity(querySql1));
			}
			dbHelper.execTrans(routine,function(err,result) {
				if(err) {
					res.send({"result":"failed","reason":"产品说明文件已更新，但其余数据更新失败"});
					res.end();
				}
				else {
					res.send({"result":"succeed"});
					res.end();
				}
			})
		}
	})
}
sql.addanalogTactics = function(req,res) {
	var name = req.query.analogTacticsName;
	var des = req.query.analogTacticsDes;
	var querySql = "insert into  tactics_2 (tsname,tsdesc) values ('"+name+"','"+des+"')";
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})

}
sql.getAllanalogTactics = function(req,res) {
	if(typeof(req.query.page) == "undefined") {
		var querySql2 = 'select tsid,tsname,tsdesc from  tactics_2';
		csp.db.query(querySql2,function(err2,result2) {
			if(err2) {
				res.send({"result":"failed"});
				res.end();
			}
			else {
				res.send({"result":"succeed",'data':result2});
				res.end();
			}
		})
	}
	else {
		var page = req.query.page;
	    var pageCount = req.query.pageCount;
	    var start = (page - 1) * pageCount;
		var querySql1 = 'select COUNT(tsid) as totalcount from  tactics_2';
		var querySql = 'select tsid,tsname,tsdesc from  tactics_2 limit ' + start + ',' + pageCount;
		csp.db.query(querySql1,function(err1,result1){
			if(err1) {
				res.send({"result":"failed"});
				res.end();
			}
			else  {
				csp.db.query(querySql,function(err,result){
					if(err) {
						res.send({"result":"failed"});
						res.end();
					}
					else  {
						res.send({"result":"succeed",'data':result,'count':result1[0].totalcount});
						res.end();
					}
				})
			}
		})
	}
}
sql.deleteanalogTactics = function(req,res) {
	var tsid = req.query.tsid;
	var querySql = 'delete from  tactics_2 where tsid = '+ tsid ;
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.updateanalogTactics = function(req,res) {
	var tsname = req.query.tsname;
	var tsdesc = req.query.tsdesc;
	var tsid = req.query.tsid;
	var querySql = "update tactics_2 set tsname = '"+tsname+"', tsdesc = '"+tsdesc+"' where tsid = " +tsid;
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.getAllanalogProduct = function(req,res) {
	var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;
	var querySql2 = 'select COUNT(id) as totalcount from product_2 ';
	var querySql = 'select t1.id,t1.piclink,t1.caption,t1.contents,ifnull(t1.tsid,"") as analogTacticsList,DATE_FORMAT(t1.releasetime,"%Y-%m-%d") as time,t1.fundmanager,t1.prostatus ,IFNULL(t3.priority,0) as priority , IFNULL(t4.id,-1) as serid, IFNULL(t4.name,"-") as sername from product_2 t1 left join product_layout t3 on t3.protype = 2 and t3.proid = t1.id left join product_series t4 on t4.id = t1.seriesid  limit ' + start + ',' + pageCount;
	var querySql1 = 'select tsid,tsname from  tactics';
	csp.db.query(querySql2,function(err2,result2){
		if(err2) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			csp.db.query(querySql,function(err,result){
				if(err) {
					res.send({"result":"failed"});
					res.end();
				}
				else  {
					csp.db.query(querySql1,function(err1,result1) {
						if(err1) {
							res.send({"result":"failed"});
							res.end();
						}
						else {
							res.send({"result":"succeed","data_analogProduct":result,"data_analogTactics":result1,'count':result2[0].totalcount});
							res.end();
						}
					})
				}
			})
		}
	})
}
sql.getanalogNetByanalogProductId = function(req,res) {
	var proid = req.query.proid;
	var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;
	var querySql1 = 'select COUNT(ID) as totalcount from netproduct_2 where proid = ' + proid;
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			var querySql = 'select ID, net,totalnet,accrate,yearrate,DATE_FORMAT(date,"%Y-%m-%d") as time from netproduct_2 where proid = '+proid+' order by date desc limit ' + start + ',' + pageCount;
			csp.db.query(querySql,function(err,result){
				if(err) {
					res.send({"result":"failed"});
					res.end();
				}
				else  {
					res.send({"result":"succeed","data":result,'count':result1[0].totalcount});
					res.end();
				}
			})
		}
	})
}
sql.deleteanalogProduct = function( req,res) {
	var proid = req.query.id;
	var path = "./app/" + req.query.contents;
	var querySql1 = 'delete from product_2 where id = '+proid;
	routine.push(dbHelper._getNewSqlParamEntity(querySql1));
	var querySql2 = 'delete from netproduct_2 where proid = '+proid;
	routine.push(dbHelper._getNewSqlParamEntity(querySql2));
	var querySql3 = ' delete from product_layout where proid =' + proid + ' and protype = 2';
	routine.push(dbHelper._getNewSqlParamEntity(querySql3));
	var querySql4 = ' delete from product_notice where proid =' + proid + ' and protype = 2';
	routine.push(dbHelper._getNewSqlParamEntity(querySql4));
	var querySql5 = ' delete from spot where proid =' + proid + ' and protype = 2';
	routine.push(dbHelper._getNewSqlParamEntity(querySql5));
	dbHelper.execTrans(routine,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			fs.unlinkSync(path);
			res.send({"result":"succeed"})
			res.end();
		}
	})
}

sql.addSingleanalogNet = function(req,res) {
	var info = req.query;
	var querySql = 'insert into netproduct_2 (date,proid,net,totalnet,accrate,yearrate) values("'+info.date+'",'+info.proid+','+info.analogNet+','+info.totalanalogNet+','+info.accrate+','+info.yearrate+')';
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed","data":result});
			res.end();
		}
	})
}
sql.updateSingleanalogNet = function(req,res) {
	var info = req.query;
	var querySql = 'update netproduct_2 set net = '+info.analogNet+', totalnet = '+info.totalanalogNet+',accrate = '+info.accrate+',yearrate = '+info.yearrate+' where ID ='+info.ID;
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed","data":result});
			res.end();
		}
	})
}
sql.deleteSingleanalogNet = function(req,res) {
	var info = req.query;
	var querySql = 'delete from netproduct_2 where ID = '+info.ID;
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed","data":result});
			res.end();
		}
	})
}

sql.checkanalogNetExist = function(req,res) {
	var querySql = 'select ID from netproduct_2 where proid = '+ req.query.proid+' and date = "'+req.query.date+'"';
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			if(result.length !== 0) {
				res.send({"result":"succeed","exist":true});
			}
			else {
				res.send({"result":"succeed","exist":false});
			}
			res.end();
		}
	})
}
sql.multipleDeleteanalogNets = function(req,res) {
	var info = req.query;
	var querySql;
	if(info.count == 1) {
		querySql = 'delete from netproduct_2 where ID = ' + info.data;
	}
	else {
		querySql = ' delete from netproduct_2 where ID in (';
		for(var i = 0 ; i < info.count; i++) {
			if (i == 0) {
				querySql += info.data[i];
			}
			else {
				querySql += "," + info.data[i] ;
			}
		}
		querySql += ")";
	}
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}

sql.importanalogInsertToDb = function(req,res) {
	var info = req.query;
	var querySql = 'insert into netproduct_2 (date,proid,net,totalnet,accrate,yearrate) values ';
	if(info.count === '1') {
		var json1 = JSON.parse(info.analogNets);
		var con1 = '("'+json1.date+'",'+info.proid+','+json1.analogNet+','+json1.totalanalogNet+','+json1.accrate+','+json1.yearrate+')';
		querySql += con1;
	}
	else {
		for(var i = 0; i < info.analogNets.length; i ++) {
			var json = {};
			json = JSON.parse(info.analogNets[i]);
			var con = "";
			if(i !== info.analogNets.length -1) {
				con = '("'+json.date+'",'+info.proid+','+json.analogNet+','+json.totalanalogNet+','+json.accrate+','+json.yearrate+'),';
			}
			else {
				con = '("'+json.date+'",'+info.proid+','+json.analogNet+','+json.totalanalogNet+','+json.accrate+','+json.yearrate+')';
			}
			querySql += con;
		}
	}
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}

sql.getAllOrder = function(req,res) {
	var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;
	//查询总数
	var querySql1;
	if(req.query.stats == -1) {
		querySql1 = 'select COUNT(oid) as totalcount from orders';
	}
	else {
		querySql1 = 'select COUNT(oid) as totalcount from orders where stats = ' + req.query.stats;
	}
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			var querySql2;
			if(req.query.stats == -1) {
				querySql2 = 'select t1.oid,t1.tel,t1.Remarks,t1.stats,IFNULL(DATE_FORMAT(t1.subtime,"%Y-%m-%d"),"") as time,t1.amount,t2.caption,t3.tname,t4.osdesc from orders t1 left join product t2 on t2.id = t1.proid left join user t3 on t1.uid = t3.uid left join orstate t4 on t4.osid = t1.stats limit '+ start + ',' + pageCount;
			}
			else {
				querySql2 = 'select t1.oid,t1.Remarks,t1.stats,IFNULL(DATE_FORMAT(t1.subtime,"%Y-%m-%d"),"") as time,t1.amount,t2.caption,t3.tname,t3.tel,t4.osdesc from orders t1 left join product t2 on t2.id = t1.proid left join user t3 on t1.uid = t3.uid left join orstate t4 on t4.osid = t1.stats where t1.stats = '+req.query.stats+' limit '+ start + ',' + pageCount;
			}
			csp.db.query(querySql2,function(err2,result2) {
				if(err2) {
					res.send({"result":"failed"});
					res.end();
				}
				else {
					var querySql3 = "select osid,osdesc from orstate";
					csp.db.query(querySql3,function(err3,result3) {
						if(err3) {
							res.send({"result":"failed"});
							res.end();
						}
						else {
							res.send({"result":"succeed","data":result2,"count":result1[0].totalcount,"ostate":result3});
							res.end();
						}
					})
				}
			})
		}
	})
}
sql.updateOrder = function(req,res) {
	var querySql = 'update orders set stats =' + req.query.stats + ', Remarks = "'+req.query.Remarks+'" where oid = ' + req.query.oid;
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.getSpot = function(req,res) {
	var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;
	var proid = req.query.proid;
	var protype = req.query.protype;
	var querySql1 = 'select COUNT(ID)  as totalcount from spot where proid = ' + proid + ' and protype = ' + protype;
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			var querySql2 = 'select ID,IFNULL(DATE_FORMAT(date,"%Y-%m-%d"),"") as time ,code,cname,volume,volamt,last from spot where proid = ' + proid + ' and protype = ' + protype + ' limit ' + start + ',' + pageCount;
			csp.db.query(querySql2,function(err2,result2) {
				if(err2) {
					res.send({"result":"failed"});
					res.end();
				}
				else {
					res.send({"result":"succeed","data":result2,"count":result1[0].totalcount});
					res.end();
				}
			})
		}
	})
}
sql.loadSpotToDb = function(req,res) {
	var info = req.query;
	var querySql = 'insert into spot (date,code,cname,volume,volamt,last,protype,proid) values ';
	if(info.count === '1') {
		var json1 = JSON.parse(info.spots);
		var con1 = '("'+json1.date+'","'+json1.code+'","'+json1.cname+'",'+json1.volume+','+json1.volamt+','+json1.last+','+info.protype+','+info.proid+')';
		querySql += con1;
	}
	else {
		for(var i = 0; i < info.spots.length; i ++) {
			var json = {};
			json = JSON.parse(info.spots[i]);
			var con = "";
			if(i !== info.spots.length -1) {
				con = '("'+json.date+'","'+json.code+'","'+json.cname+'",'+json.volume+','+json.volamt+','+json.last+','+info.protype+','+info.proid+'),';
			}
			else {
				con = '("'+json.date+'","'+json.code+'","'+json.cname+'",'+json.volume+','+json.volamt+','+json.last+','+info.protype+','+info.proid+')';
			}
			querySql += con;
		}
	}
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.spotCheckDate = function(req,res) {
	var querySql = 'select ID from spot where proid = '+req.query.proid+' and protype = ' + req.query.protype+ ' and date = "'+req.query.date+'"';
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			if(result.length === 0) {
				res.send({"result":"succeed","exist":false});
				res.end();
			}
			else {
				res.send({"result":"succeed","exist":true});
				res.end();
			}

		}
	})
}
sql.spotInsertSingleData = function(req,res) {
	var info1 = req.query;
	var info = JSON.parse(req.query.data);
	var querySql = 'insert into spot (date,code,cname,volume,volamt,last,protype,proid) values ("'+info.date+'","'+info.code+'","'+info.cname+'",'+info.volume+','+info.volamt+','+info.last+','+info1.protype+','+info1.proid+')';
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.multipleDeleteSpots = function(req,res) {
	var info = req.query;
	var querySql;
	if(info.count == 1) {
		querySql = 'delete from spot where ID = ' + info.data;
	}
	else {
		querySql = ' delete from spot where ID in (';
		for(var i = 0 ; i < info.count; i++) {
			if (i == 0) {
				querySql += info.data[i];
			}
			else {
				querySql += "," + info.data[i] ;
			}
		}
		querySql += ")";
	}
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.updateSpot = function(req,res) {
	var info = req.query;
	var querySql = 'update spot set date = "'+info.date+'",code = "'+info.code+'",cname = "'+info.cname+'",volume = '+info.volume+',volamt =' +info.volamt+',last ='+info.last+' where ID = ' +info.ID;
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.getFutures = function(req,res) {
	var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;
	var proid = req.query.proid;
	var protype = req.query.protype;
	var querySql1 = 'select COUNT(fid)  as totalcount from futures_position where proid = ' + proid +' and protype = ' + protype;
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			var querySql2 = 'select fid,IFNULL(DATE_FORMAT(date,"%Y-%m-%d"),"") as time ,code,fname,dealtype,deposit,volume,volamt,last from futures_position where proid = ' + proid + ' and protype = ' + protype + ' limit ' + start + ',' + pageCount;
			csp.db.query(querySql2,function(err2,result2) {
				if(err2) {
					res.send({"result":"failed"});
					res.end();
				}
				else {
					res.send({"result":"succeed","data":result2,"count":result1[0].totalcount});
					res.end();
				}
			})
		}
	})
}
sql.futuresInsertSingleData = function(req,res) {
	var info1 = req.query;
	var info = JSON.parse(req.query.data);
	var querySql = 'insert into futures_position (date,code,fname,dealtype,volume,volamt,last,deposit,protype,proid) values ("'+info.date+'","'+info.code+'","'+info.fname+'",'+info.dealtypejson.type+','+info.volume+','+info.volamt+','+info.last+','+info.deposit+','+info1.protype+','+info1.proid+')';
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.updateFutures = function(req,res) {
	var info = req.query;
	var dealtypestr = info.dealtypejson;
	var typejson = JSON.parse(dealtypestr);
	var querySql = 'update futures_position set date = "'+info.date+'",code = "'+info.code+'",fname = "'+info.fname+'",volume = '+info.volume+',volamt =' +info.volamt+',last ='+info.last+',dealtype = '+typejson.type+',deposit = '+info.deposit+' where fid = ' +info.fid;
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.multipleDeleteFutureses = function(req,res) {
	var info = req.query;
	var querySql;
	if(info.count == 1) {
		querySql = 'delete from futures_position where fid = ' + info.data;
	}
	else {
		querySql = ' delete from futures_position where fid in (';
		for(var i = 0 ; i < info.count; i++) {
			if (i == 0) {
				querySql += info.data[i];
			}
			else {
				querySql += "," + info.data[i] ;
			}
		}
		querySql += ")";
	}
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
sql.loadFuturesToDb = function(req,res) {
	var info = req.query;
	var querySql = 'insert into futures_position (date,code,fname,dealtype,volume,volamt,last,deposit,protype,proid) values ';
	if(info.count == '1') {
		var json1 = JSON.parse(info.futureses);
		var con1 = '("'+json1.date+'","'+json1.code+'","'+json1.fname+'",'+json1.dealtype+','+json1.volume+','+json1.volamt+','+json1.last+','+json1.deposit+','+info.protype+','+info.proid+')';
		querySql += con1;
	}
	else {
		for(var i = 0; i < info.futureses.length; i ++) {
			var json = {};
			json = JSON.parse(info.futureses[i]);
			var con = "";
			if(i !== info.futureses.length -1) {
				con = '("'+json.date+'","'+json.code+'","'+json.fname+'",'+json.dealtype+','+json.volume+','+json.volamt+','+json.last+','+json.deposit+','+info.protype+','+info.proid+'),';
			}
			else {
				con = '("'+json.date+'","'+json.code+'","'+json.fname+'",'+json.dealtype+','+json.volume+','+json.volamt+','+json.last+','+json.deposit+','+info.protype+','+info.proid+')';
			}
			querySql += con;
		}
	}
	csp.db.query(querySql,function(err,result){
		if(err) {
			res.send({"result":"failed"});
			res.end();
		}
		else  {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}

//获取产品显示列表--参数需要protype,1表示热门产品，2表示策略产品
sql.getShowProducts = function(req,res) {
	var querySql;
	if(req.query.protype == 1) {
		querySql = 'select t1.proid,t1.protype,t1.priority,t2.caption,t2.piclink from product_layout t1 left join product t2 on t2.id = t1.proid where t1.protype = 1';
	}
	else {
		querySql = 'select t1.proid,t1.protype,t1.priority,t2.caption,t2.piclink from product_layout t1 left join product_2 t2 on t2.id = t1.proid where t1.protype = 2';
	}
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed","data":result});
			res.end();
		}
	})
}
//删除显示的产品 --需要所有参数
sql.deleteShowProduct = function(req,res) {
	var querySql = 'delete from product_layout where protype = "'+req.query.protype+'" and priority = "'+req.query.priority+'"';
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
//添加显示的产品 --需要所有参数
sql.addShowProduct = function(req,res) {
	var querySql = 'insert into product_layout (proid,protype,priority) values ('+req.query.proid+','+req.query.protype+','+req.query.priority+') ON DUPLICATE KEY UPDATE proid = ' + req.query.proid;
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}
//获取所有的系列
sql.getAllSeries = function(req,res) {
	var querySql = 'select id ,name from product_series';
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed","data":result});
			res.end();
		}
	})
}

//获取分页系列
sql.getPageSeries = function(req,res) {
	var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;

	var querySql1 = 'select COUNT(id) as totalcount from product_series';
	var querySql2 = 'select id, name, description from product_series limit '+ start + ',' + pageCount;
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			csp.db.query(querySql2,function(err2,result2) {
				if(err2) {
					res.send({"result":"failed","reason":"服务器出错了"});
					res.end();
				}
				else {
					res.send({"result":"succeed","data":result2,"count":result1[0].totalcount});
					res.end();
				}
			})
		}
	})
}

//添加系列
sql.addSeries = function(req,res) {
	var querySql1 = 'select id from product_series where name = "'+req.query.name+'"';
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			if(result1.length > 0) {
				res.send({"result":"failed","reason":"该系列已存在"});
				res.end();
			}
			else {
				var querySql2 = 'insert into product_series (name,description) values("'+req.query.name+'","'+req.query.description+'")';
				csp.db.query(querySql2,function(err2,result2) {
					if(err2) {

						res.send({"result":"failed","reason":"服务器出错了"});
						res.end();
					}
					else {
						res.send({"result":"succeed"});
						res.end();
					}
				})
			}
		}
	})
}

//更新系列
sql.updateSeries = function(req,res) {
	var querySql1 = 'select description from product_series where id != ' + req.query.id+ ' and name = "'+req.query.name+'"';
	csp.db.query(querySql1,function(err1,result1) {
		if(err1) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			if(result1.length > 0) {
				res.send({"result":"failed","reason":"该系列已存在"});
				res.end();
			}
			else {
				var querySql2 = 'update product_series set name = "'+req.query.name+'",description = "'+req.query.description+'" where id = ' + req.query.id ;
				csp.db.query(querySql2,function(err2,result2) {
					if(err2) {
						res.send({"result":"failed","reason":"服务器出错了"});
						res.end();
					}
					else {
						res.send({"result":"succeed"});
						res.end();
					}
				})
			}
		}
	})
}

//删除系列
sql.deleteSeries = function(req,res) {
	var querySql = 'delete from product_series where id = ' + req.query.id;
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}

//获取分页公告
sql.getPageNotices = function(req,res) {
	var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;
	if(req.query.protype == 0) {
		if(req.query.seriesid == -1) {
			//查询全部
			var querySql1 = 'select COUNT(id) as totalcount from product_notice';
			csp.db.query(querySql1,function(err1,result1) {
				if(err1) {
					res.send({"result":"failed","reason":"服务器出错了"});
					res.end();
				}
				else {
					var querySql2 = 'select t1.id,t1.proid,t1.protype,t1.name,t1.path,DATE_FORMAT(t1.notice_date,"%Y-%m-%d") as notice_date, t2.caption , IFNULL(t3.name,"-") as sername from product_notice t1 left join product t2 on t2.id = t1.proid left join product_series t3 on t3.id = t2.seriesid where t1.protype = 1 UNION ALL select t1.id,t1.proid,t1.protype,t1.name,t1.path,DATE_FORMAT(t1.notice_date,"%Y-%m-%d") as notice_date, t2.caption, IFNULL(t3.name,"-") as sername from product_notice t1 left join product_2 t2 on t2.id = t1.proid left join product_series t3 on t3.id = t2.seriesid where t1.protype = 2 limit ' + start + ',' + pageCount;
					csp.db.query(querySql2,function(err2,result2) {
						if(err2) {
							res.send({"result":"failed","reason":"服务器出错了"});
							res.end();
						}
						else {
							res.send({"result":"succeed","data":result2,"count":result1[0].totalcount});
							res.end();
						}
					})
				}
			})
		}
		else {
			//查询全部
			var querySql1 = 'select COUNT(1) as totalcount from ( select t1.id from product_notice t1 inner join product t2 on t1.proid = t2.id and t2.seriesid = '+req.query.seriesid+' where t1.protype = 1 union all select t1.id from product_notice t1 inner join product_2 t2 on t1.proid = t2.id and t2.seriesid = '+req.query.seriesid+' where t1.protype = 2) table_a';
			csp.db.query(querySql1,function(err1,result1) {
				if(err1) {
					res.send({"result":"failed","reason":"服务器出错了"});
					res.end();
				}
				else {
					var querySql2 = 'select t1.id,t1.proid,t1.protype,t1.name,t1.path,DATE_FORMAT(t1.notice_date,"%Y-%m-%d") as notice_date, t2.caption , IFNULL(t3.name,"-") as sername from product_notice t1 inner join product t2 on t2.id = t1.proid  and t2.seriesid = '+req.query.seriesid+' left join product_series t3 on t3.id = t2.seriesid where t1.protype = 1 UNION ALL select t1.id,t1.proid,t1.protype,t1.name,t1.path,DATE_FORMAT(t1.notice_date,"%Y-%m-%d") as notice_date, t2.caption, IFNULL(t3.name,"-") as sername from product_notice t1 inner join product_2 t2 on t2.id = t1.proid and t2.seriesid = '+req.query.seriesid+' left join product_series t3 on t3.id = t2.seriesid where t1.protype = 2 limit ' + start + ',' + pageCount;
					csp.db.query(querySql2,function(err2,result2) {
						if(err2) {
							res.send({"result":"failed","reason":"服务器出错了"});
							res.end();
						}
						else {
							res.send({"result":"succeed","data":result2,"count":result1[0].totalcount});
							res.end();
						}
					})
				}
			})
		}
	}
	else if(req.query.protype == 1) {
		//查询热门产品
		if(req.query.proid == 0) {
			//查询所有热门产品
			var querySql1 = 'select COUNT(id) as totalcount from product_notice where protype = 1';
			csp.db.query(querySql1,function(err1,result1) {
				if(err1) {
					res.send({"result":"failed","reason":"服务器出错了"});
					res.end();
				}
				else {
					var querySql2 = 'select t1.id,t1.proid,t1.protype,t1.name,t1.path,DATE_FORMAT(t1.notice_date,"%Y-%m-%d") as notice_date, t2.caption, IFNULL(t3.name,"-") as sername from product_notice t1 left join product t2 on t2.id = t1.proid left join product_series t3 on t3.id = t2.seriesid where t1.protype = 1 limit ' + start + ',' + pageCount;
					csp.db.query(querySql2,function(err2,result2) {
						if(err2) {
							res.send({"result":"failed","reason":"服务器出错了"});
							res.end();
						}
						else {
							res.send({"result":"succeed","data":result2,"count":result1[0].totalcount});
							res.end();
						}
					})
				}
			})
		}
		else {
			//查询单个产品
			var querySql1 = 'select COUNT(id) as totalcount from product_notice where protype = 1 and proid = ' + req.query.proid;
			csp.db.query(querySql1,function(err1,result1) {
				if(err1) {
					res.send({"result":"failed","reason":"服务器出错了"});
					res.end();
				}
				else {
					var querySql2 = 'select t1.id,t1.proid,t1.protype,t1.name,t1.path,DATE_FORMAT(t1.notice_date,"%Y-%m-%d") as notice_date, t2.caption, IFNULL(t3.name,"-") as sername from product_notice t1 left join product t2 on t2.id = t1.proid left join product_series t3 on t3.id = t2.seriesid where t1.protype = 1 and proid = ' + req.query.proid +' limit ' + start + ',' + pageCount;
					csp.db.query(querySql2,function(err2,result2) {
						if(err2) {
							res.send({"result":"failed","reason":"服务器出错了"});
							res.end();
						}
						else {
							res.send({"result":"succeed","data":result2,"count":result1[0].totalcount});
							res.end();
						}
					})
				}
			})
		}
	}
	else {
		//查询策略产品
		if(req.query.proid == 0) {
			//查询所有策略产品
			var querySql1 = 'select COUNT(id) as totalcount from product_notice where protype = 2';
			csp.db.query(querySql1,function(err1,result1) {
				if(err1) {
					res.send({"result":"failed","reason":"服务器出错了"});
					res.end();
				}
				else {
					var querySql2 = 'select t1.id,t1.proid,t1.protype,t1.name,t1.path,DATE_FORMAT(t1.notice_date,"%Y-%m-%d") as notice_date, t2.caption , IFNULL(t3.name,"-") as sername from product_notice t1 left join product_2 t2 on t2.id = t1.proid left join product_series t3 on t3.id = t2.seriesid where t1.protype = 2 limit ' + start + ',' + pageCount;
					csp.db.query(querySql2,function(err2,result2) {
						if(err2) {
							res.send({"result":"failed","reason":"服务器出错了"});
							res.end();
						}
						else {
							res.send({"result":"succeed","data":result2,"count":result1[0].totalcount});
							res.end();
						}
					})
				}
			})
		}
		else {
			//查询单个产品
			var querySql1 = 'select COUNT(id) as totalcount from product_notice where protype = 2 and proid = ' + req.query.proid;
			csp.db.query(querySql1,function(err1,result1) {
				if(err1) {
					res.send({"result":"failed","reason":"服务器出错了"});
					res.end();
				}
				else {
					var querySql2 = 'select t1.id,t1.proid,t1.protype,t1.name,t1.path,DATE_FORMAT(t1.notice_date,"%Y-%m-%d") as notice_date, t2.caption, IFNULL(t3.name,"-") as sername from product_notice t1 left join product_2 t2 on t2.id = t1.proid left join product_series t3 on t3.id = t2.seriesid where t1.protype = 2 and proid = ' + req.query.proid +' limit ' + start + ',' + pageCount;
					csp.db.query(querySql2,function(err2,result2) {
						if(err2) {
							res.send({"result":"failed","reason":"服务器出错了"});
							res.end();
						}
						else {
							res.send({"result":"succeed","data":result2,"count":result1[0].totalcount});
							res.end();
						}
					})
				}
			})
		}
	}
}

//获取筛选产品
sql.getNoticeProduct = function(req,res) {
	var querySql;
	if(req.query.protype == 1) {
		querySql = 'select id,caption from product';
	}
	else {
		querySql = 'select id,caption from product_2';
	}
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed","data":result});
			res.end();
		}
	})
}

//重命名附件
sql.uploadNoticeFile = function(req,res) {
	var querySql = 'select fgetseed("html") as seed';
	csp.db.query(querySql,function(err,result) {
		if(err) {
			fs.unlinkSync('./app/files/' + req.query.uploadedPath);
			res.send({"result":"failed","reason":"重命名文件失败"});
            res.end();
		}
		else {
			if(result.length > 0 && typeof(result[0].seed) !== "undefined") {
				var uploadedPath = req.query.uploadedPath;
                var filekindarr = uploadedPath.split(".");
                var kind = filekindarr[filekindarr.length -1];
                var dstPath = './app/files/notice_' + result[0].seed+"."+kind;
                var retPath = "notice_"+result[0].seed+"."+kind;
                //重命名为真实文件名
                fs.rename(uploadedPath, dstPath, function(err){
                    if(err) {
						fs.unlinkSync('./app/files/' + req.query.uploadedPath);
						res.send({"result":"failed","reason":"重命名文件失败"});
                        res.end();
                    }
                    else {
                        res.send({"result":"succeed","filepath":"files/" + retPath});
                        res.end();
                    }
                })
			}
			else {
				fs.unlinkSync('./app/files/' + req.query.uploadedPath);
				res.send({"result":"failed","reason":"重命名文件失败"});
                res.end();
			}
		}
	})
}

//添加公告
sql.addNotice = function(req,res) {
	var querySql = 'insert into product_notice (proid,protype,name,notice_date,path) values ('+req.query.proid+','+req.query.protype+',"'+req.query.name+'",curdate(),"'+req.query.path+'")';
	csp.db.query(querySql,function(err,result) {
		if(err) {
			fs.unlinkSync('./app/' + req.query.path);
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}

//更新公告
sql.updateNotice = function(req,res) {
	var querySql = 'update product_notice set name = "'+req.query.name+'" , path = "'+req.query.path+'" where id =' +req.query.id;
	csp.db.query(querySql,function(err,result) {
		if(err) {
			fs.unlinkSync('./app/' + req.query.path);
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			fs.unlinkSync('./app/' + req.query.oldpath);
			res.send({"result":"succeed"});
			res.end();
		}
	})
}

//删除公告
sql.deleteNotice = function(req,res) {
	var querySql = 'delete from product_notice where id = ' + req.query.id;
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			fs.unlinkSync('./app/' + req.query.path);
			res.send({"result":"succeed"});
			res.end();
		}
	})
}

//获取简略的用户表
sql.getSimpleUserInfo = function(req,res) {
	var querySql = 'select uid, IFNULL(tname,"-") as name, tel from user';
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed","data":result});
			res.end();
		}
	})
}

//批量导入用户
sql.multipleLoadUser = function(req,res) {
	var count = req.query.count;
	var querySql = 'insert into user(uid,username,pass,tel,last_logintm,tname,idnumber,au_stat,conlevel,reg_date) values';
	if(count == 1) {
		var users = JSON.parse(req.query.users);
		var str = '(uuid_short(),CONCAT("u_"+fgetseed("user.username")),"'+users.phone.toString().substring(5)+'","'+users.phone+'",now(),"'+users.name+'","'+users.idcard+'",1,'+users.conlevel+',DATE_FORMAT(now(),"%Y-%m-%d"))';
		querySql = querySql +str;
	}
	else {
		var users = req.query.users;
		for(var i = 0; i < users.length; i ++) {
			var user = JSON.parse(users[i]);
			var str = "";
			if( i != users.length -1) {
				str = '(uuid_short(),CONCAT("u_"+fgetseed("user.username")),"'+user.phone.toString().substring(5)+'","'+user.phone+'",now(),"'+user.name+'","'+user.idcard+'",1,'+user.conlevel+',DATE_FORMAT(now(),"%Y-%m-%d")),';
				querySql = querySql +str;
			}
			else {
				str = '(uuid_short(),CONCAT("u_"+fgetseed("user.username")),"'+user.phone.toString().substring(5)+'","'+user.phone+'",now(),"'+user.name+'","'+user.idcard+'",1,'+user.conlevel+',DATE_FORMAT(now(),"%Y-%m-%d"))';
				querySql = querySql +str;
			}
		}
	}
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}

//获取会员等级表
sql.getConlevel = function(req,res) {
	var querySql = 'select id,name from conlevel';
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed","data":result});
			res.end();
		}
	})
}

//获取简单的产品列表
sql.getSimpleProducts = function(req,res) {
	if(req.query.protype == 1) {
		var querySql = 'select id,caption from product';
		csp.db.query(querySql,function(err,result) {
			if(err) {
				res.send({"result":"failed","reason":"服务器出错了"});
				res.end();
			}
			else {
				res.send({"result":"succeed","data":result});
				res.end();
			}
		})
	}
	else {
		res.send({"result":"failed","reason":"服务器出错了"});
		res.end();
	}
}

//定位重复项
sql.getRepeatLoadBought = function(req,res) {
	var count = req.query.count;
	var boughts = req.query.boughts;
	var proid = req.query.proid;
	var querySql = 'select uid,protype,proid from cus_buy_pro where ';
	if(count == 1) {
		var bought = JSON.parse(boughts);
		var str = '(uid in ("'+bought.uid+'") and protype in (1) and proid in ('+proid+'))';
		querySql += str;
	}
	else {
		for(var i = 0; i < boughts.length; i++) {
			var bought = JSON.parse(boughts[i]);
			var str;
			if(i != boughts.length -1) {
				str = '(uid in ("'+bought.uid+'") and protype in (1) and proid in ('+proid+')) or ';
			}
			else {
				str = '(uid in ("'+bought.uid+'") and protype in (1) and proid in ('+proid+'))';
			}
			querySql += str;
		}
	}
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed","data":result});
			res.end();
		}
	})

}

//获取分页已购产品数据
sql.getPageBoughts = function(req,res) {
	var page = req.query.page;
	var pageCount = req.query.pageCount;
	var start = (page - 1) * pageCount
	if(req.query.type == 1) {
		//按系列查找
		var seriesid = req.query.seriesid;
		var querySql1 = 'select COUNT(a.uid) as totalcount  from (select t1.uid from cus_buy_pro t1 left join product t2 on t2.id = t1.proid inner join product_series t3 on t2.seriesid = t3.id and t3.id = '+seriesid+') a ';
		var querySql = 'select t1.uid,t1.proid,t1.protype,t1.amount,IFNULL(t2.tname,"-") as uname,t2.tel,t3.caption,t4.name as sname from cus_buy_pro t1 left join user t2 on t2.uid = t1.uid left join product t3 on t3.id = t1.proid inner join product_series t4 on t4.id = ' + seriesid + ' and t4.id = t3.seriesid limit ' + start + ', ' + pageCount;
		csp.db.query(querySql1,function(err1,result1) {
			if(err1) {
				res.send({"result":"failed","reason":"服务器出错了"});
				res.end();
			}
			else {
				csp.db.query(querySql,function(err,result) {
					if(err) {
						res.send({"result":"failed","reason":"服务器出错了"});
						res.end();
					}
					else {
						res.send({"result":"succeed","data":result,"count":result1[0].totalcount});
						res.end();
					}
				})
			}
		})
	}
	else if(req.query.type == 2) {
		//按产品查找
		var proid = req.query.proid;
		var querySql1 = 'select COUNT(uid) as totalcount from cus_buy_pro where proid = ' + proid;
		var querySql = 'select t1.uid,t1.proid,t1.protype,t1.amount,IFNULL(t2.tname,"-") as uname,t2.tel,t3.caption,t4.name as sname from cus_buy_pro t1 left join user t2 on t2.uid = t1.uid left join product t3 on t3.id = t1.proid left join product_series t4 on t4.id = t3.seriesid where t1.proid = '+proid+' limit ' + start + ', ' + pageCount;
		csp.db.query(querySql1,function(err1,result1) {
			if(err1) {
				res.send({"result":"failed","reason":"服务器出错了"});
				res.end();
			}
			else {
				csp.db.query(querySql,function(err,result) {
					if(err) {
						res.send({"result":"failed","reason":"服务器出错了"});
						res.end();
					}
					else {
						res.send({"result":"succeed","data":result,"count":result1[0].totalcount});
						res.end();
					}
				})
			}
		})
	}
	else {
		//按用户模糊匹配
		var querySql1;
		var querySql;
		if(req.query.userinfo == ""){
			//查询所有的
			querySql1 = 'select COUNT(uid) as totalcount from cus_buy_pro ';
			querySql = 'select t1.uid,t1.proid,t1.protype,t1.amount,IFNULL(t2.tname,"-") as uname,t2.tel,t3.caption,t4.name as sname from cus_buy_pro t1 left join user t2 on t2.uid = t1.uid left join product t3 on t3.id = t1.proid left join product_series t4 on t4.id = t3.seriesid limit ' + start + ', ' + pageCount;
		}
		else {
			//模糊查询
			querySql1 = 'select COUNT(a.uid) as totalcount from (select t1.uid from cus_buy_pro t1 inner join user t2 on t2.uid = t1.uid and (t2.tel like "%'+req.query.info+'%" or t2.tname like "%'+req.query.userinfo+'%") ) a';
			querySql = 'select t1.uid,t1.proid,t1.protype,t1.amount,IFNULL(t2.tname,"-") as uname,t2.tel,t3.caption,t4.name as sname from cus_buy_pro t1 left join product t3 on t3.id = t1.proid left join product_series t4 on t4.id = t3.seriesid inner join user t2 on t2.uid = t1.uid and (t2.tel like "%'+req.query.userinfo+'%" or t2.tname like "%'+req.query.userinfo+'%") limit ' + start + ', ' + pageCount;
		}
		csp.db.query(querySql1,function(err1,result1) {
			if(err1) {
				res.send({"result":"failed","reason":"服务器出错了"});
				res.end();
			}
			else {
				csp.db.query(querySql,function(err,result) {
					if(err) {
						res.send({"result":"failed","reason":"服务器出错了"});
						res.end();
					}
					else {
						res.send({"result":"succeed","data":result,"count":result1[0].totalcount});
						res.end();
					}
				})
			}
		})
	}
}

//批量导入已购产品数据
sql.multipleLoadBoughts = function(req,res) {
	var protype = req.query.protype;
	var proid = req.query.proid;
	var boughts = req.query.boughts;
	var count = req.query.count;
	var querySql = 'INSERT INTO cus_buy_pro(uid,proid,protype,amount)  VALUES';
	if(count == 1) {
		var bought = JSON.parse(boughts);
		var str = '("'+bought.uid+'",'+proid+','+protype+','+bought.amount+')';
		querySql += str;
	}
	else {
		for(var i = 0; i < boughts.length; i++) {
			var bought = JSON.parse(boughts[i]);
			var str;
			if(i != boughts.length -1) {
				str = '("'+bought.uid+'",'+proid+','+protype+','+bought.amount+'),';
			}
			else {
				str = '("'+bought.uid+'",'+proid+','+protype+','+bought.amount+')';
			}
			querySql += str;
		}
	}
	if(req.query.role == 1) {
		querySql += 'ON DUPLICATE KEY UPDATE amount = amount';
	}
	else if (req.query.role == 2) {
		querySql += 'ON DUPLICATE KEY UPDATE amount = amount + VALUES(amount)';
	}
	else {
		querySql += 'ON DUPLICATE KEY UPDATE amount = VALUES(amount)';
	}
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}

sql.updateBought = function(req,res) {
	var querySql = 'update cus_buy_pro set amount = ' + req.query.amount + ' where uid = "'+req.query.uid+'" and protype = ' + req.query.protype + ' and proid =' + req.query.proid;
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}

sql.deleteBought = function(req,res) {
	var querySql = 'delete from cus_buy_pro where uid = "'+req.query.uid+'" and protype = ' + req.query.protype + ' and proid =' + req.query.proid;
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed"});
			res.end();
		}
	})
}

sql.getProductRisklevels = function(req,res) {
	var querySql = 'select id,name from product_risklevel';
	csp.db.query(querySql,function(err,result) {
		if(err) {
			res.send({"result":"failed","reason":"服务器出错了"});
			res.end();
		}
		else {
			res.send({"result":"succeed","data":result});
			res.end();
		}
	})
}

sql.getPageProducts = function(req,res) {
	var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;
	var querySql,querySql1,querySql2;
	if(req.query.protype == 1) {
		querySql2 = 'select COUNT(id) as totalcount from product ';
		querySql = 'select t1.id,t1.piclink,t1.caption,t1.contents,ifnull(t1.tsid,"") as tacticsList,DATE_FORMAT(t1.releasetime,"%Y-%m-%d") as time,t1.fundmanager,t1.prostatus,t1.risklevelid,t1.blackout_period,t1.subscribe_point,t1.subscribe_rate,t1.manage_rate,t1.redeem_rate,t1.merit_pay,IFNULL(t2.name,"-") as rname, IFNULL(t3.priority,0) as priority , IFNULL(t4.id,-1) as serid, IFNULL(t4.name,"-") as sername from product t1 left join product_risklevel t2 on t2.id = t1.risklevelid left join product_layout t3 on t3.protype = 1 and t3.proid = t1.id left join product_series t4 on t4.id = t1.seriesid limit ' + start + ',' + pageCount;
		querySql1 = 'select tsid,tsname from tactics';
	}
	else {
		querySql2 = 'select COUNT(id) as totalcount from product_2 ';
		querySql = 'select t1.id,t1.piclink,t1.caption,t1.contents,ifnull(t1.tsid,"") as analogTacticsList,DATE_FORMAT(t1.releasetime,"%Y-%m-%d") as time,t1.fundmanager,t1.prostatus , t1.risklevelid,t1.blackout_period,t1.subscribe_point,t1.subscribe_rate,t1.manage_rate,t1.redeem_rate,t1.merit_pay,IFNULL(t2.name,"-") as rname,IFNULL(t3.priority,0) as priority , IFNULL(t4.id,-1) as serid, IFNULL(t4.name,"-") as sername from product_2 t1 left join product_risklevel t2 on t2.id = t1.risklevelid left join product_layout t3 on t3.protype = 2 and t3.proid = t1.id left join product_series t4 on t4.id = t1.seriesid  limit ' + start + ',' + pageCount;
		querySql1 = 'select tsid,tsname from  tactics';
	}
	csp.db.query(querySql2,function(err2,result2){
		if(err2) {
			res.send({"result":"failed"});
			res.end();
		}
		else {
			csp.db.query(querySql,function(err,result){
				if(err) {
					res.send({"result":"failed"});
					res.end();
				}
				else  {
					csp.db.query(querySql1,function(err1,result1) {
						if(err1) {
							res.send({"result":"failed"});
							res.end();
						}
						else {
							res.send({"result":"succeed","data_product":result,"data_tactics":result1,'count':result2[0].totalcount});
							res.end();
						}
					})
				}
			})
		}
	})
}

module.exports =  sql;
