/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

var express = require('express');
var router = express.Router();

var commentDao= require('../dao/comment');
var multiparty = require('multiparty');
var fs = require('fs');


router.get('/selectopionbymodule',function(req,res) {
    if(typeof(req.session.uid) !== "undefined"){
        commentDao.selectOpionByModule(req,res);
    } //刷新session时间

});
router.get('/getreplysbytid',function(req,res) {
    if(typeof(req.session.uid) !== "undefined"){
        commentDao.getReplysByTid(req,res);
    }//刷新session时间
});
router.post('/addreply',function(req,res) {
    if(typeof(req.session.uid) !== "undefined"){
        commentDao.addReply(req,res);
    }//刷新session时间
});
router.get('/selectopionbyversion',function(req,res) {
    if(typeof(req.session.uid) !== "undefined"){
        commentDao.selectOpionByVersion(req,res);
    }//刷新session时间
});
router.post('/fileload', function(req, res, next){
    //生成multiparty对象，并配置上传目标路径
    if(typeof(req.session.uid) !== "undefined"){
        var form = new multiparty.Form({uploadDir: './app/files/'});
        //上传完成后处理
        form.parse(req, function(err, fields, files) {
            var filesTmp = JSON.stringify(files,null,2);
            if(err) {
                res.send({"result":"failed"});
                res.end();
            }
            else {
                var inputFile = files.file[0];
                var uploadedPath = inputFile.path;
                req.query.uploadedPath = uploadedPath;
                commentDao.renameImage(req,res);
            }
        })
    }//刷新session时间
});

router.post('/deletefile',function(req,res) {
    if(typeof(req.session.uid) !== "undefined"){
        if(req.query.count === "0") {}
        else if (req.query.count === "1") {
            fs.unlinkSync("./app/"+req.query.filepath);
        }
        else {
            for(var i = 0; i< req.query.filepath.length; i++) {
                fs.unlinkSync("./app/"+req.query.filepath[i]);
            }
        }
        res.send({"result":"succeed"});
        res.end();
    }//刷新session时间
})

router.post('/addopion',function(req,res) {
    if(typeof(req.session.uid) !== "undefined"){
        commentDao.addOpion(req,res);
    }//刷新session时间
})
router.post('/addlike',function(req,res) {
    if(typeof(req.session.uid) !== "undefined"){
        commentDao.addLike(req,res);
    }//刷新session时间
})
router.post('/cancellike',function(req,res) {
    if(typeof(req.session.uid) !== "undefined"){
        commentDao.cancelLike(req,res);
    }//刷新session时间
})
module.exports = router;
