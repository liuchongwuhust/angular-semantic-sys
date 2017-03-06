/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

var $util = require('../util/util.js');
var sql = {};


sql.submitOrder=function(req,res){
  var querySql = 'insert into orders(uid,subtime,protype,proid,amount,stats,tel) values("'+req.session.uid+'",now(),1,'+req.session.productID+','+req.query.orderAmount+',0,'+req.query.tel+')';
  // var querySql = 'select * from product';

  console.log(querySql);
  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      console.log(result);
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{'result':true});
    });
}

sql.getOrder=function(req,res){
  var querySql = 'select oid,DATE_FORMAT(subtime,"%Y-%m-%d %T") as msubtime,amount,tel,Remarks,caption from orders,product where orders.uid="'+req.session.uid+'" and orders.protype=1'+' and product.id=orders.proid';
  console.log('getOrder',req.session.uid);
  if (typeof(req.query.orderState) !='undefined'&&req.query.orderState!='') {
    if (req.query.orderState==-1) {
      querySql+=' and orders.stats!='+2;
    }else {
      querySql+=' and orders.stats='+req.query.orderState;
    }

  }
  querySql+='  order by subtime desc limit  '+(req.query.page-1)*10+',10';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      console.log('error ',result);
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result);
    });
}

sql.getOwnedProducts=function(req,res){
  //var querySql='select cus_buy_pro.amount,product.caption,product.id,product_risklevel.name as riskName,product_series.name as seriesName from cus_buy_pro,product,product_risklevel,product_series where cus_buy_pro.uid="'+req.session.uid+'" and cus_buy_pro.proid=product.id and product.risklevelid=product_risklevel.id and product.seriesid= product_series.id';
  var querySql = '';
  querySql += 'select t1.amount,t2.caption,t3.name as riskName,t4.name as seriesName from cus_buy_pro t1,product t2';
  // querySql += ' left join product t2 on t2.id = t1.proid';
  querySql += ' left join product_risklevel t3 on t3.id = t2.risklevelid ';
  querySql += ' left join product_series t4 on t4.id = t2.seriesid  ';
  querySql += ' where t1.uid = "'+req.session.uid+'" and t2.id = t1.proid and t1.protype=1';

  if(typeof( req.query.pageRows)!='undefined'&&typeof( req.query.page)!='undefined'){
    querySql+=' limit '+(req.query.page-1)*req.query.pageRows+','+req.query.pageRows+'';
  }
  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result);
    });
}

sql.getOwnedProductAmount=function(req,res){
  var querySql='select count(cus_buy_pro.uid) as productAmount from cus_buy_pro,product where cus_buy_pro.protype=1 and cus_buy_pro.uid="'+req.session.uid+'" and product.id=cus_buy_pro.proid';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result[0]);
    });
}

sql.setOrderState=function(req,res){
  var querySql = 'update orders set stats='+req.query.orderState+' where oid='+req.query.orderID+' and uid="'+req.session.uid+'"';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      console.log('error ',result);
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result);
    });
}

sql.getAllOrderState=function(req,res){
  var querySql ='select * from orstate';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      console.log('error ',result);
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result);
    });
}

sql.getOrderAmount = function(req,res) {
	var querySql="select count(oid) as orderAmount  from orders where protype=1" +' and uid="'+req.session.uid+'"';

  if (typeof(req.query.orderState) !='undefined'&&req.query.orderState!='') {
    // querySql+=' and stats='+req.query.orderState;
    if (req.query.orderState==-1) {
      querySql+=' and orders.stats!='+2;
    }else {
      querySql+=' and orders.stats='+req.query.orderState;
    }
  }

	csp.db.query(querySql,function(err,result){
		if(err){
			return {'result':false};
		}
		console.log(querySql,result,result.length);
		return $util.jsonWrite(res,result[0]);
	});
}



module.exports = sql;
