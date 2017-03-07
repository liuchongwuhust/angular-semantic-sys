

cspServices.factory('wishListService',function($http) {
	var service = {};


	service.getTidModel=function(params,callback){

		$http({
			url:'/wishList/getTidModel',
			params: params,
			method: 'GET'
		}).success(function(res){
			console.log(res);
			callback(res);
		}).error(function(res) {
			var pro = {};
			pro.result=false;
			pro.reason='获取交易小组失败';
			callback(pro);
		});
	}


service.getUnitStocks=function(params,callback){

	$http({
		url:'/wishList/getUnitStocks',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='获取交易单元券表失败';
		callback(pro);
	});
}

//保存心愿清单
service.submitWishList=function(params,callback){

	$http({
		url:'/wishList/submitWishList',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='保存心愿清单失败';
		callback(pro);
	});
}


//获取小组总BP
service.getGroupBpValue=function(params,callback){

	$http({
		url:'/wishList/getGroupBpValue',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='获取小组总BP失败';
		callback(pro);
	});
}


//获取小组心愿清单
service.getGroupWishList=function(params,callback){

	$http({
		url:'/wishList/getGroupWishList',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='获取小组心愿清单失败';
		callback(pro);
	});
}
  return service;
});
