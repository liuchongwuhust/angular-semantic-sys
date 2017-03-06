
var express = require('express');
var router = express.Router();
var allocateStockDao= require('../dao/allocateStockDao');


router.get('/getModel', function(req, res){
  console.log("getModelDao")
  allocateStockDao.getModel(req, res);
});
router.get('/getTeams', function(req, res){
  console.log("getTeams")
  allocateStockDao.getTeams(req, res);
});



router.get('/getTradersNotInTeams', function(req, res){
  console.log("getTradersNotInTeams")
  allocateStockDao.getTradersNotInTeams(req, res);
});

router.post('/addNewTeam', function(req, res){
  console.log("addNewTeam")
  allocateStockDao.addNewTeam(req, res);
});


router.get('/teamsInfo', function(req, res){
  console.log("teamsInfo")
  allocateStockDao.teamsInfo(req, res);
});



router.get('/getTradersForEdit', function(req, res){
  console.log("getTradersForEdit")
  allocateStockDao.getTradersForEdit(req, res);
});


router.get('/getTeamTraders', function(req, res){
  console.log("getTeamTraders")
  allocateStockDao.getTeamTraders(req, res);
});


router.post('/editTeamConfirm', function(req, res){
  console.log("editTeamConfirm")
  allocateStockDao.editTeamConfirm(req, res);
});


router.post('/delGid', function(req, res){
  console.log("delGid")
  allocateStockDao.delGid(req, res);
});
module.exports = router;
