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
var productViewDao= require('../dao/productViewDao');

router.post('/getProductDetails', function(req, res){

  productViewDao.getProductDetails(req, res);
});

router.post('/getTactics', function(req, res){

  productViewDao.getTactics(req, res);
});

router.post('/getRiskLevelInfo', function(req, res){

  productViewDao.getRiskLevelInfo(req, res);
});

router.post('/getSeriesInfo', function(req, res){

  productViewDao.getSeriesInfo(req, res);
});

router.post('/getFutures', function(req, res){

  productViewDao.getFutures(req, res);
});


router.post('/getAllTactics', function(req, res){

  productViewDao.getAllTactics(req, res);
});

router.post('/getAllProductSeries', function(req, res){

  productViewDao.getAllProductSeries(req, res);
});

router.post('/getAllProRiskLevel', function(req, res){

  productViewDao.getAllProRiskLevel(req, res);
});

router.post('/getProducts', function(req, res){

  productViewDao.getProducts(req, res);
});

router.post('/getProductsByFilter', function(req, res){

  productViewDao.getProductsByFilter(req, res);
});

router.post('/getCardsProduct', function(req, res){

  productViewDao.getCardsProduct(req, res);
});

router.post('/getProductLatestNet', function(req, res){

  productViewDao.getProductLatestNet(req, res);
});

router.post('/getProductsWithLatestNet', function(req, res){

  productViewDao.getProductsWithLatestNet(req, res);
});

router.post('/getProductsByFilterWithLatestNet', function(req, res){

  productViewDao.getProductsByFilterWithLatestNet(req, res);
});

router.post('/setProductID', function(req, res){

  req.session.productID=req.query.productID;
  res.send({result:true});
  res.end();
});

router.post('/getProductID', function(req, res){

  res.send({productID:req.session.productID});
  res.end();
});

router.post('/getProductSpot', function(req, res){

  productViewDao.getProductSpot(req, res);

});

router.post('/getNetProduct', function(req, res){

  productViewDao.getNetProduct(req, res);

});

router.post('/getNetAssetValue', function(req, res){

  productViewDao.getNetAssetValue(req, res);

});

router.post('/getProductAmount', function(req, res){

  productViewDao.getProductAmount(req, res);

});


router.post('/getProductNotices', function(req, res){

  productViewDao.getProductNotices(req, res);

});

module.exports = router;
