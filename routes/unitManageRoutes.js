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
var unitManageDao= require('../dao/unitManageDao');

router.post('/getValidAssetUnit', function(req, res){
  unitManageDao.getValidAssetUnit(req, res);
});

router.post('/getTotalAssetUnit', function(req, res){
  unitManageDao.getTotalAssetUnit(req, res);
});

router.post('/getAssetUnitFromCapManager', function(req, res){
  unitManageDao.getAssetUnitFromCapManager(req, res);
});

router.post('/getAllValidCapManager', function(req, res){
  unitManageDao.getAllValidCapManager(req, res);
});

router.post('/getAllCapManager', function(req, res){
  unitManageDao.getAllCapManager(req, res);
});

router.post('/saveEditAssetManager', function(req, res){
  unitManageDao.saveEditAssetManager(req, res);
});

router.post('/createAssetManager', function(req, res){
  unitManageDao.createAssetManager(req, res);
});

router.post('/saveEditAssetUnit', function(req, res){
  unitManageDao.saveEditAssetUnit(req, res);
});

router.post('/createAssetUnit', function(req, res){
  unitManageDao.createAssetUnit(req, res);
});

router.post('/saveEditTradeUnit', function(req, res){
  unitManageDao.saveEditTradeUnit(req, res);
});

router.post('/createTradeUnit', function(req, res){
  unitManageDao.createTradeUnit(req, res);
});

router.post('/getTransUnitFromAssetUnit', function(req, res){
  unitManageDao.getTransUnitFromAssetUnit(req, res);
});

router.post('/getAllAssetManagers', function(req, res){
  unitManageDao.getAllAssetManagers(req, res);
});

router.post('/getAllAssetUnits', function(req, res){
  unitManageDao.getAllAssetUnits(req, res);
});

router.post('/getAllAssetTraders', function(req, res){
  unitManageDao.getAllAssetTraders(req, res);
});

router.post('/frozenAssetManager', function(req, res){
  unitManageDao.frozenAssetManager(req, res);
});

router.post('/frozenAssetUnit', function(req, res){
  unitManageDao.frozenAssetUnit(req, res);
});

router.post('/frozenTradeUnit', function(req, res){
  unitManageDao.frozenTradeUnit(req, res);
});

router.post('/unfreezeAssetManager', function(req, res){
  unitManageDao.unfreezeAssetManager(req, res);
});

router.post('/unfreezeAssetUnit', function(req, res){
  unitManageDao.unfreezeAssetUnit(req, res);
});

router.post('/unfreezeTradeUnit', function(req, res){
  unitManageDao.unfreezeTradeUnit(req, res);
});

router.post('/getNewManagerid', function(req, res){
  unitManageDao.getNewManagerid(req, res);
});


router.post('/getNewCaid', function(req, res){
  unitManageDao.getNewCaid(req, res);
});


router.post('/getNewTrid', function(req, res){
  unitManageDao.getNewTrid(req, res);
});




module.exports = router;
