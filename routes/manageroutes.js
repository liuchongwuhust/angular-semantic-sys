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

var manageDao = require('../dao/manageDao');
var multiparty = require('multiparty');
var fs = require('fs');
var xlsx = require('node-xlsx');
var iconv = require('iconv-lite');

router.post('/addproduct',function(req,res){
	if(typeof(req.session.uid) !== "undefined"){
        return manageDao.addProduct(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.post('/updateproduct',function(req,res){
	if(typeof(req.session.uid) !== "undefined"){
        return manageDao.updateProduct(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.post('/addtactics',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.addTactics(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.get('/getalltactics',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getAllTactics(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.post('/deletetactics',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.deleteTactics(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.post('/updatetactics',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.updateTactics(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.get('/getallproduct',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getAllProduct(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.get('/getnetbyproductid',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getNetByProductId(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.post('/deleteproduct',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.deleteProduct(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

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
                manageDao.renameImage(req,res);
            }
        })
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
});

router.post('/deletefile',function(req,res) {
    if(typeof(req.session.uid) !== "undefined"){
        fs.unlinkSync("./app/"+req.query.filepath);
        res.send({"result":"succeed"});
        res.end();
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/addsinglenet',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.addSingleNet(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/deletesinglenet',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.deleteSingleNet(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/updatesinglenet',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.updateSingleNet(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/importloadfile',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        var form = new multiparty.Form({uploadDir: './app/temp/'});
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
                //打开uploadPath
				if(kind === "csv") {
					var fileStr = fs.readFileSync(uploadedPath, {encoding:'binary'});
    				var buf = new Buffer(fileStr, 'binary');
    				var str = iconv.decode(buf, 'GBK');
    				var rows =str.split("\r\n");
					//排除EXCEL保存CSV文件时最后带空字符
				    for(var j=0;j<rows.length;j++){
				        if(rows[j]=='')
				        rows.splice(j,1);
				    }
					if(rows.length > 1) {
						var cvsData = []
						for(var k = 0; k < rows.length; k ++) {
							var rData = [];
							rData = rows[k].split(",");
							cvsData[k] = rData;
						}
						if(cvsData[0][1] === "净值" && cvsData[0][2] === "累计净值" && cvsData[0][3] === "收益率" && cvsData[0][4] === "年化收益率" && cvsData[0][0] === "日期") {
							var cvsjson = [];
							for(var m = 1; m < cvsData.length; m ++) {
								var nets = {};
								nets.net = cvsData[m][1];
								nets.totalnet = cvsData[m][2];
								nets.accrate = cvsData[m][3];
								nets.yearrate = cvsData[m][4];
								nets.date = cvsData[m][0];
								cvsjson[m-1] = nets;
							}
							res.send({"result":"succeed","file":true,"data":cvsjson});
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
				else {
					var obj = xlsx.parse(uploadedPath);
					var xlsData = obj[0].data;
					if(xlsData.length > 1) {
						if(xlsData[0][1] === "净值" && xlsData[0][2] === "累计净值" && xlsData[0][3] === "收益率" && xlsData[0][4] === "年化收益率" && xlsData[0][0] === "日期") {
							var xlsjson = [];
							for(var i = 1; i < xlsData.length; i ++) {
								var nets = {};
								nets.net = xlsData[i][1];
								nets.totalnet = xlsData[i][2];
								nets.accrate = xlsData[i][3];
								nets.yearrate = xlsData[i][4];
								nets.date = xlsData[i][0];
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

router.post('/importinserttodb',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.importInsertToDb(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.get('/getcheckuser',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getCheckUser(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.get('/getalluser',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getAllUser(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.get('/getmemberlevel',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getMemberLevel(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/changeuserlevel',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.changeUserLevel(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/changeusercheckstate',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.changeUserCheckState(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/checknetexist',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.checkNetExist(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/multipledeletenets',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.multipleDeleteNets(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.get('/getproductdes',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        var path = "./app/" + req.query.contents;
		fs.exists(path,function(exist) {
			if(exist === true) {
				fs.readFile(path,"utf8",function(err,data) {
					res.send({'result':'succeed',"data":data});
					res.end();
				})
			}
			else {
				res.send({'result':'failed'});
				res.end();
			}
		})
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

//模拟产品
router.post('/addanalogProduct',function(req,res){
	if(typeof(req.session.uid) !== "undefined"){
        return manageDao.addanalogProduct(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.post('/updateanalogProduct',function(req,res){
	if(typeof(req.session.uid) !== "undefined"){
        return manageDao.updateanalogProduct(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.post('/addanalogTactics',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.addanalogTactics(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.get('/getallanalogTactics',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getAllanalogTactics(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.post('/deleteanalogTactics',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.deleteanalogTactics(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.post('/updateanalogTactics',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.updateanalogTactics(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.get('/getallanalogproduct',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getAllanalogProduct(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.get('/getanalogNetbyanalogProductid',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getanalogNetByanalogProductId(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.post('/deleteanalogProduct',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.deleteanalogProduct(req,res);
    } //刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.post('/addsingleanalogNet',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.addSingleanalogNet(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/deletesingleanalogNet',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.deleteSingleanalogNet(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/updatesingleanalogNet',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.updateSingleanalogNet(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/importanalogloadfile',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        var form = new multiparty.Form({uploadDir: './app/temp/'});
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
                //打开uploadPath
				if(kind === "csv") {
					var fileStr = fs.readFileSync(uploadedPath, {encoding:'binary'});
    				var buf = new Buffer(fileStr, 'binary');
    				var str = iconv.decode(buf, 'GBK');
    				var rows =str.split("\r\n");
					//排除EXCEL保存CSV文件时最后带空字符
				    for(var j=0;j<rows.length;j++){
				        if(rows[j]=='')
				        rows.splice(j,1);
				    }
					if(rows.length > 1) {
						var cvsData = []
						for(var k = 0; k < rows.length; k ++) {
							var rData = [];
							rData = rows[k].split(",");
							cvsData[k] = rData;
						}
						if(cvsData[0][1] === "净值" && cvsData[0][2] === "累计净值" && cvsData[0][3] === "收益率" && cvsData[0][4] === "年化收益率" && cvsData[0][0] === "日期") {
							var cvsjson = [];
							for(var m = 1; m < cvsData.length; m ++) {
								var analogNets = {};
								analogNets.analogNet = cvsData[m][1];
								analogNets.totalanalogNet = cvsData[m][2];
								analogNets.accrate = cvsData[m][3];
								analogNets.yearrate = cvsData[m][4];
								analogNets.date = cvsData[m][0];
								cvsjson[m-1] = analogNets;
							}
							res.send({"result":"succeed","file":true,"data":cvsjson});
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
				else {
					var obj = xlsx.parse(uploadedPath);
					var xlsData = obj[0].data;
					if(xlsData.length > 1) {
						if(xlsData[0][1] === "净值" && xlsData[0][2] === "累计净值" && xlsData[0][3] === "收益率" && xlsData[0][4] === "年化收益率" && xlsData[0][0] === "日期") {
							var xlsjson = [];
							for(var i = 1; i < xlsData.length; i ++) {
								var analogNets = {};
								analogNets.analogNet = xlsData[i][1];
								analogNets.totalanalogNet = xlsData[i][2];
								analogNets.accrate = xlsData[i][3];
								analogNets.yearrate = xlsData[i][4];
								analogNets.date = xlsData[i][0];
								xlsjson[i-1] = analogNets;
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

router.post('/importinserttodb',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.importInsertToDb(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.get('/getcheckuser',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getCheckUser(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.get('/getalluser',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getAllUser(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.get('/getmemberlevel',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getMemberLevel(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/changeuserlevel',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.changeUserLevel(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/changeusercheckstate',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.changeUserCheckState(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/checkanalogNetexist',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.checkanalogNetExist(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/multipledeleteanalogNets',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.multipleDeleteanalogNets(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.get('/getanalogProductdes',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        var path = "./app/" + req.query.contents;
		fs.exists(path,function(exist) {
			if(exist === true) {
				fs.readFile(path,"utf8",function(err,data) {
					res.send({'result':'succeed',"data":data});
					res.end();
				})
			}
			else {
				res.send({'result':'failed'});
				res.end();
			}
		})
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/importanaloginserttodb',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.importanalogInsertToDb(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})

router.get('/getallorder',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getAllOrder(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/updateorder',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.updateOrder(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.get('/getspot',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getSpot(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/spotloadfile',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
		var form = new multiparty.Form({uploadDir: './app/temp/'});
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
                //打开uploadPath
				if(kind === "csv") {
					var fileStr = fs.readFileSync(uploadedPath, {encoding:'binary'});
    				var buf = new Buffer(fileStr, 'binary');
    				var str = iconv.decode(buf, 'GBK');
    				var rows =str.split("\r\n");
					//排除EXCEL保存CSV文件时最后带空字符
				    for(var j=0;j<rows.length;j++){
				        if(rows[j]=='')
				        rows.splice(j,1);
				    }
					if(rows.length > 1) {
						var cvsData = []
						for(var k = 0; k < rows.length; k ++) {
							var rData = [];
							rData = rows[k].split(",");
							cvsData[k] = rData;
						}
						if(cvsData[0][0] === "日期" && cvsData[0][1] === "股票代码" && cvsData[0][2] === "股票名称" && cvsData[0][3] === "持仓数量" && cvsData[0][4] === "成本价格" && cvsData[0][5] === "收盘价格") {
							var cvsjson = [];
							for(var m = 1; m < cvsData.length; m ++) {
								var spot = {};
								spot.date = cvsData[m][0];
								spot.code = cvsData[m][1];
								spot.cname = cvsData[m][2];
								spot.volume = cvsData[m][3];
								spot.volamt = cvsData[m][4];
								spot.last = cvsData[m][5];
								cvsjson[m-1] = spot;
							}
							res.send({"result":"succeed","file":true,"data":cvsjson});
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
				else {
					var obj = xlsx.parse(uploadedPath);
					var xlsData = obj[0].data;
					if(xlsData.length > 1) {
						if(xlsData[0][0] === "日期" && xlsData[0][1] === "股票代码" && xlsData[0][2] === "股票名称" && xlsData[0][3] === "持仓数量" && xlsData[0][4] === "成本价格" && xlsData[0][5] === "收盘价格") {
							var xlsjson = [];
							for(var i = 1; i < xlsData.length; i ++) {
								var spot = {};
								spot.date = xlsData[i][0];
								spot.code = xlsData[i][1];
								spot.cname = xlsData[i][2];
								spot.volume = xlsData[i][3];
								spot.volamt = xlsData[i][4];
								spot.last = xlsData[i][5];
								xlsjson[i-1] = spot;
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
router.post('/loadspottodb',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.loadSpotToDb(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/spotcheckdate',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.spotCheckDate(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/spotinsertsingledata',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.spotInsertSingleData(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/multipledeletespots',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.multipleDeleteSpots(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/updatespot',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.updateSpot(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.get('/getfutures',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.getFutures(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/futuresinsertsingledata',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.futuresInsertSingleData(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/updatefutures',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.updateFutures(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/multipledeletefutureses',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.multipleDeleteFutureses(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
router.post('/futuresloadfile',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
		var form = new multiparty.Form({uploadDir: './app/temp/'});
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
				var error = false;
                //打开uploadPath
				if(kind === "csv") {
					var fileStr = fs.readFileSync(uploadedPath, {encoding:'binary'});
    				var buf = new Buffer(fileStr, 'binary');
    				var str = iconv.decode(buf, 'GBK');
    				var rows =str.split("\r\n");
					//排除EXCEL保存CSV文件时最后带空字符
				    for(var j=0;j<rows.length;j++){
				        if(rows[j]=='')
				        rows.splice(j,1);
				    }
					if(rows.length > 1) {
						var cvsData = []
						for(var k = 0; k < rows.length; k ++) {
							var rData = [];
							rData = rows[k].split(",");
							cvsData[k] = rData;
						}
						if(!(cvsData[0][0] === "日期"  && cvsData[0][6] === "最新价格" && cvsData[0][7] === "保证金")) {
							error = true;
						}
						if(!(cvsData[0][1] === "合约编码" && cvsData[0][2] === "商品名称" && cvsData[0][3] === "买卖方向" && cvsData[0][4] === "持仓数量" && cvsData[0][5] === "成本价格")) {
							error = true;
						}
						if(error === false) {
							var cvsjson = [];
							for(var m = 1; m < cvsData.length; m ++) {
								var futures = {};
								futures.date = cvsData[m][0];
								futures.code = cvsData[m][1];
								futures.fname = cvsData[m][2];
								futures.dealtype = cvsData[m][3];
								futures.volume = cvsData[m][4];
								futures.volamt = cvsData[m][5];
								futures.last = cvsData[m][6];
								futures.deposit = cvsData[m][7];
								cvsjson[m-1] = futures;
							}
							res.send({"result":"succeed","file":true,"data":cvsjson});
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
				else {
					var obj = xlsx.parse(uploadedPath);
					var xlsData = obj[0].data;
					if(xlsData.length > 1) {
						if(!(xlsData[0][0] === "日期" && xlsData[0][1] === "合约编码" && xlsData[0][2] === "商品名称" && xlsData[0][3] === "买卖方向" )) {
							error = true;
						}
						if(!(xlsData[0][4] === "持仓数量" && xlsData[0][5] === "成本价格" && xlsData[0][6] === "最新价格" && xlsData[0][7] === "保证金")) {
							error = true;
						}
						if(error === false ) {
							var xlsjson = [];
							for(var i = 1; i < xlsData.length; i ++) {
								var futures = {};
								futures.date = xlsData[i][0];
								futures.code = xlsData[i][1];
								futures.fname = xlsData[i][2];
								futures.dealtype = xlsData[i][3];
								futures.volume = xlsData[i][4];
								futures.volamt = xlsData[i][5];
								futures.last = xlsData[i][6];
								futures.deposit = xlsData[i][7];
								xlsjson[i-1] = futures;
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
router.post('/loadfuturestodb',function(req,res) {
	if(typeof(req.session.uid) !== "undefined"){
        manageDao.loadFuturesToDb(req,res);
    }//刷新session时间
	else {
		res.send({'result':'failed'});
		res.end();
	}
})
//获取显示的产品列表
router.get('/getshowproducts',function(req,res) {
	return manageDao.getShowProducts(req,res);
})
//删除显示产品
router.post('/deleteshowproduct',function(req,res) {
	return manageDao.deleteShowProduct(req,res);
})
//添加显示产品
router.post('/addshowproduct',function(req,res) {
	return manageDao.addShowProduct(req,res);
})
//获取所有的系列
router.get('/getallseries',function(req,res) {
	return manageDao.getAllSeries(req,res);
})
//获取分页系列
router.get('/getpageseries',function(req,res) {
	return manageDao.getPageSeries(req,res);
})
//添加系列
router.post('/addseries',function(req,res) {
	return manageDao.addSeries(req,res);
})
//更新系列
router.post('/updateseries',function(req,res) {
	return manageDao.updateSeries(req,res);
})
//删除系列
router.post('/deleteseries',function(req,res) {
	return manageDao.deleteSeries(req,res);
})
//获取分页公告
router.get('/getpagenotices',function(req,res) {
	return manageDao.getPageNotices(req,res);
})
//获取筛选产品
router.get('/getnoticeproduct',function(req,res) {
	return manageDao.getNoticeProduct(req,res);
})
//上传公告附件
router.post('/uploadnoticefile',function(req,res) {
	var form = new multiparty.Form({uploadDir: './app/files/'});
	//上传完成后处理
	form.parse(req, function(err, fields, files) {
		var filesTmp = JSON.stringify(files,null,2);
		if(err) {
			res.send({"result":"failed","reason":"文件上传失败"});
			res.end();
		}
		else {
			var inputFile = files.file[0];
			var uploadedPath = inputFile.path;
			req.query.uploadedPath = uploadedPath;
			return manageDao.uploadNoticeFile(req,res);
		}
	})
})

//创建公告
router.post('/addnotice',function(req,res) {
	return manageDao.addNotice(req,res);
})

//更新公告
router.post('/updatenotice',function(req,res) {
	return manageDao.updateNotice(req,res);
})

//删除公告
router.post('/deletenotice',function(req,res) {
	return manageDao.deleteNotice(req,res);
})

//导入用户上传文件
router.post('/loaduseruploadfile',function(req,res) {
	if(typeof(req.session.uid) != "undefined") {
		var form = new multiparty.Form({uploadDir: './app/temp/'});
        //上传完成后处理
        form.parse(req, function(err, fields, files) {
            var filesTmp = JSON.stringify(files,null,2);
            if(err) {
                res.send({"result":"failed","reason":"文件上传失败"});
                res.end();
            }
            else {
                var inputFile = files.file[0];
                var uploadedPath = inputFile.path;
				var filekindarr = uploadedPath.split(".");
                var kind = filekindarr[filekindarr.length -1].toLowerCase();
                //打开uploadPath
				if(kind === "csv") {
					var fileStr = fs.readFileSync(uploadedPath, {encoding:'binary'});
    				var buf = new Buffer(fileStr, 'binary');
    				var str = iconv.decode(buf, 'GBK');
    				var rows =str.split("\r\n");
					//排除EXCEL保存CSV文件时最后带空字符
				    for(var j=0;j<rows.length;j++){
				        if(rows[j]=='')
				        rows.splice(j,1);
				    }
					if(rows.length > 1) {
						var cvsData = []
						for(var k = 0; k < rows.length; k ++) {
							var rData = [];
							rData = rows[k].split(",");
							cvsData[k] = rData;
						}
						if( cvsData[0][0] === "姓名" && cvsData[0][1] === "手机号码" && cvsData[0][2] === "身份证号" && cvsData[0][3] === "会员等级") {
							var cvsjson = [];
							for(var m = 1; m < cvsData.length; m ++) {
								var user = {};
								user.name = cvsData[m][0];
								user.phone = cvsData[m][1];
								user.idcard = cvsData[m][2];
								user.conlevel = cvsData[m][3];
								cvsjson[m-1] = user;
							}
							res.send({"result":"succeed","file":true,"data":cvsjson});
			                res.end();
						}
						else {
							res.send({"result":"succeed","file":false,"reason":"文件内容格式错误"});
			                res.end();
						}
					}
					else {
						res.send({"result":"succeed","file":false,"reason":"文件内容格式错误"});
		                res.end();
					}
					fs.unlinkSync(uploadedPath);
				}
				else {
					var obj = xlsx.parse(uploadedPath);
					var xlsData = obj[0].data;
					if(xlsData.length > 1) {
						if(xlsData[0][0] === "姓名" && xlsData[0][1] === "手机号码" && xlsData[0][2] === "身份证号" && xlsData[0][3] === "会员等级") {
							var xlsjson = [];
							for(var i = 1; i < xlsData.length; i ++) {
								var user = {};
								user.name = xlsData[i][0];
								user.phone = xlsData[i][1];
								user.idcard = xlsData[i][2];
								user.conlevel = xlsData[i][3];
								xlsjson[i-1] = user;
							}
							res.send({"result":"succeed","file":true,"data":xlsjson});
			                res.end();
						}
						else {
							res.send({"result":"succeed","file":false,"reason":"文件内容格式错误"});
			                res.end();
						}
					}
					else {
						res.send({"result":"succeed","file":false,"reason":"文件内容格式错误"});
		                res.end();
					}
					fs.unlinkSync(uploadedPath);
				}
            }
        })
	}
	else {
		res.send({"result":"failed","reason":"服务器出错了"});
		res.end();
	}
})

//获取简略的用户信息
router.get('/getsimpleuserinfo',function(req,res) {
	if(typeof(req.session.uid) != "undefined"){
        return manageDao.getSimpleUserInfo(req,res);
    } //验证权限
	else {
		res.send({'result':'failed',"reason":"服务器出错了"});
		res.end();
	}
})

//批量导入用户
router.post('/multipleloaduser',function(req,res) {
	if(typeof(req.session.uid) != "undefined"){
        return manageDao.multipleLoadUser(req,res);
    } //验证权限
	else {
		res.send({'result':'failed',"reason":"服务器出错了,请重试或刷新界面"});
		res.end();
	}
})

//获取会员等级表
router.get('/getconlevel',function(req,res) {
	if(typeof(req.session.uid) != "undefined"){
        return manageDao.getConlevel(req,res);
    } //验证权限
	else {
		res.send({'result':'failed',"reason":"服务器出错了"});
		res.end();
	}
})

//获取简单的产品列表
router.get('/getsimpleproducts',function(req,res) {
	if(typeof(req.session.uid) != "undefined"){
        return manageDao.getSimpleProducts(req,res);
    } //验证权限
	else {
		res.send({'result':'failed',"reason":"服务器出错了"});
		res.end();
	}
})

//导入已购产品上传文件
router.post('/loadboughtuploadfile',function(req,res) {
	if(typeof(req.session.uid) != "undefined") {
		var form = new multiparty.Form({uploadDir: './app/temp/'});
        //上传完成后处理
        form.parse(req, function(err, fields, files) {
            var filesTmp = JSON.stringify(files,null,2);
            if(err) {
                res.send({"result":"failed","reason":"文件上传失败"});
                res.end();
            }
            else {
                var inputFile = files.file[0];
                var uploadedPath = inputFile.path;
				var filekindarr = uploadedPath.split(".");
                var kind = filekindarr[filekindarr.length -1].toLowerCase();
                //打开uploadPath
				if(kind === "csv") {
					var fileStr = fs.readFileSync(uploadedPath, {encoding:'binary'});
    				var buf = new Buffer(fileStr, 'binary');
    				var str = iconv.decode(buf, 'GBK');
    				var rows =str.split("\r\n");
					//排除EXCEL保存CSV文件时最后带空字符
				    for(var j=0;j<rows.length;j++){
				        if(rows[j]=='')
				        rows.splice(j,1);
				    }
					if(rows.length > 1) {
						var cvsData = []
						for(var k = 0; k < rows.length; k ++) {
							var rData = [];
							rData = rows[k].split(",");
							cvsData[k] = rData;
						}
						if( cvsData[0][0] === "手机号码" && cvsData[0][1] === "购买金额") {
							var cvsjson = [];
							for(var m = 1; m < cvsData.length; m ++) {
								var bought = {};
								bought.phone = cvsData[m][0];
								bought.amount = cvsData[m][1];
								cvsjson[m-1] = bought;
							}
							res.send({"result":"succeed","file":true,"data":cvsjson});
			                res.end();
						}
						else {
							res.send({"result":"succeed","file":false,"reason":"文件内容格式错误"});
			                res.end();
						}
					}
					else {
						res.send({"result":"succeed","file":false,"reason":"文件内容格式错误"});
		                res.end();
					}
					fs.unlinkSync(uploadedPath);
				}
				else {
					var obj = xlsx.parse(uploadedPath);
					var xlsData = obj[0].data;
					if(xlsData.length > 1) {
						if(xlsData[0][0] === "手机号码" && xlsData[0][1] === "购买金额") {
							var xlsjson = [];
							for(var i = 1; i < xlsData.length; i ++) {
								var bought = {};
								bought.phone = xlsData[i][0];
								bought.amount = xlsData[i][1];
								xlsjson[i-1] = bought;
							}
							res.send({"result":"succeed","file":true,"data":xlsjson});
			                res.end();
						}
						else {
							res.send({"result":"succeed","file":false,"reason":"文件内容格式错误"});
			                res.end();
						}
					}
					else {
						res.send({"result":"succeed","file":false,"reason":"文件内容格式错误"});
		                res.end();
					}
					fs.unlinkSync(uploadedPath);
				}
            }
        })
	}
	else {
		res.send({"result":"failed","reason":"服务器出错了"});
		res.end();
	}
})

router.get('/getrepeatloadbought',function(req,res) {
	if(typeof(req.session.uid) != "undefined"){
        return manageDao.getRepeatLoadBought(req,res);
    } //验证权限
	else {
		res.send({'result':'failed',"reason":"服务器出错了"});
		res.end();
	}
})

router.get('/getpageboughts',function(req,res) {
	if(typeof(req.session.uid) != "undefined"){
		return manageDao.getPageBoughts(req,res);
	} //验证权限
	else {
		res.send({'result':'failed',"reason":"服务器出错了"});
		res.end();
	}
})

router.post('/multipleloadboughts',function(req,res) {
	if(typeof(req.session.uid) != "undefined"){
		return manageDao.multipleLoadBoughts(req,res);
	} //验证权限
	else {
		res.send({'result':'failed',"reason":"您的一键去重效果已失效，继续请再次点击确定导入"});
		res.end();
	}
})

router.post('/updatebought',function(req,res) {
	if(typeof(req.session.uid) != "undefined"){
		return manageDao.updateBought(req,res);
	} //验证权限
	else {
		res.send({'result':'failed',"reason":"服务器出错了"});
		res.end();
	}
})

router.post('/deletebought',function(req,res) {
	if(typeof(req.session.uid) != "undefined"){
		return manageDao.deleteBought(req,res);
	} //验证权限
	else {
		res.send({'result':'failed',"reason":"服务器出错了"});
		res.end();
	}
})

router.get('/getproductrisklevels',function(req,res) {
	if(typeof(req.session.uid) != "undefined"){
		return manageDao.getProductRisklevels(req,res);
	} //验证权限
	else {
		res.send({'result':'failed',"reason":"服务器出错了"});
		res.end();
	}
})

router.get('/getpageproducts',function(req,res) {
	if(typeof(req.session.uid) != "undefined"){
		return manageDao.getPageProducts(req,res);
	} //验证权限
	else {
		res.send({'result':'failed',"reason":"服务器出错了"});
		res.end();
	}
})

module.exports = router;
