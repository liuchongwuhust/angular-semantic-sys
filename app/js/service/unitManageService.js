/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */


cspServices.factory('unitManageService',function($http) {
	var service = {};

  service.getValidAssetUnit=function(params,callback){

    $http({
      url:'/unitManageService/getValidAssetUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='获取所有资产单元失败';
      callback(pro);
    });
  }

  service.getTotalAssetUnit=function(params,callback){

    $http({
      url:'/unitManageService/getTotalAssetUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='获取所有资产单元失败';
      callback(pro);
    });
  }

  service.getAssetUnitFromCapManager=function(params,callback){

    $http({
      url:'/unitManageService/getAssetUnitFromCapManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='获取所有资产单元失败';
      callback(pro);
    });
  }




  service.getAllValidCapManager=function(params,callback){

    $http({
      url:'/unitManageService/getAllValidCapManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='获取所有有效的资产管理人失败';
      callback(pro);
    });
  }

  service.getAllCapManager=function(params,callback){

    $http({
      url:'/unitManageService/getAllCapManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='获取所有资产管理人失败';
      callback(pro);
    });
  }

  service.saveEditAssetUnit=function(params,callback){

    $http({
      url:'/unitManageService/saveEditAssetUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='编辑资产单元失败';
      callback(pro);
    });
  }

  service.createAssetUnit=function(params,callback){

    $http({
      url:'/unitManageService/createAssetUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='创建资产单元失败';
      callback(pro);
    });
  }

	service.saveEditAssetManager=function(params,callback){

    $http({
      url:'/unitManageService/saveEditAssetManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='编辑资产管理人失败';
      callback(pro);
    });
  }

  service.createAssetManager=function(params,callback){

    $http({
      url:'/unitManageService/createAssetManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='创建资产管理人失败';
      callback(pro);
    });
  }

	service.saveEditTradeUnit=function(params,callback){

    $http({
      url:'/unitManageService/saveEditTradeUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='编辑交易单元失败';
      callback(pro);
    });
  }

  service.createTradeUnit=function(params,callback){

    $http({
      url:'/unitManageService/createTradeUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='创建交易单元失败';
      callback(pro);
    });
  }

  service.getTransUnitFromAssetUnit=function(params,callback){

		$http({
			url:'/unitManageService/getTransUnitFromAssetUnit',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='获取所有交易单元失败';
			callback(pro);
		});
	}


  service.getAllAssetManagers=function(params,callback){

		$http({
			url:'/unitManageService/getAllAssetManagers',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='获取所有资产管理人失败';
			callback(pro);
		});
	}

	service.getAllAssetUnits=function(params,callback){

		$http({
			url:'/unitManageService/getAllAssetUnits',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='获取所有资产管理人失败';
			callback(pro);
		});
	}

	service.getAllAssetTraders=function(params,callback){

		$http({
			url:'/unitManageService/getAllAssetTraders',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='获取所有资产管理人失败';
			callback(pro);
		});
	}

  service.frozenAssetManager=function(params,callback){

    $http({
      url:'/unitManageService/frozenAssetManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='冻结资产管理人失败';
      callback(pro);
    });
  }

  service.frozenAssetUnit=function(params,callback){

    $http({
      url:'/unitManageService/frozenAssetUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='冻结资产单元失败';
      callback(pro);
    });
  }

  service.frozenTradeUnit=function(params,callback){

    $http({
      url:'/unitManageService/frozenTradeUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='冻结交易单元失败';
      callback(pro);
    });
  }

  service.unfreezeAssetManager=function(params,callback){

    $http({
      url:'/unitManageService/unfreezeAssetManager',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='解冻资产管理人失败';
      callback(pro);
    });
  }

  service.unfreezeAssetUnit=function(params,callback){

    $http({
      url:'/unitManageService/unfreezeAssetUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='解冻资产单元失败';
      callback(pro);
    });
  }

  service.unfreezeTradeUnit=function(params,callback){

    $http({
      url:'/unitManageService/unfreezeTradeUnit',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='解冻交易单元失败';
      callback(pro);
    });
  }

	service.getNewManagerid=function(params,callback){

		$http({
			url:'/unitManageService/getNewManagerid',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='解冻交易单元失败';
			callback(pro);
		});
	}

	service.getNewCaid=function(params,callback){

		$http({
			url:'/unitManageService/getNewCaid',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='解冻交易单元失败';
			callback(pro);
		});
	}

	service.getNewTrid=function(params,callback){

		$http({
			url:'/unitManageService/getNewTrid',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='解冻交易单元失败';
			callback(pro);
		});
	}


  return service;
})
