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
var multiparty = require('multiparty');
var fs = require('fs');
var uploadDao = require('../dao/uploadDao');
router.post('/fileload', function(req, res, next){
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: './app/files/'});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        if(err) {
            res.send({"state":"FAILED",'url':''});
            res.end();
        }
        else {
            var inputFile = files.logo[0];
            var uploadedPath = inputFile.path;
            req.query.uploadedPath = uploadedPath;
            uploadDao.renameImage(req,res);
        }
        // console.log("上传文件",files,fields);
        // res.send({'url':'files/img_1.jpg','state':'SUCCESS'});
        // res.end();
    })
});

router.get('/imgload',function(req,res) {
    res.send({
        'imageActionName': '../',
        'imageFieldName': 'logo',
        'imageMaxSize': 2048000,
        'imageAllowFiles':[".png", ".jpg", ".jpeg", ".bmp"],
        'imageCompressEnable': 1,
        'imageCompressBorder': 100,
        'imageInsertAlign': 'none'
    })
    res.end();
})

router.post('/multiplefileload',function(req,res) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: './app/files/'});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        console.log(files);
        res.send();
        res.end;
    })
})

module.exports = router;
