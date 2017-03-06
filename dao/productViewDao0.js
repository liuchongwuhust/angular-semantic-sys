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
// var fs=require("fs");
var sql = {};

sql.getProductDetails = function(req,res) {
		var querySql = 'select * from product_2 where id ="'+req.session.productID0+'"';
		console.log("querySql",querySql);

	  csp.db.query(querySql,function(err,result){
			if(err){
				return;
			}
			var obj={};
			if(result.length===1){
				obj=result[0];
				obj.result=true;
				// if(fs.existsSync('app/' +result[0].contents))
				// 	result[0].contents=fs.readFileSync('app/' +result[0].contents,"utf-8");
				// else
				// 		result[0].contents='';
			}
			else {
				obj.result=false;
				obj.reason='没有找到指定的产品信息';
			}
			console.log(obj,result.length);
			return $util.jsonWrite(res,obj);

	  });

};

sql.getProductAmount = function(req,res) {
	var querySql="select count(id) as productAmount  from product_2";

	var filter='';
	if(typeof(req.query.tacticsID)!='undefined'&& req.query.tacticsID!=-1){
		filter+=' find_in_set("'+req.query.tacticsID+'",tsid) and ';
	}

	if(typeof(req.query.riskLevelID)!='undefined'&& req.query.riskLevelID!=-1){
		filter+=' risklevelid='+req.query.riskLevelID+' and ';
	}

	if(typeof(req.query.seriesID)!='undefined'&& req.query.seriesID!=-1){
		filter+=' seriesid='+req.query.seriesID+' and ';
	}

	if (typeof req.query.productname!='undefined'&&req.query.productname!=='') {
		filter+=' caption like "%'+req.query.productname+'%" and ';
	}

	if (filter.length>0) {
		filter=filter.substring(0,filter.length-4);
		querySql+=' where '+filter;

	}

	csp.db.query(querySql,function(err,result){
		console.log(result,querySql);
		if(err){
			return {'result':false};
		}

		return $util.jsonWrite(res,result[0]);
	});
}

sql.getFutures = function(req,res) {
	var querySql="select * from futures_position where proid="+req.session.productID0+" and protype=2 order by date desc";

	csp.db.query(querySql,function(err,result){
		if(err){
			return {'result':false};
		}
		console.log(result,result.length);
		return $util.jsonWrite(res,result);
	});
}

sql.getTactics = function(req,res) {

	var tacticsidArr=req.query.tacticsIDs.split(",");
	console.log(tacticsidArr.length,tacticsidArr);

	var tacticsArr=' tsid="'+tacticsidArr[0]+'"';
	for (var i = 1; i < tacticsidArr.length; i++) {
		tacticsArr=tacticsArr+' or tsid="'+tacticsidArr[i]+'"';
	}

	var querySql;
	querySql='select * from tactics where '+tacticsArr ;
	console.log("querySql",querySql);
	csp.db.query(querySql,function(err,result){
		if(err){
			return;
		}
		console.log(result,result.length);
		return $util.jsonWrite(res,result);
	});
}


sql.getRiskLevelInfo = function(req,res) {
	var querySql;
	querySql='select * from product_risklevel where id='+req.query.risklevelid ;

	csp.db.query(querySql,function(err,result){
		console.log(querySql,result);

		if(err){
			return {'result':false};
		}
		return $util.jsonWrite(res,result[0]);
	});
}

sql.getSeriesInfo = function(req,res) {
	var querySql;
	querySql='select * from product_series where id='+req.query.seriesid ;

	csp.db.query(querySql,function(err,result){
		console.log(querySql,result);

		if(err){
			return {'result':false};
		}
		return $util.jsonWrite(res,result[0]);
	});
}


	sql.getAllTactics = function(req,res) {
		var querySql;
		querySql='select * from tactics';
		console.log("querySql",querySql);
		csp.db.query(querySql,function(err,result){
			if(err){
				return;
			}
			console.log(result,result.length);
			return $util.jsonWrite(res,result);
		});
	}


	sql.getAllProductSeries = function(req,res) {
		var querySql='select * from product_series';
		console.log("querySql",querySql);
		csp.db.query(querySql,function(err,result){
			if(err){
				return {'result':false};
			}
			console.log(result,result.length);
			return $util.jsonWrite(res,result);
		});
	}

	sql.getAllProRiskLevel = function(req,res) {
		var querySql;
		querySql='select * from product_risklevel';
		console.log("querySql",querySql);
		csp.db.query(querySql,function(err,result){
			if(err){
				return {'result':false};
			}
			console.log(result,result.length);
			return $util.jsonWrite(res,result);
		});
	}

	sql.getProducts = function(req,res) {
			var querySql = 'select * from product_2';
			console.log("querySql",querySql);

		  csp.db.query(querySql,function(err,result){
				if(err){
					return;
				}
				console.log(result,result.length);
				return $util.jsonWrite(res,result);

		  });
	}

	//  var option={page:1请求页数,tacticsID:''请求策略,sortField:''排序字段,ascend=true;排序顺序}
	sql.getProductsByFilter = function(req,res) {
			var querySql='select * from product_2';
			console.log('req',req.query.tacticsID,req.query.sortField,req.query.ascend);

			if(typeof(req.query.tacticsID)!='undefined'&& req.query.tacticsID!=''){
				querySql+=' where find_in_set("'+req.query.tacticsID+'",tsid)';
			}

			if(typeof(req.query.sortField)!='undefined'&& req.query.sortField!=''){
				querySql+=' order by '+req.query.sortField ;
				if(req.query.ascend=='false'){
					querySql+=' desc';
				}
			}

			if(typeof(req.query.page)!='undefined'&& req.query.page!=''){
				querySql+=' limit '+(req.query.page-1)*req.query.pageRows+','+req.query.pageRows;
			}

			console.log("querySql",querySql);

			csp.db.query(querySql,function(err,result){
				if(err){
					return;
				}
				console.log(result,result.length);
				return $util.jsonWrite(res,result);

			});

	}

	sql.getCardsProduct=function(req, res){
		var querySql='';
		querySql+='SELECT a.*,b.*,c.* FROM  product_layout a ';
    querySql+=     'LEFT JOIN product_2  b ON a.proid =b.id ';
    querySql+=      'LEFT JOIN  ( SELECT proid,`date`,net,totalnet,accrate, yearrate ';
    querySql+=                     'FROM ( ';
    querySql+=                           'SELECT proid,`date`,net,totalnet,accrate, yearrate FROM  netproduct_2 c ORDER BY `date` DESC ';
    querySql+=                           ') c ';
    querySql+=                    'GROUP BY proid ';
    querySql+=                  ') c ';
    querySql+=        'ON a.proid = c.proid ';
    querySql+=     'WHERE protype='+req.query.protype+' ORDER BY a.priority ASC' ;
		console.log("querySql",querySql);

		csp.db.query(querySql,function(err,result){
		console.log('getCardsProduct',querySql,result);

			if(err){
				return $util.jsonWrite(res,{'result':false});
			}
			return $util.jsonWrite(res,result);

		});
	}

	//获取有筛选条件的产品,且带有最新净值数据
	sql.getProductsByFilterWithLatestNet = function(req,res) {
			var querySql = 'SELECT a.*,b.* FROM `product_2` a ';
			querySql+='LEFT JOIN ( SELECT a.* FROM (SELECT * FROM `netproduct_2` ORDER BY DATE DESC) a GROUP BY proid ) b ON a.`id` =b.proid ';

			// if(typeof(req.query.tacticsID)!='undefined'&& req.query.tacticsID!=''){
			// 	querySql+=' where find_in_set("'+req.query.tacticsID+'",tsid) ';
			// }

			var filter='';
			if(typeof(req.query.tacticsID)!='undefined'&& req.query.tacticsID!=-1){
				filter+=' find_in_set("'+req.query.tacticsID+'",tsid) and ';
			}

			if(typeof(req.query.riskLevelID)!='undefined'&& req.query.riskLevelID!=-1){
				filter+=' risklevelid='+req.query.riskLevelID+' and ';
			}

			if(typeof(req.query.seriesID)!='undefined'&& req.query.seriesID!=-1){
				filter+=' seriesid='+req.query.seriesID+' and ';
			}

			if (typeof req.query.productname!='undefined'&&req.query.productname!=='') {
				filter+=' caption like "%'+req.query.productname+'%" and ';
			}

			if (filter.length>0) {
				filter=filter.substring(0,filter.length-4);
				querySql+=' where '+filter;

			}

			querySql+=' ORDER BY  b.yearrate DESC ';

			if(typeof(req.query.page)!='undefined'&& req.query.page!=''){
				querySql+=' limit '+(req.query.page-1)*req.query.pageRows+','+req.query.pageRows;
			}

			csp.db.query(querySql,function(err,result){
				console.log("querySql",querySql,err,result);

				if(err){
					return {'result':false};
				}
				return $util.jsonWrite(res,result);

			});

	}


		sql.getProductLatestNet = function(req,res) {
				var querySql = 'select * from netproduct_2 where proid="'+req.query.productID+'" and date=( select max(date) from netproduct_2 where proid="'+req.query.productID+'")';
				console.log("querySql",querySql);

			  csp.db.query(querySql,function(err,result){
					if(err){
						return;
					}
					console.log('getProductLatestNet',result);
					if(result.length==1){
						return $util.jsonWrite(res,result[0]);
					}

						var obj={};
						obj.proid=req.query.productID;
						return $util.jsonWrite(res,obj);



			  });
		}


		sql.getProductSpot=function(req, res){
			var querySql = 'select ID,date,DATE_FORMAT(date,"%Y-%m-%d") as mdate,code,cname,volume,volamt,last from spot where proid='+req.session.productID0+' and protype='+req.query.protype+' order by date desc';
			console.log("querySql",querySql);

			csp.db.query(querySql,function(err,result){
				if(err){
					return;
				}
				console.log('getProductSpot',result);

				return $util.jsonWrite(res,result);

			});
		}

	sql.getNetProduct=function(req, res){
		var querySql = 'select  ID,date,DATE_FORMAT(date,"%Y-%m-%d") as datetime,net,totalnet,accrate,yearrate from netproduct_2 where proid="'+req.query.productID+'" order by date desc';
		console.log("querySql",querySql);

		csp.db.query(querySql,function(err,result){
			if(err){
				return;
			}
			console.log('getNetProduct',result);

			return $util.jsonWrite(res,result);

		});
	}

	sql.getNetAssetValue=function(req, res){
		// var querySql = 'select net,date from netproduct_2 where proid="'+req.query.productID+'" and date=DATE_FORMAT("'+req.query.netdate+'","%Y%m%d")';
		var querySql = 'select * from netproduct_2 where proid="'+req.query.productID+'" and date="'+req.query.netdate+'"';
		console.log("querySql",querySql);

		csp.db.query(querySql,function(err,result){
			if(err){
				return;
			}
			console.log('getNetAssetValue',result);

			var obj={};
			obj.proid=req.query.productID;
			obj.result=true;
			if(result.length===1){
				return $util.jsonWrite(res,result[0]);
			}
			else {
				obj.date=req.query.netdate;
				obj.net='--';
				obj.reason='查询到了多个单位净值';
			}
			return $util.jsonWrite(res,obj);

		});

	}

	sql.getProductNotices=function(req, res){
		var querySql ='select *,DATE_FORMAT(notice_date,"%Y-%m-%d") as noticeDate from product_notice where protype=1 and proid='+req.query.productID;
		console.log("querySql",querySql);

		csp.db.query(querySql,function(err,result){
			console.log(querySql,result);

			if(err){
				return $util.jsonWrite(res,{'result':false});
			}

			return $util.jsonWrite(res,result);

		});
	}

	sql.getProductNotices=function(req, res){
		var querySql ='select *,DATE_FORMAT(notice_date,"%Y-%m-%d") as noticeDate from product_notice where protype=2 and proid='+req.query.productID;
		console.log("querySql",querySql);

		csp.db.query(querySql,function(err,result){
			console.log(querySql,result);

			if(err){
				return $util.jsonWrite(res,{'result':false});
			}

			return $util.jsonWrite(res,result);

		});
	}

module.exports = sql;
