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
                var retPath = "files/img_"+result[0].seed+"."+kind;
                //重命名为真实文件名
                fs.rename(uploadedPath, dstPath, function(err){
                    if(err) {
                        res.send({"state":"FAILED",'url':''});
                        res.end();
                    }
                    else {
                        res.send({'url':retPath,'state':'SUCCESS'});
                        res.end();
                    }
                })
			}
			else {
                res.send({"state":"FAILED",'url':''});
                res.end();
			}
		}
	})
}

module.exports =  sql;
