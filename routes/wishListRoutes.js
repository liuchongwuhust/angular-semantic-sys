
var express = require('express');
var router = express.Router();
var wishListDao= require('../dao/wishListDao');


router.get('/getTidModel', function(req, res){
  console.log("getTidModel")
  wishListDao.getTidModel(req, res);
});


router.get('/getUnitStocks', function(req, res){
  console.log("getUnitStocks")
  wishListDao.getUnitStocks(req, res);
});


router.post('/submitWishList', function(req, res){
  console.log("submitWishList")
  wishListDao.submitWishList(req, res);
});



router.get('/getGroupBpValue', function(req, res){
  console.log("getGroupBpValue")
  wishListDao.getGroupBpValue(req, res);
});


router.get('/getGroupWishList', function(req, res){
  console.log("getGroupWishList")
  wishListDao.getGroupWishList(req, res);
});
module.exports = router;
