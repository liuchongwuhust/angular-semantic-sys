
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
var productViewDao0= require('../dao/productViewDao0');

router.post('/getProductDetails', function(req, res){

  productViewDao0.getProductDetails(req, res);
});

router.post('/getTactics', function(req, res){

  productViewDao0.getTactics(req, res);
});

router.post('/getRiskLevelInfo', function(req, res){

  productViewDao0.getRiskLevelInfo(req, res);
});

router.post('/getSeriesInfo', function(req, res){

  productViewDao0.getSeriesInfo(req, res);
});

router.post('/getFutures', function(req, res){

  productViewDao0.getFutures(req, res);
});

router.post('/getAllTactics', function(req, res){

  productViewDao0.getAllTactics(req, res);
});

router.post('/getAllProductSeries', function(req, res){

  productViewDao0.getAllProductSeries(req, res);
});

router.post('/getAllProRiskLevel', function(req, res){

  productViewDao0.getAllProRiskLevel(req, res);
});

router.post('/getProducts', function(req, res){

  productViewDao0.getProducts(req, res);
});

router.post('/getProductsByFilter', function(req, res){

  productViewDao0.getProductsByFilter(req, res);
});

router.post('/getCardsProduct', function(req, res){

  productViewDao0.getCardsProduct(req, res);
});

router.post('/getProductsByFilterWithLatestNet', function(req, res){

  productViewDao0.getProductsByFilterWithLatestNet(req, res);
});

router.post('/getProductLatestNet', function(req, res){

  productViewDao0.getProductLatestNet(req, res);
});



router.post('/setProductID', function(req, res){

  req.session.productID0=req.query.productID;
  res.send({result:true});
  res.end();
});

router.post('/getProductID', function(req, res){

  res.send({productID:req.session.productID0});
  res.end();
});

router.post('/getProductSpot', function(req, res){

  productViewDao0.getProductSpot(req, res);

});

router.post('/getNetProduct', function(req, res){

  productViewDao0.getNetProduct(req, res);

});

router.post('/getNetAssetValue', function(req, res){

  productViewDao0.getNetAssetValue(req, res);

});

router.post('/getProductAmount', function(req, res){

  productViewDao0.getProductAmount(req, res);

});

router.post('/getProductNotices', function(req, res){

  productViewDao0.getProductNotices(req, res);

});


module.exports = router;
