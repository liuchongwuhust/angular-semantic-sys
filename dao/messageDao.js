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


sql.getAllMessage=function(req,res){
  var querySql = 'select * from message_info';

  console.log(querySql);
  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      console.log(result);
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result);
    });
}

sql.saveCreateMessage=function(req,res){
  var querySql = 'insert into message_info (msgid,mname,mcontent) value("'+req.query.msgid+'","'+req.query.mname+'","'+req.query.mcontent+'")';

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


sql.saveEditMessage=function(req,res){
  var querySql = 'update message_info set msgid="'+req.query.msgid+'",mname="'+req.query.mname+'",mcontent= "'+req.query.mcontent+'" where id='+req.query.id;

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      console.log(result);
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{'result':true});
    });
}

sql.deleteMessage=function(req,res){
  var querySql = 'delete from message_info where id="'+req.query.id+'"';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      console.log(result);
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{'result':true});
    });
}


module.exports = sql;
