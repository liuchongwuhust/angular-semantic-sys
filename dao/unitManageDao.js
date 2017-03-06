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

sql.getValidAssetUnit=function(req,res){
  var querySql = 'select csp_tacap.id as tacapid,csp_tacap.maid,caid, caname,csp_tacap.stat as tacapstat,csp_tamgr.id as tamgrid,maname,csp_tamgr.stat as tamgrstat from csp_tacap,csp_tamgr where csp_tamgr.maid=csp_tacap.maid and csp_tamgr.stat=0';
  // var querySql = 'select * from product';

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

sql.getTotalAssetUnit=function(req,res){
  var querySql = 'select * from csp_tacap ';
  // var querySql = 'select * from product';

  console.log(querySql);
  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result);
    });
}


sql.getAssetUnitFromCapManager=function(req,res){
  var querySql = 'select * from csp_tacap where maid="'+req.query.maid+'"';
  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result);
    });
}

sql.getAllValidCapManager=function(req,res){
  var querySql = 'select * from csp_tamgr where stat=0';

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

sql.getAllCapManager=function(req,res){
  var querySql = 'select * from csp_tamgr';

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


sql.saveEditAssetManager=function(req,res){
  var querySql = 'update csp_tamgr set maname="'+req.query.maname+'",stat="'+req.query.stat+'" where maid="'+req.query.maid+'"';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{'result':true});
    });
}

sql.createAssetManager=function(req,res){
  var querySql = 'insert into csp_tamgr (maid,maname,stat) values("'+req.query.maid+'","'+req.query.maname+'","'+req.query.stat+'")';

      csp.db.query(querySql,function(err,result){
        console.log(querySql,result);
        if(err){
          console.log(result);
          return $util.jsonWrite(res,{'result':false,'reason':'编号冲突,请使用其他编号'});
          }

          var obj={};
          obj.result=true;
          obj.id=result.insertId;
          obj.maid=req.query.maid;

          return $util.jsonWrite(res,obj);
        });
}

sql.saveEditAssetUnit=function(req,res){
  var querySql = 'update csp_tacap set caname="'+req.query.caname+'",stat="'+req.query.stat+'" where caid="'+req.query.caid+'"';

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

sql.createAssetUnit=function(req,res){
  var querySql = 'insert into csp_tacap (maid,caid,caname,stat) values("'+req.query.maid+'","'+req.query.caid+'","'+req.query.caname+'","'+req.query.stat+'")';

      csp.db.query(querySql,function(err,result){
        console.log(querySql,result);
        if(err){
          return $util.jsonWrite(res,{'result':false,'reason':'编号冲突,请使用其他编号'});
          }

          var obj={};
          obj.result=true;
          obj.maid=req.query.maid
          obj.caid=req.query.caid;
          return $util.jsonWrite(res,obj);
        });
}

sql.saveEditTradeUnit=function(req,res){
  var querySql = 'update csp_tatrd set trname="'+req.query.trname+'",stat="'+req.query.stat+'" where trid="'+req.query.trid+'"';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{'result':true});
    });
}

sql.createTradeUnit=function(req,res){
  var querySql = 'insert into csp_tatrd (maid,caid,trid,trname,stat) values("'+req.query.maid+'","'+req.query.caid+'","'+req.query.trid+'","'+req.query.trname+'","'+req.query.stat+'")';

      csp.db.query(querySql,function(err,result){
        console.log(querySql,result);
        if(err){
          return $util.jsonWrite(res,{'result':false,'reason':'编号冲突,请使用其他编号'});
          }

          var obj={};
          obj.result=true;
          obj.trid=req.query.trid;
          return $util.jsonWrite(res,obj);

        });
}


sql.getTransUnitFromAssetUnit=function(req,res){
  var querySql ='select t1.id,t1.maid,t1.maname,t1.stat from csp_tatrd t1 where caid="'+req.query.caid+'" order by maid';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      console.log(result);
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result);
    });
}

sql.getAllAssetUnits=function(req,res){
  var querySql ='select t1.id,t1.maid,t1.caid,t1.caname,t1.stat from csp_tacap t1 order by caid';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result);
    });
}


sql.getAllAssetTraders=function(req,res){
  var querySql ='select t1.id,t1.maid,t1.caid,t1.trid,t1.trname,t1.stat from csp_tatrd t1 order by trid';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result);
    });
}


sql.getAllAssetManagers=function(req,res){
  var querySql ='select * from csp_tamgr';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,result);
    });
}

sql.frozenAssetManager=function(req,res){
  var querySql ='update csp_tamgr set stat="1" where maid="'+req.query.maid+'"';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{'result':true});
    });
}

sql.frozenAssetUnit=function(req,res){
  var querySql ='update csp_tacap set stat="1" where caid="'+req.query.caid+'"';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{'result':true});
    });
}

sql.frozenTradeUnit=function(req,res){
  var querySql ='update csp_tatrd set stat="1" where trid="'+req.query.trid+'"';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{'result':true});
    });
}


sql.unfreezeAssetManager=function(req,res){
  var querySql ='update csp_tamgr set stat="0" where maid="'+req.query.maid+'"';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{'result':true});
    });
}

sql.unfreezeAssetUnit=function(req,res){
  var querySql ='update csp_tacap set stat="0" where caid="'+req.query.caid+'"';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{'result':true});
    });
}

sql.unfreezeTradeUnit=function(req,res){
  var querySql ='update csp_tatrd set stat="0" where trid="'+req.query.trid+'"';

  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);
    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      return $util.jsonWrite(res,{'result':true});
    });
}

sql.getNewManagerid=function(req,res){
  var querySql ='select max(id)+1 as newMaid from csp_tamgr';
  csp.db.query(querySql,function(err,result){
    console.log(querySql,result);

    if(err){
      return $util.jsonWrite(res,{'result':false});
      }

      var maid=1;
      if(result.length==0||result[0].newMaid===null){
        maid=1;
      }
      else {
        maid=result[0].newMaid;
      }

      return $util.jsonWrite(res,{'result':true,'maid':maid});
  });
}

  sql.getNewCaid=function(req,res){
    var querySql ='select max(id)+1 as newCaid from csp_tacap';
    csp.db.query(querySql,function(err,result){
      console.log(querySql,result);

      if(err){
        return $util.jsonWrite(res,{'result':false});
        }

        var caid=req.query.maid+'.';
        if(result.length==0||result[0].newCaid===null){
          caid+='1';
        }
        else {
          caid+=result[0].newCaid;
        }

        return $util.jsonWrite(res,{'result':true,'caid':caid});
    });
  }

    sql.getNewTrid=function(req,res){
      var querySql ='select max(id)+1 as newTrid from csp_tatrd';
      csp.db.query(querySql,function(err,result){
        console.log(querySql,result);

        if(err){
          return $util.jsonWrite(res,{'result':false});
          }

          var trid=req.query.caid+'.';
          if(result.length==0||result[0].newTrid===null){
            trid+='1';
          }
          else {
            trid+=result[0].newTrid;
          }

          return $util.jsonWrite(res,{'result':true,'trid':trid});
      });
    }

    // sql.getFilterUnit=function(req,res){
    //   var querySql ='select t1.*,t2 from csp_tatrd t1 ';
    //   querySql += ' inner join csp_tacap t2 on t2.caid = t1.caid ';
    //   querySql += ' inner join csp_tamgr t3 on t3.maid = t1.maid ';
    //   querySql += ' where trid like "%'+req.query.filterStr+'%" or trname like "%'++req.query.filterStr++'"%';
    //
    //
    //
    //   csp.db.query(querySql,function(err,result){
    //     console.log(querySql,result);
    //
    //     if(err){
    //       return $util.jsonWrite(res,{'result':false});
    //       }
    //
    //       return $util.jsonWrite(res,result);
    //   });
    // }



module.exports = sql;
