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
var customerGroupDao= require('../dao/customerGroupDao');

var multiparty = require('multiparty');
var fs = require('fs');
var xlsx = require('node-xlsx');
var iconv = require('iconv-lite');

router.post('/createGroup', function(req, res){
  console.log("createGroup");
  customerGroupDao.createGroup(req, res);
});

router.post('/saveEditGroup', function(req, res){
  console.log("saveEditGroup");
  customerGroupDao.saveEditGroup(req, res);
});

router.post('/removeGroup', function(req, res){
  console.log("removeGroup");
  customerGroupDao.removeGroup(req, res);
});

router.post('/getAllGroup', function(req, res){
  console.log("getAllGroup");
  customerGroupDao.getAllGroup(req, res);
});

router.post('/getUngroupedCustomers', function(req, res){
  console.log("getUngroupedCustomers");
  customerGroupDao.getUngroupedCustomers(req, res);
});

router.post('/getUngroupedAmount', function(req, res){
  console.log("getUngroupedAmount");
  customerGroupDao.getUngroupedAmount(req, res);
});


router.post('/getGroupinfo', function(req, res){
  console.log("getGroupinfo");
  customerGroupDao.getGroupinfo(req, res);
});

router.post('/getCustomers', function(req, res){
  console.log("getCustomers");
  customerGroupDao.getCustomers(req, res);
});

router.post('/getCustomersFromID', function(req, res){
  console.log("getCustomersFromID");
  customerGroupDao.getCustomersFromID(req, res);
});

router.get('/getCustomerInfo', function(req, res){
  console.log("getCustomerInfo");
  customerGroupDao.getCustomerInfo(req, res);
});

router.post('/addNewCustomerSure', function(req, res){
  console.log("addNewCustomerSure");
  customerGroupDao.addNewCustomerSure(req, res);
});

router.post('/addNewCustomerGroup', function(req, res){
  console.log("addNewCustomerGroup");
  customerGroupDao.addNewCustomerGroup(req, res);
});


router.get('/getNewestCustomerid', function(req, res){
  console.log("getNewestCustomerid");
  customerGroupDao.getNewestCustomerid(req, res);
});

router.get('/getEditCustomerInfo', function(req, res){
  console.log("getEditCustomerInfo");
  customerGroupDao.getEditCustomerInfo(req, res);
});

router.get('/getEditCustomerGroupInfo', function(req, res){
  console.log("getEditCustomerGroupInfo");
  customerGroupDao.getEditCustomerGroupInfo(req, res);
});

router.post('/editCustomerSure', function(req, res){
  console.log("editCustomerSure");
  customerGroupDao.editCustomerSure(req, res);
});


router.post('/deleteCustomerGroupInfo', function(req, res){
  console.log("deleteCustomerGroupInfo");
  customerGroupDao.deleteCustomerGroupInfo(req, res);
});

router.post('/delCustomer', function(req, res){
  console.log("delCustomer");
  customerGroupDao.delCustomer(req, res);
});


router.get('/getSpecialGroupCus', function(req, res){
  console.log("getSpecialGroupCus");
  customerGroupDao.getSpecialGroupCus(req, res);
});

router.post('/customerImport',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        var form = new multiparty.Form({uploadDir: './app/temp/'});
        var parseData = [];
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
				        var filekindarr = uploadedPath.split(".");
                var kind = filekindarr[filekindarr.length -1].toLowerCase();


				if(kind === "csv") {
					var fileStr = fs.readFileSync(uploadedPath, {encoding:'binary'});
    				var buf = new Buffer(fileStr, 'binary');
    				var str = iconv.decode(buf, 'GBK');
    				var rows =str.split("\r\n");
            console.log("rows",rows);

				    for(var j=0;j<rows.length;j++){
				        if(rows[j]=='')
				        rows.splice(j,1);
				    }
            console.log("rows.length",rows.length);
					 if(rows.length > 1) {
						  var cvsData = []
						  for(var k = 0; k < rows.length; k ++) {
							var rData = [];
							rData = rows[k].split(",");
							cvsData[k] = rData;
						 }
						if(cvsData[0][0] === "姓名" && cvsData[0][1] === "手机号" && cvsData[0][2] === "邮件地址") {
							var cvsjson = [];
							for(var m = 1; m < cvsData.length; m ++) {
								var nets = {};
								nets.tname = cvsData[m][0];
								nets.tel= cvsData[m][1];
								nets.email = cvsData[m][2];
								cvsjson[m-1] = nets;
							}

							res.send({"result":"succeed","file":true,"data":cvsjson});
			                res.end();
						}
						else {
              console.log("shuju",cvsData);
							res.send({"result":"succeed","file":false});
			                res.end();
						}
					}
					else {
						res.send({"result":"succeed","file":false});
		                res.end();
					}
					fs.unlinkSync(uploadedPath);
				}
				else {
					var obj = xlsx.parse(uploadedPath);
					var xlsData = obj[0].data;
					console.log(xlsData);
          console.log(xlsData.length,xlsData[0][0] =="姓名",xlsData[0][1] == "手机号" ,xlsData[0][2] =="邮件地址");
					if(xlsData.length > 1) {
						if(xlsData[0][0] =="姓名" && xlsData[0][1] == "手机号" && xlsData[0][2] =="邮件地址") {
							var xlsjson = [];
							for(var i = 1; i < xlsData.length; i ++) {
								var nets = {};
								nets.tname = xlsData[i][0];
								nets.tel = xlsData[i][1];
								nets.email = xlsData[i][2];
								xlsjson[i-1] = nets;
							}

							res.send({"result":"succeed","file":true,"data":xlsjson});
			                res.end();
						}
						else {
							res.send({"result":"succeed","file":false});
			                res.end();
						}
					}
					else {
						res.send({"result":"succeed","file":false});
		                res.end();
					}
					fs.unlinkSync(uploadedPath);
				}
            }
        })
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

module.exports = router;
