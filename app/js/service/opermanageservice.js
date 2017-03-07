
cspServices.factory('operManageService',function($http) {
	var service = {};
	service.cspOperManageGetAllMaid = function(params,callback) {
		$http({
			url:'/opermanage/getallmaid',
	        params: params,
	        method: 'GET'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	service.cspOperManageGetOidByMaid = function(params,callback) {
		$http({
			url:'/opermanage/getoidbymaid',
	        params: params,
	        method: 'GET'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	service.cspOperManageGetOperByOid = function(params,callback) {
		$http({
			url:'/opermanage/getoperbyoid',
	        params: params,
	        method: 'GET'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	service.cspOperManageAddOper = function(params,callback) {
		$http({
			url:'/opermanage/addoper',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	service.cspOperManageUpdateOper = function(params,callback) {
		$http({
			url:'/opermanage/updateoper',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	service.cspOperManageChangeOperStat = function(params,callback) {
		$http({
			url:'/opermanage/changeoperstat',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	service.cspOperManageResetPass = function(params,callback) {
		$http({
			url:'/opermanage/resetpass',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	//通过资产管理人获取资产单元
	service.cspOperManageGetCaidByMaid = function(params,callback) {
		$http({
			url:'/opermanage/getcaidbymaid',
	        params: params,
	        method: 'GET'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}

	//通过资产单元获取交易单元
	service.cspOperManageGetTridByCaid = function(params,callback) {
		$http({
			url:'/opermanage/gettridbycaid',
	        params: params,
	        method: 'GET'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}

	//添加交易员
	service.cspOperManageAddTrader = function(params,callback) {
		$http({
			url:'/opermanage/addtrader',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res);
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	return service;
})
