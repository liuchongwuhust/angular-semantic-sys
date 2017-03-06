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
var orderDao= require('../dao/orderDao');

router.post('/submitOrder', function(req, res){
  orderDao.submitOrder(req, res);
});

router.post('/getOrder', function(req, res){
  orderDao.getOrder(req, res);
});

router.post('/getOwnedProducts', function(req, res){
  orderDao.getOwnedProducts(req, res);
});

router.post('/getOwnedProductAmount', function(req, res){
  orderDao.getOwnedProductAmount(req, res);
});

router.post('/setOrderState', function(req, res){
  orderDao.setOrderState(req, res);
});

router.post('/getOrderAmount', function(req, res){
  orderDao.getOrderAmount(req, res);
});

router.post('/getAllOrderState', function(req, res){
  orderDao.getAllOrderState(req, res);
});

module.exports = router;
