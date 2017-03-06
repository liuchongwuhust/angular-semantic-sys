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
var $util = require('../util/util.js')

// var pool = mysql.createPool($util.extend({}, $conf.db))

// var db = require('../config/db.js')

// 数据库数据查询测试
// var sql_marketValue="SELECT cname,code,preclose FROM tscode where  code in (select code from csp_trid_securities where trid='1990.101.101') "
// csp.db.query(sql_marketValue,function(err,value_data){
//  marketValue=value_data;
// console.log("数据库方法测试", JSON.stringify(marketValue));
//
//  })

module.exports = {

  athen: function(req, res) {
    // pool.getConnection(function(err, connection){
       var info = req.query.info;
       var password = req.query.password;
       var name;
       var tel;
       var querySql;
         if((/^1[34578]\d{9}$/.test(info))){
           tel =  info;
           querySql = 'select * from user where tel ="'+tel+'" and pass="'+password+'"'
         } else{
           name = info;
           querySql = 'select * from user where username ="'+name+'" and pass="'+password+'"'
         }
      csp.db.query(querySql,function(err,result){
        console.log(querySql)
        console.log("到数据查询了",JSON.stringify(result));

        // return JSON.stringify(result);
        return $util.jsonWrite(res,result);
        // connection.release();

      })
    // })
  },
  lastLoginTime: function(req,res){

      var uid = req.query.uid;
      req.session.uid=req.query.uid;
      req.session.save();
      var querySql = 'update user set last_logintm = now() where uid= "'+uid+'"'
      csp.db.query(querySql,function(err,result){
          console.log("修改最后登录时间")
          return $util.jsonWrite(res,result);

      })

  }
}

// exports.athen = function(ary, fun){
//   db.query("select * from test_user where name=? and password=?",ary,fun)
// }
