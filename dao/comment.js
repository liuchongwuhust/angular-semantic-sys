/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

var fs = require('fs');
var sql = {};

sql.selectOpionByModule = function(req,res) {
    var modulename = req.query.modulename;
    var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;

    var querySql1 = 'select COUNT(tid) as totalcount from topic where app = "'+modulename+'"';
    csp.db.query(querySql1,function(err1,result1){
        if(err1) {
            res.send({'result':'failed'});
            res.end();
        }
        else {
            var querySql = 'SELECT t1.tid,t1.uid,t1.content,t1.version,t1.imglink,DATE_FORMAT(t1.tm,"%Y-%m-%d %T") as time,t2.username,IFNULL(c.a,0) AS rcount  ,IFNULL(d.b,0) as ucount,IFNULL(e.likeid,-1) as likeid , t3.name as memberlevel FROM topic t1 INNER JOIN  user t2 ON t1.app = "'+modulename+'" AND t1.uid = t2.uid LEFT JOIN ( SELECT tid,COUNT(1) AS a  FROM reply c GROUP BY tid) c ON t1.tid=c.tid LEFT JOIN ( SELECT tid,COUNT(1) AS b  FROM uplike d GROUP BY tid) d ON t1.tid=d.tid LEFT JOIN uplike e ON t1.tid = e.`tid` AND e.uid= "'+req.session.uid+'" LEFT JOIN conlevel t3 on t3.id = t2.conlevel limit ' + start + ',' + pageCount;
            csp.db.query(querySql,function(err,result){
                if(err) {
                    res.send({'result':'failed'});
                    res.end();
                }
                else {
                    console.log(result);
                    res.send({'result':'succeed','data':result,'count':result1[0].totalcount});
                    res.end();
                }
            })
        }
    })
};
sql.getReplysByTid = function(req,res) {
    var tid = req.query.tid;
    var querySql = 'SELECT a.pid,a.content,a.uid,DATE_FORMAT(a.tm,"%Y-%m-%d %T ") as time,IFNULL(b.username,"someone") as rfrom,IFNULL(c.username,"") as rto FROM reply a LEFT JOIN user b  ON a.uid=b.uid LEFT JOIN user c  ON a.reply_to=c.uid where a.tid = '+tid;
    csp.db.query(querySql,function(err,result){
        if(err) {
            res.send({'result':'failed'});
            res.end();
        }
        else {
            console.log(result);
            res.send({'result':'succeed','data':result});
            res.end();
        }
    })
}

sql.addReply = function(req,res) {
    if(typeof(req.session.uid) !== "undefined") {
        var uid = req.session.uid;
        console.log(req.query);
        var tid = req.query.tid;
        var content = req.query.content;
        var reply_to = req.query.reply_to;
        var querySql = 'insert into reply (tid,content,uid,reply_to,anonymous,level,tm) values ('+tid+',"'+content+'","'+uid+'","'+reply_to+'","0","0",now())';
        csp.db.query(querySql,function(err,result){
            if(err) {
                res.send({'result':'failed'});
                res.end();
            }
            else {
                res.send({'result':'succeed'});
                res.end();
            }
        })
    }
}

sql.selectOpionByVersion = function(req,res) {
    var modulename = req.query.modulename;
    var moduleversion = req.query.moduleversion;
    var page = req.query.page;
    var pageCount = req.query.pageCount;
    var start = (page - 1) * pageCount;

    var querySql1 = 'select COUNT(tid) as totalcount from topic where app = "'+modulename+'" and version = "'+moduleversion+'"';
    csp.db.query(querySql1,function(err1,result1){
        if(err1) {
            res.send({'result':'failed'});
            res.end();
        }
        else {
            var querySql = 'SELECT t1.tid,t1.uid,t1.content,t1.imglink,t1.version, t1.tm ,t2.username,IFNULL(c.a,0) as rcount,IFNULL(d.b,0) as ucount,IFNULL(e.likeid,-1) as likeid FROM topic t1 INNER JOIN  user t2 ON t1.app = "'+modulename+'" AND t1.version = "'+moduleversion+'" AND t1.uid = t2.uid LEFT JOIN ( SELECT tid,COUNT(1) AS a  FROM reply c GROUP BY tid) c ON t1.tid=c.tid LEFT JOIN ( SELECT tid,COUNT(1) AS b  FROM uplike d GROUP BY tid) d ON t1.tid=d.tid LEFT JOIN uplike e ON t1.tid = e.`tid` AND e.uid= "'+req.session.uid+'" limit ' + start + ',' + pageCount;
            csp.db.query(querySql,function(err,result){
                if(err) {
                    res.send({'result':'failed'});
                    res.end();
                }
                else {
                    console.log(result);
                    res.send({'result':'succeed','data':result,'count':result1[0].totalcount});
                    res.end();
                }
            })
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
                console.log(kind);
                var dstPath = './app/files/img_' + result[0].seed+"."+kind;
                var retPath = "files/img_"+result[0].seed+"."+kind;
                //重命名为真实文件名
                fs.rename(uploadedPath, dstPath, function(err){
                    if(err) {
                        res.send({"result":"failed"});
                        res.end();
                    }
                    else {
                        res.send({"result":"succeed","piclink":retPath});
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

sql.addOpion = function(req,res) {
    var uid = req.session.uid;
    console.log(req.query);
    var querySql = "insert into topic (content,uid,anonymous,app,imglink,version,tm) values ('"+req.query.content+"','"+uid+"',"+req.query.anonymous+",'"+req.query.app+"','"+req.query.imglink+"','"+req.query.version+"',now())";
    csp.db.query(querySql,function(err,result){
        if(err) {
            res.send({'result':'failed'});
            res.end();
        }
        else {
            res.send({'result':'succeed'});
            res.end();
        }
    })
}

sql.cancelLike = function(req,res) {
    var lkid = req.query.likeid;
    var querySql = 'delete from uplike where likeid = ' +lkid+'';
    csp.db.query(querySql,function(err,result){
        if(err) {
            res.send({'result':'failed'});
            res.end();
        }
        else {
            res.send({'result':'succeed'});
            res.end();
        }
    })
}

sql.addLike = function(req,res) {
    var uid = req.session.uid;
    var tid = req.query.tid;
    var querySql = 'insert into uplike (tid,uid) values ('+tid+',"'+uid+'")';
    csp.db.query(querySql,function(err,result){
        if(err) {
            res.send({'result':'failed'});
            res.end();
        }
        else {
            var idsql = 'select likeid from uplike where tid = '+tid+' and uid = "'+uid+'"';
            csp.db.query(idsql,function(iderr,idresult){
                if(iderr) {
                    res.send({'result':'failed'});
                    res.end();
                }
                else {
                    if(idresult.length > 0 && typeof(idresult[0].likeid) !== "undefined") {
                        res.send({'result':'succeed','likeid':idresult[0].likeid});
                        res.end();
                    }
                    else {
                        res.send({'result':'failed'});
                        res.end();
                    }
                }
            })
        }
    })
}

module.exports = sql;


// var mysql = require('mysql');
// var $conf = require('../config/config.default.json');
//var $util = require('../util/util.js')
//
// var pool = mysql.createPool($util.extend({}, $conf.db))
//
// var db = mysql.createConnection($conf.db);
// module.exports = {
//
//   creatOpion: function(req, res) {
//     // pool.getConnection(function(err, connection){
//       var uid = req.query.uid;
//       var content = req.query.content;
//       var anonymous = req.query.anonymous;
//       var app = req.query.app;
//       var version = req.query.version;
//       var time = req.query.tm;
//
//       var querySql = 'insert into topic (content,uid,anonymous,app,version,tm) value ("'+content+'", "'+uid+'","'+anonymous+'","'
//       +app+'","'+version+'","'+time+'")'
//       csp.db.query(querySql,function(err,result){
//
//         console.log(querySql)
//         console.log("创建了一条评论",JSON.stringify(result));
//
//
//         return $util.jsonWrite(res,result);
//         // connection.release();
//
//       })
//
//     // })
//
//
// },
//
//   opionsDisplay: function(req,res){
//
//     console.log("我进入opionsDisplayl ")
//
//       var querySql = 'SELECT a.tid,a.content,a.tag,a.uid,a.anonymous,a.app,a.nices,a.repcounts,a.version,a.tm, b.username FROM topic a inner join  user b on a.uid=b.uid order by a.tm DESC;'
//       csp.db.query(querySql,function(err,result){
//          if(err) throw err;
//           console.log("拿到意见表")
//           return $util.jsonWrite(res,result);
//
//       })
//
//   },
//   replylist: function(req,res){
//     // pool.getConnection(function(err,connection){
//       var querySql='select * from reply'
//       csp.db.query(querySql, function(err,result){
//         return $util.jsonWrite(res,result);
//       // connection.release();
//       })
//     // })
//   },
//   likeClick: function(req, res){
//     // pool.getConnection(function(err, connection){
//       var tid = req.query.tid;
//       var uid = req.query.likeInfo;
//       var querySql = 'insert into uplike (tid, uid) value ("'+tid+'","'+uid+'");'
//       console.log(querySql)
//       csp.db.query(querySql, function(err,result){
//         return $util.jsonWrite(res,result);
//       // connection.release();
//       })
//     // })
//   },
//   likeAdd: function(req, res){
//     // pool.getConnection(function(err, connection){
//       var tid=req.query.tid;
//       var querySql = 'update topic set nices=nices+1 where tid = "'+tid+'"'
//       console.log(querySql)
//       csp.db.query(querySql, function(err, result){
//         return $util.jsonWrite(res,result);
//       // connection.release();
//       })
//     // })
//   },
//   likeQuery: function(req,res){
//     // pool.getConnection(function(err, connection){
//       var tid = req.query.tid;
//       var  querySql = 'select nices from topic where tid = "'+tid+'"'
//       console.log(querySql);
//       csp.db.query(querySql, function(err, result){
//         return  $util.jsonWrite(res,result);
//         // connection.release();
//       })
//     // })
//   },
//   replyCounts: function(req,res){
//     // pool.getConnection(function(err, connection){
//       var tid = req.query.tid;
//       var  querySql = 'select repcounts from topic where tid = "'+tid+'"'
//       console.log(querySql);
//       csp.db.query(querySql, function(err, result){
//         return  $util.jsonWrite(res,result);
//         // connection.release();
//       })
//     // })
//   },
//   usernameQuery: function(req,res){
//     // pool.getConnection(function(err, connection){
//       var uid = req.query.uid;
//       var  querySql = 'select username from user where uid = "'+uid+'"'
//       console.log(querySql);
//       csp.db.query(querySql, function(err, result){
//         return  $util.jsonWrite(res,result);
//         // connection.release();
//       })
//     // })
//   },
//   reply: function(req, res){
//     // pool.getConnection(function(err, connection){
//
//       var tid = req.query.tid;
//       var uid = req.query.uid;
//       var content = req.query.content;
//       var anonymous = req.query.anonymous;
//       var reply_to = req.query.reply_to;
//       var time = req.query.tm;
//       var level = req.query.level;
//
//       var querySql = 'insert into reply (tid, content, uid, anonymous, reply_to, tm, level) value ("'+tid+'", "'+content+'","'+uid+'","'
//       +anonymous+'","'+reply_to+'","'+time+'","'+level+'")'
//       csp.db.query(querySql,function(err,result){
//
//         console.log(querySql)
//         console.log("创建了一条评论",JSON.stringify(result));
//
//
//         return $util.jsonWrite(res,result);
//         // connection.release();
//
//       })
//
//   // })
// },
// replyAdd: function(req, res){
//   // pool.getConnection(function(err, connection){
//     var tid=req.query.tid;
//     var querySql = 'update topic set repcounts=repcounts+1 where tid = "'+tid+'"'
//     console.log(querySql)
//     csp.db.query(querySql, function(err, result){
//       return $util.jsonWrite(res,result);
//     // connection.release();
//     })
//   // })
// },
// showReply: function(req, res){
//   // pool.getConnection(function(err, connection){
//     var tid=req.query.tid;
//     var querySql = 'select * from reply where tid = "'+tid+'"'
//     console.log(querySql)
//     csp.db.query(querySql, function(err, result){
//       var replylist = [];
//
//       return $util.jsonWrite(res,result);
//     // connection.release();
//     })
//   // })
// },
// }
