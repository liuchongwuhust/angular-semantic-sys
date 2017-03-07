


cspServices.factory('tradeUnitStockService',function($http) {
	var service = {};

	service.getStocksByTrade=function(params,callback){

    $http({
      url:'/tradeUnitStockService/getStocksByTrade',
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

	service.loadStockFile=function(params,callback){

		$http({
			url:'/tradeUnitStockService/loadStockFile',
			data: params,
			method: 'POST',
			headers: {'Content-Type':undefined},
			transformRequest: angular.identity
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='上传券表文件失败';
			callback(pro);
		});
	}

	service.importStock=function(params,callback){

    $http({
      url:'/tradeUnitStockService/importStock',
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

	service.saveEditStock=function(params,callback){

    $http({
      url:'/tradeUnitStockService/saveEditStock',
      params: params,
      method: 'POST'
    }).success(function(res){
      console.log(res);
      callback(res);
    }).error(function(res) {
      var pro = {};
      pro.result=false;
      pro.reason='编辑券表数据失败';
      callback(pro);
    });
  }
	service.delStock=function(params,callback){

		$http({
			url:'/tradeUnitStockService/delStock',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='删除券表数据失败';
			callback(pro);
		});
	}

	service.getStockAmountByTrade=function(params,callback){

		$http({
			url:'/tradeUnitStockService/getStockAmountByTrade',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='获取券表数量失败';
			callback(pro);
		});
	}


	service.createStock=function(params,callback){

		$http({
			url:'/tradeUnitStockService/createStock',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='创建券表数据失败';
			callback(pro);
		});
	}

	service.loadStockFileAndImport=function(params,callback){

		$http({
			url:'/tradeUnitStockService/loadStockFileAndImport',
			params: params,
			method: 'POST'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='导入数据失败';
			callback(pro);
		});
	}


  return service;
});
