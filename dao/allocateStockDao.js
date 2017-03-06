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


sql.getModel=function(req,res){
  var maid = req.query.maid;
  var querySql = "select a.trid, a.caid, a.trname, b.caname from csp_tatrd a, csp_tacap b where a.`caid` = b.`caid` and  a.`maid` = '"+ maid+"' ORDER BY a.trid";
  console.log(querySql)

  csp.db.query(querySql,function(err,data){

    if(err){

      console.log("errrrrr",err);
      return $util.jsonWrite(res,err);

    }else{

      var length = data.length

      var model = []
      var caidPre = ''
      var tridPre = ''

      var indexCaid = -1
      var indexAcid = -1

      for(var i=0; i<length; i++){
          if(caidPre !== data[i].caid){
              indexCaid++
              caidPre = data[i].caid

              var itemCaid = {caid:'', caname: '', title:'', children:[]}
              itemCaid.caid = data[i].caid
              itemCaid.caname = data[i].caname
              itemCaid.title = data[i].caname + "(" + itemCaid.caid + ")"
              model[indexCaid] = itemCaid
              indexAcid = -1
          }

          indexAcid++
          var itemTrid = {trid:'', trname: '', title:''}
          itemTrid.trid = data[i].trid
          itemTrid.trname = data[i].trname
          itemTrid.title = data[i].trname + "(" + itemTrid.trid + ")"
          model[indexCaid].children[indexAcid] = itemTrid
      }
          // console.log("modelllll",model);
          return $util.jsonWrite(res,model);
    }


    });
}


sql.getTidModel=function(req,res){
  var trid = req.query.trid;
  var querySql = "select gid,gname from csp_group where trid = '"+trid+"' order by gid"
  console.log(querySql)

  csp.db.query(querySql,function(err,data){

    if(err){

      console.log("errrrrr",err);
      return $util.jsonWrite(res,err);

    }else{
      var length = data.length
       var model = []
       var tidPre = ''
       var indexTid = -1
       for (var i = 0; i < length; i++) {
           if (tidPre !== data[i].gid) {
               indexTid++
               tidPre = data[i].gid
               var itemTid = {
                   tid: '',
                   tname: '',
                   title:''
               }
               itemTid.tid = data[i].gid
               itemTid.tname = data[i].gname
               itemTid.title = data[i].gname + "(" + itemTid.tid + ")"
               model[indexTid] = itemTid

           }
       }
      return $util.jsonWrite(res,model);
      }
    });
}
sql.teamsInfo = function(req, res){


  /*
  select c.gname,a.gid,b.trname,group_concat(b.oname) as memberName, count(1) as memberNumber, sum(b.cbp)as bp_max from csp_tradergroup a inner join (

  select d.trname, b.*,c.oname,bp*bp_heaver cbp from csp_tstrader b
  inner join csp_tsoper c on b.oid = c.oid
  inner join csp_tatrd d on b.trid=d.trid where d.trid = '1.1.2'

) b on a.traderid = b.traderid inner join csp_group c on a.gid = c.gid group by gid

  */
  var trid = req.query.trid;
  var querySql = "select c.gname,a.gid,b.trname,group_concat(b.oname) as memberName,count(1) as memberNumber, sum(b.cbp)as bp_max from csp_tradergroup a inner join (  select d.trname,b.*,c.oname,bp*bp_heaver cbp from csp_tstrader b inner join csp_tsoper c on b.oid = c.oid  inner join csp_tatrd d on b.trid=d.trid where d.trid = '"+trid+"') b on a.traderid = b.traderid inner join csp_group c on a.gid = c.gid group by gid"

 csp.db.query(querySql, function(err,result){
   if(err){
     console.log("errrrrr",err);
     return $util.jsonWrite(res,err);
   }else{
     return $util.jsonWrite(res,result);
   }
 })


}

sql.getTradersNotInTeams = function(req,res){
  var trid = req.query.trid;
  var querySql ="select a.traderid,a.oid,a.bp,a.bp_heaver,b.oname from csp_tstrader as a left join csp_tsoper as b on a.oid = b.oid  where a.traderid not in (select traderid from csp_tradergroup) and a.trid ='"+trid+"'";
    console.log(querySql)
    csp.db.query(querySql,function(err,data){
      if(err){

        console.log("errrrrr",err);
        return $util.jsonWrite(res,err);

      }else{

            return $util.jsonWrite(res,data);
      }


    })

}

sql.getTeamTraders = function(req,res){
  var gid = req.query.gid;
  var querySql = "SELECT * FROM csp_tradergroup where gid = '"+gid+"'"
    console.log(querySql)
    csp.db.query(querySql,function(err,data){
      if(err){

        console.log("errrrrr",err);
        return $util.jsonWrite(res,err);

      }else{

            return $util.jsonWrite(res,data);
      }


    })

}


sql.delGid = function(req,res){
  var gid = req.query.gid;
  var querySql = "delete from csp_group where gid = '"+gid+"'"
    console.log(querySql)
    csp.db.query(querySql,function(err,data){
      if(err){

        console.log("errrrrr",err);
        return $util.jsonWrite(res,err);

      }else{

            var querySql1 = "delete from csp_tradergroup where gid = '"+gid+"'"
            csp.db.query(querySql1, function(err, data){
              if(err){

                console.log("errrrrr",err);
                return $util.jsonWrite(res,err);
            }else{
                return $util.jsonWrite(res,data);
            }
        })
     }
  })
}
sql.getTradersForEdit = function(req,res){
  var trid = req.query.trid;
  var gid = req.query.gid;
  var querySql ="select a.traderid,a.oid,a.bp,a.bp_heaver,b.oname from csp_tstrader as a left join csp_tsoper as b on a.oid = b.oid  where a.traderid not in (select traderid from csp_tradergroup where gid != '"+gid+"') and a.trid ='"+trid+"'";
    console.log(querySql)
    csp.db.query(querySql,function(err,data){
      if(err){

        console.log("errrrrr",err);
        return $util.jsonWrite(res,err);

      }else{

            return $util.jsonWrite(res,data);
      }


    })

}
sql.addNewTeam = function(req,res){
  var trid = req.query.trid;
  var gname = req.query.gname;
  var traderid = req.query.traderid;
  var leaderid = req.query.leaderid;
  var length = req.query.traderLength;

  var querySql = "insert into csp_group (trid,gname) values ('"+trid+"','"+gname+"')"
  console.log(querySql);
  csp.db.query(querySql,function(err,data){
    var querySql2 = "select max(gid) as gid from csp_group"

    csp.db.query(querySql2,function(err,data){
      var gid = data[0].gid;



      if(length==1){
        var leader = 1;
        var querySql1 = "insert into csp_tradergroup (gid, traderid, leader) values('"+gid+"','"+traderid+"','"+leader+"')"
      }else if (length>1) {

         var idx = traderid.indexOf(leaderid);

         var querySql1 =  "insert into csp_tradergroup (gid, traderid, leader) values";
         for(var i=0;i<traderid.length;i++){
           var leader = 0;
           if(i == idx){
             leader = 1;
           }
           if(i ==0 ){
             querySql1 = querySql1+"('"+gid+"','"+traderid[i]+"','"+leader+"')"
           }else{
             querySql1 = querySql1+",('"+gid+"','"+traderid[i]+"','"+leader+"')"
           }

         }
      }


      console.log('iiiiii', querySql1)
      csp.db.query(querySql1, function(err,data){
        if(err){
            return $util.jsonWrite(res,err);
        }else{
          return $util.jsonWrite(res,data);
        }
      })
    })


    })


}

sql.editTeamConfirm = function(req,res){
  var trid = req.query.trid;
  var gname = req.query.gname;
  var gid =req.query.gid;
  var traderid = req.query.traderid;
  var leaderid = req.query.leaderid;
  var length = req.query.traderLength;

  var querySql = "update csp_group set gname = '"+gname+"' where gid = '"+gid+"'"
  console.log(querySql);
  csp.db.query(querySql,function(err,data){
    var querySql2 = "delete from csp_tradergroup where gid = '"+gid+"'"

    csp.db.query(querySql2,function(err,data){

      if(length==1){
        var querySql1 = "insert into csp_tradergroup (gid, traderid, leader) values ('"+gid+"','"+traderid+"','"+leader+"')"
      }else if (length>1) {

         var idx = traderid.indexOf(leaderid);

         var querySql1 =  "insert into csp_tradergroup (gid, traderid, leader) values";
         for(var i=0;i<traderid.length;i++){
           var leader = 0;
           if(i == idx){
             leader = 1;
           }
           if(i ==0 ){
             querySql1 = querySql1+"('"+gid+"','"+traderid[i]+"','"+leader+"')"
           }else{
             querySql1 = querySql1+",('"+gid+"','"+traderid[i]+"','"+leader+"')"
           }

         }
      }


      console.log('iiiiii', querySql1)
      csp.db.query(querySql1, function(err,data){
        if(err){
            return $util.jsonWrite(res,err);
        }else{
          return $util.jsonWrite(res,data);
        }
      })
    })


    })


}
module.exports = sql;
