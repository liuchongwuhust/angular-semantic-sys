
var express = require('express');
var router = express.Router();
var randomDao= require('../dao/randomDao');


router.get('/getWishTid', function(req, res){
  console.log("getWishTid")
  randomDao.getWishTid(req, res);
});


router.post('/unitRandmDiv', function(req, res){
  console.log("unitRandmDiv")
  randomDao.unitRandmDiv(req, res);
});

router.post('/deleResults', function(req, res){
  console.log("deleResults")
  randomDao.deleResults(req, res);
});


router.post('/writeResults', function(req, res){
  console.log("writeResults")
  randomDao.writeResults(req, res);
});


router.post('/writeSec', function(req, res){
  console.log("writeSec")
  randomDao.writeSec(req, res);
});


router.post('/recoverStock', function(req, res){
  console.log("recoverStock")
  randomDao.recoverStock(req, res);
});

router.get('/noWishList', function(req, res){
  console.log("noWishList")
  randomDao.noWishList(req, res);
});

router.post('/deleWishList', function(req, res){
  console.log("deleWishList")
  randomDao.deleWishList(req, res);
});

router.get('/getRandmR', function(req, res){
  console.log("getRandmR")
  randomDao.getRandmR(req, res);
});



router.get('/randomOver', function(req, res){
  console.log("randomOver")
  randomDao.randomOver(req, res);
});

router.get('/getTname', function(req, res){
  console.log("getTname")
  randomDao.getTname(req, res);
});


router.get('/getInfobyGid', function(req, res){
  console.log("getInfobyGid")
  randomDao.getInfobyGid(req, res);
});

router.get('/exportExcel/:id', function(req, res){
  console.log("saveTidExcelFile")
  randomDao.saveTidExcelFile(req, res);
});
module.exports = router;
