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
 // var m_async = require('async');
 var dbHelper=require('../dao/dbroutinedao');
 var sql = {};

 sql.createGroup = function(req,res) {
   console.log('createGroup',req.query.gname,req.query.gdesc);
   var customers=req.query.customers;
   var querySql = 'select gid from group_info where gname="'+req.query.gname+'"';

   console.log(querySql);
   csp.db.query(querySql,function(err,result){
     if(err){
       return ;
     }
     if (result.length>0) {
       return $util.jsonWrite(res,{'result':false,'reason':'该分组已存在,请使用其他名字重试'});
     }
     querySql = 'insert into group_info (gname,gdesc) values ("'+req.query.gname+'","'+req.query.gdesc+'")';
     console.log(querySql);
     csp.db.query(querySql,function(err,insResult){
       if(err){
         return;
       }
       if (customers.length==0) {
         return $util.jsonWrite(res,{'result':true});
       }
       console.log('insert 分组成功');

       querySql = 'select gid from group_info where gname="'+req.query.gname+'"';
       console.log(querySql);
       csp.db.query(querySql,function(err,selResult){
         if(err){
           return;
         }
         if (selResult.length!=1) {
           return $util.jsonWrite(res,{'result':false,'reason':'创建分组失败,请重试'});
         }
         console.log('查询 分组id成功');
         querySql ='insert into customer_group values ';
         for (var i = 0; i < customers.length; i++) {
           querySql+='('+selResult[0].gid+','+customers[i]+'),';
         }
         querySql=querySql.substring(0,querySql.length-1);

         console.log(customers,querySql);
         csp.db.query(querySql,function(err,insertGCResult){
           if(err){
             return;
           }
           return $util.jsonWrite(res,{'result':true});
         });

       });
     });

   });

 	// 	querySql = 'insert into group_info (gname,gdesc) values ("'+req.query.gname+'","'+req.query.gdesc+'")';
 	// 	console.log("querySql",querySql);
 	 //  csp.db.query(querySql,function(err,result){
 	// 		if(err){
 	// 			return;
 	// 		}
 	// 		return $util.jsonWrite(res,{'result':true});
 	 //  });


 }

 // sql.saveEditGroup = function(req,res) {
 //   console.log(req.query.delCustomers,req.query.addCustomers);
 //
 //    m_async.series([
 //      function(callback1) {
 //        if (typeof req.query.delCustomers=='undefined') {
 //          callback1();
 //        }
 //        else {
 //          var querySql1 ='';
 //          var delstr='';
 //
 //          for (var i = 0; i < req.query.delCustomers.length; i++) {
 //            delstr+='customerid='+ req.query.delCustomers[i]+' or ';
 //          }
 //
 //          if (delstr.length) {
 //            delstr=delstr.substring(0,delstr.length-3);
 //            querySql1='delete from customer_group where gid = '+req.query.gid+' and ('+delstr+')';
 //          }
 //          else {
 //            callback1();
 //          }
 //          console.log(querySql1);
 //          csp.db.query(querySql1,function(err1,info1) {
 //            callback1(err1,info1);
 //          });
 //        }
 //
 //
 //      },
 //      function(callback2) {
 //        console.log('callback2',req.query.addCustomers);
 //        //如果没有要增加的话,就直接返回了
 //        if (typeof req.query.addCustomers=='undefined') {
 //          callback2();
 //        }else {
 //          var querySql2 = 'insert into customer_group values ';
 //          console.log('req.query.addCustomers.length',req.query.addCustomers.length);
 //          for (var i = 0; i < req.query.addCustomers.length; i++) {
 //            querySql2+='('+req.query.gid+','+req.query.addCustomers[i]+'),';
 //          }
 //          querySql2=querySql2.substring(0,querySql2.length-1);
 //
 //
 //          console.log(querySql2);
 //          csp.db.query(querySql2,function(err2,info2) {
 //            callback2(err2,info2);
 //          });
 //        }
 //
 //
 //      }
 //    ],function(err,result) {
 //      if(err) {
 //        csp.db.rollback();
 //        res.send({"result":false});
 //        res.end();
 //      }
 //      else {
 //        csp.db.commit();
 //        res.send({"result":true});
 //        res.end();
 //      }
 //    });
 // }

 sql.saveEditGroup = function(req,res) {
   console.log(req.query.delCustomers,req.query.addCustomers);
  var tasks=[];

   var querySql1 ='';
   var delstr='';

   if (req.query.delLength!=0) {
     if (req.query.delLength ===1) {
       delstr+='customerid='+ req.query.delCustomers+' or ';
     }else {
       for (var i = 0; i < req.query.delLength; i++) {
         delstr+='customerid='+ req.query.delCustomers[i]+' or ';
       }
     }
     if (delstr.length) {
       delstr=delstr.substring(0,delstr.length-3);
       querySql1='delete from customer_group where gid = '+req.query.gid+' and ('+delstr+')';
       tasks.push(querySql1);
     }
   }

   if (req.query.addLength!=0) {
     var querySql2 = 'insert into customer_group values ';

     if (req.query.addLength===1) {
       querySql2+='('+req.query.gid+','+req.query.addCustomers+'),';

     }else {
       for (var i = 0; i < req.query.addLength; i++) {
         querySql2+='('+req.query.gid+','+req.query.addCustomers[i]+'),';
       }
     }
     //因为没有数据不会传进来
     querySql2=querySql2.substring(0,querySql2.length-1);

     tasks.push(querySql2);
   }

   if (tasks.length===0) {
     res.send({result:true});
     res.end();
     console.log('tasks.length===0');
     return;
   }



   console.log('tasks',tasks);
   dbHelper.executeSqlTrans(tasks,function(err,result){
       console.log('executeSqlTrans',err,'result',result);
       if (err) {
         res.send({result:false,reason:'写数据库失败!'});
         res.end();
       }else {
         res.send({result:true});
         res.end();
       }

   });
 }

 // sql.removeGroup = function(req,res) {
 //
 //    m_async.series([
 //  		function(callback1) {
 //  			var querySql1 = 'delete from group_info where gid = '+req.query.gid;
 //        console.log(querySql1);
 //  			csp.db.query(querySql1,function(err1,info1) {
 //  				callback1(err1,info1);
 //  			});
 //  		},
 //  		function(callback2) {
 //  			var querySql2 = 'delete from customer_group where gid = '+req.query.gid;
 //        console.log(querySql2);
 //  			csp.db.query(querySql2,function(err2,info2) {
 //  				callback2(err2,info2);
 //  			});
 //  		}
 //  	],function(err,result) {
 //  		if(err) {
 //  			csp.db.rollback();
 //  			res.send({"result":false});
 //  			res.end();
 //  		}
 //  		else {
 //  			csp.db.commit(function(err){
 //          if (err) {
 //            csp.db.rollback();
 //      			res.send({"result":false});
 //      			res.end();
 //            return;
 //          }
 //          res.send({"result":true});
 //    			res.end();
 //        });
 //
 //  		}
 //  	});
 // }

 sql.removeGroup = function(req,res) {


   var querySql1 = 'delete from group_info where gid = '+req.query.gid;
   var querySql2 = 'delete from customer_group where gid = '+req.query.gid;

   var tasks=[querySql1,querySql2];

   dbHelper.executeSqlTrans(tasks,function(err,result){
       console.log('executeSqlTrans',err,'result',result);
       if (err) {
         res.send({result:false,reason:'写数据库失败!'});
         res.end();
       }else {
         res.send({result:true});
         res.end();
       }

   });

 }

 sql.getAllGroup = function(req,res) {
 		var querySql = 'select gid,gname,gdesc,(select count(gid) from customer_group where customer_group.gid=group_info.gid) as customerAmount from group_info';
 		console.log("querySql",querySql);
 	  csp.db.query(querySql,function(err,result){
 			if(err){
 				return;
 			}
 			console.log(result,result.length,typeof result);

 			return $util.jsonWrite(res,result);
 	  });
 }

 sql.getUngroupedAmount = function(req,res) {
 		var querySql ='SELECT count(customerid) as customerAmount FROM customer WHERE customerid NOT IN (SELECT customerid FROM customer_group) ';
 		console.log("querySql",querySql);
 	  csp.db.query(querySql,function(err,result){
 			if(err){
 				return;
 			}
 			console.log(result,result.length,typeof result);

 			return $util.jsonWrite(res,result[0]);
 	  });
 }


 sql.getGroupinfo = function(req,res) {
   var querySql = 'select * from group_info where gid='+req.query.gid;

 		console.log("querySql",querySql);
 	  csp.db.query(querySql,function(err,result){
 			if(err){
 				return;
 			}
 			console.log(result,result.length,typeof result);

 			return $util.jsonWrite(res,result[0]);
 	  });
 }

 sql.getCustomers = function(req,res) {
   if (req.query.gid==-1) {
     var querySql ='SELECT *,-1 as gid FROM customer WHERE customerid NOT IN (SELECT customerid FROM customer_group) ';
   }else {
     var querySql = 'select * from customer_group,customer where gid='+req.query.gid+' and customer_group.customerid=customer.customerid';
   }

 		console.log("querySql",querySql,req.query.gid);
 	  csp.db.query(querySql,function(err,result){
 			if(err){
 				return;
 			}
 			console.log(result,result.length,typeof result);

 			return $util.jsonWrite(res,result);
 	  });
 }


 sql.getCustomersFromID = function(req,res) {
   if (req.query.single) {
     var querySql ='select * from customer where customerid='+req.query.customerIDs;
   }else {
     var customerIDs='';
     for (var i = 0; i < req.query.customerIDs.length; i++) {
       customerIDs+="'"+req.query.customerIDs[i]+"',";
     }
     customerIDs=customerIDs.substring(0,customerIDs.length-1);

     var querySql = 'select * from customer where customerid in ('+customerIDs+')';
   }

     console.log("querySql",querySql,'getCustomersFromID');
     csp.db.query(querySql,function(err,result){
       if(err){
         return;
       }
       console.log(result,result.length,typeof result);

       return $util.jsonWrite(res,result);
     });
 }

 sql.addNewCustomerSure = function(req,res) {

   var tname = req.query.tname;
   var tel = req.query.tel;
   var email = req.query.email;
   var querySql = 'insert into customer (customer_type,tel,email,tname) values ("1","'+tel+'","'+email+'","'+tname+'")';
   console.log(querySql);
 	  csp.db.query(querySql,function(err,result){
 			if(err){
 				return;
 			}

 			return $util.jsonWrite(res,result);
 	  });
 }
 sql.editCustomerSure = function(req,res) {

   var customerid = req.query.customerid;
   var tname = req.query.tname;
   var tel = req.query.tel;
   var email = req.query.email;
   var querySql = 'update customer set tel = "'+tel+'",email="'+email+'",tname="'+tname+'" where customerid='+customerid;
   console.log(querySql);
    csp.db.query(querySql,function(err,result){
      if(err){
        console.log("err",err)
        return;
      }
      console.log("修改确定成功")
      console.log("修改",result)
      return $util.jsonWrite(res,result);
    });
 }

 sql.deleteCustomerGroupInfo = function(req,res){
   var gid = req.query.gid;
   var customerid = req.query.customerid;
   var querySql = 'delete  from customer_group where customerid = "'+customerid+'" and gid = "'+gid+'"';
   console.log("111111111111",querySql)
   csp.db.query(querySql,function(err,result){
     if(err){
       return;
     }
     return $util.jsonWrite(res,result);
   })

 }

 sql.delCustomer = function(req,res){

   var customerid = req.query.customerid;
   var querySql = 'delete  from customer where customerid = "'+customerid+'"';
   var querySql1 = 'delete  from customer_group where customerid = "'+customerid+'"';

   csp.db.query(querySql,function(err,result){
     if(err){
       return;
     }
     csp.db.query(querySql1,function(err,result1){
       if(err){
         return;
       }
        return $util.jsonWrite(res,result);
     })

   })

 }


 sql.addNewCustomerGroup = function(req,res) {
   console.log(req.query)
   var gid = req.query.gid;
   var customerid = req.query.customerid;
   var querySql = 'insert into customer_group (gid,customerid) values ("'+gid+'","'+customerid+'")';
   console.log(querySql);
 	  csp.db.query(querySql,function(err,result){
 			if(err){
 				return;
 			}

 			return $util.jsonWrite(res,result);
 	  });
 }

 sql.getNewestCustomerid = function(req,res){
   var querySql='select max(customerid) as id from customer';
   csp.db.query(querySql, function(err, result){
     if(err){
       return;
     }
      return $util.jsonWrite(res, result[0]);
   })
 }
 sql.getEditCustomerInfo = function(req, res){
   var customerid = req.query.customerid;
   var querySql = 'select * from customer where customerid = '+customerid;
   csp.db.query(querySql, function(err, result){
     if(err){
       return;
     }
    return $util.jsonWrite(res, result[0]);
   })
 }
 sql.getEditCustomerGroupInfo = function(req, res){
   var customerid = req.query.customerid;
   var querySql = 'select gid from customer_group where customerid = '+customerid;
   csp.db.query(querySql, function(err, result){
     if(err){
       return;
     }
     console.log('llllll',result)
    return $util.jsonWrite(res, result);
   })
 }

 sql.getSpecialGroupCus = function(req, res){
   var gid = req.query.gid;

   var querySql ='select a.customerid, a.tname,a.tel,a.email,d.gname from (select * from customer where customerid in (select customerid from customer_group where gid = "'+gid+'")) as a left join (select b.gid,b.customerid,c.gname from customer_group b, group_info c where b.gid=c.gid)as d on a.customerid=d.customerid order by customerid'

   console.log("ggggggggggg", querySql);
   csp.db.query(querySql, function(err, result0){
     if(err){
       return;
     }
     var result1=[];


     var string=JSON.stringify(result0);
     var result =  JSON.parse(string);


     if(result.length){
       if(result.length==1){
         result1[0]=result[0];
       }else{
         result1[0]=result[0];
         for(var i=1,j=0;i<result.length;i++){
           if(result1[j].customerid==result[i].customerid){
             if(result[i].gname){
               if(result1[j].gname){
                 result1[j].gname = result1[j].gname+','+result[i].gname;
               }else{
                    result1[j].gname = result1[j].gname+result[i].gname;
               }
             }
           }else {
            j=j+1;
            result1[j]=result[i];
           }
         }

       }
     }
    console.log(result1);

    return $util.jsonWrite(res, result1);
   })
 }



 sql.getCustomerInfo = function(req, res){
   var querySql = 'select a.customerid, a.tname,a.tel,a.email,d.gname from customer a left join (select b.gid,b.customerid,c.gname from customer_group b, group_info c where b.gid=c.gid)as d on a.customerid=d.customerid order by customerid'
   csp.db.query(querySql, function(err, result0){
     if(err){
       return;
     }
     var result1=[];


     var string=JSON.stringify(result0);
     var result =  JSON.parse(string);


     if(result.length){
       if(result.length==1){
         result1[0]=result[0];
       }else{
         result1[0]=result[0];
         for(var i=1,j=0;i<result.length;i++){
           if(result1[j].customerid==result[i].customerid){
             if(result[i].gname){
               if(result1[j].gname){
                 result1[j].gname = result1[j].gname+','+result[i].gname;
               }else{
                    result1[j].gname = result1[j].gname+result[i].gname;
               }
             }
           }else {
            j=j+1;
            result1[j]=result[i];
           }
         }

       }
     }
    console.log(result1);
     return $util.jsonWrite(res, result1);
   })
 }

module.exports = sql;
