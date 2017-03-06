/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

var express = require('express');
var router = express.Router();
var tradeUnitStockDao= require('../dao/tradeUnitStockDao');

var multiparty = require('multiparty');
var fs = require('fs');
var xlsx = require('node-xlsx');
var iconv = require('iconv-lite');


router.post('/getStocksByTrade', function(req, res){
  tradeUnitStockDao.getStocksByTrade(req, res);
});

router.post('/importStock', function(req, res){
  tradeUnitStockDao.importStock(req, res);
});

router.post('/saveEditStock', function(req, res){
  tradeUnitStockDao.saveEditStock(req, res);
});

router.post('/createStock', function(req, res){
  tradeUnitStockDao.createStock(req, res);
});



router.post('/delStock', function(req, res){
  tradeUnitStockDao.delStock(req, res);
});


router.post('/getStockAmountByTrade', function(req, res){
  tradeUnitStockDao.getStockAmountByTrade(req, res);
});


router.post('/loadStockFile', function(req, res){
  var form = new multiparty.Form({uploadDir: './app/temp/'});

  form.parse(req, function(err, fields, files) {
    console.log(err,'err',fields,'fields',files,'files');
    if(err) {
        res.send({"result":false,'reason':'上传文件失败'});
        res.end();
    }
    else {
      var inputFile = files.file[0];
      var uploadedPath = inputFile.path;//上传文件的完成路径,包括后缀
      var excelData= getXlsxData(uploadedPath);

      console.log(excelData.length,excelData[0].length);
      if (excelData.length>0&&excelData[0].length<3) {
        res.send({"result":false,'reason':'上传文件内容错误'});
        res.end();
      }
      res.send(excelData);
      res.end();
    }

  });
});


router.post('/loadStockFileAndImport', function(req, res){
  var form = new multiparty.Form({uploadDir: './app/temp/'});

  form.parse(req, function(err, fields, files) {
    console.log(err,'err',fields,'fields',files,'files');
    if(err) {
        res.send({"result":false,'reason':'上传文件失败'});
        res.end();
    }
    else {
      var inputFile = files.file[0];
      var uploadedPath = inputFile.path;//上传文件的完成路径,包括后缀
      var excelData= getXlsxData(uploadedPath);

      console.log(excelData.length,excelData[0].length);
      if (excelData.length>0&&excelData[0].length<3) {
        res.send({"result":false,'reason':'上传文件内容错误'});
        res.end();
      }
      req.query.stocks=[];
      var nowDate=new Date();
      nowDate=nowDate.getFullYear()+'-'+nowDate.getMonth()+'-'+nowDate.getDate();
      for (var i = 0; i < excelData.length; i++) {
        var obj={};
        obj.cid= excelData[i][0];
        obj.cname= excelData[i][1];
        obj.totalsa= excelData[i][2];
        obj.allocatedsa=0;
        obj.stat=0;
        obj.importdate=nowDate;
        obj.trid=req.query.trid;
        req.query.stocks.push(obj);
      }
      console.log(req.query.stocks);
      tradeUnitStockDao.importStock(req, res);


    }

  });
});

//xlsxFileName完成路径,用于获取所有表格的数据,不包括第一行
function getXlsxData(xlsxFileName){
  var xlsxPath=xlsxFileName;
  // path.join(process.cwd(),'app',xlsxFileName);
  console.log(xlsxPath);

  var lastPoint=xlsxFileName.lastIndexOf('.');
  if (lastPoint==-1) {
    fs.unlinkSync(xlsxFileName);
    return;
  }
  var filenameSubffix=xlsxFileName.substring(lastPoint+1,xlsxFileName.length);
  if (filenameSubffix=='xlsx'||filenameSubffix=='xls') {
    var obj = xlsx.parse(xlsxPath);
    var xlsxData = obj[0].data;
    console.log(xlsxData);

  }else if (filenameSubffix=='csv') {
    var xlsxData =[];
    var fileStr = fs.readFileSync(xlsxPath, {encoding:'binary'});
    var buf = new Buffer(fileStr, 'binary');
    var str = iconv.decode(buf, 'GBK');
    var rows =str.split("\r\n");
    //排除EXCEL保存CSV文件时最后带空字符
    for(var j=0;j<rows.length;j++){
        if(rows[j]=='')
        rows.splice(j,1);
    }
    if(rows.length > 1) {
      for(var k = 0; k < rows.length; k ++) {
        var rData = [];
        rData = rows[k].split(",");
        xlsxData[k] = rData;
      }
      console.log('csv 表格数据',xlsxData);
    }else {
      fs.unlinkSync(xlsxFileName);
      return;
    }
  }
  else {
    fs.unlinkSync(xlsxFileName);
    return;
  }

  xlsxData.splice(0,1);//xlsxData保存的第一条数据需要去除
  fs.unlinkSync(xlsxFileName);

  return xlsxData;
}




module.exports = router;
