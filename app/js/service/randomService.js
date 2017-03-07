

cspServices.factory('randomService',function($http) {
	var service = {};



//获取交易单元下的小组
service.getWishTid=function(params,callback){

	$http({
		url:'/random/getWishTid',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='获取交易单元下的小组失败';
		callback(pro);
	});
}

service.unitRandmDiv=function(params,callback){

	$http({
		url:'/random/unitRandmDiv',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='分券失败';
		callback(pro);
	});
}
service.deleResults=function(params,callback){

	$http({
		url:'/random/deleResults',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='清除分券结果失败';
		callback(pro);
	});
}
service.writeResults=function(params,callback){

	$http({
		url:'/random/writeResults',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='写入分券结果失败';
		callback(pro);
	});
}
service.writeSec=function(params,callback){

	$http({
		url:'/random/writeSec',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='更改总券失败';
		callback(pro);
	});
}
service.recoverStock=function(params,callback){

	$http({
		url:'/random/recoverStock',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='恢复总券失败';
		callback(pro);
	});
}
service.noWishList=function(params,callback){

	$http({
		url:'/random/noWishList',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='获取是否所有小组均没有心愿清单失败';
		callback(pro);
	});
}

service.deleWishList=function(params,callback){

	$http({
		url:'/random/deleWishList',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='分券完毕后删除心愿清单失败';
		callback(pro);
	});
}
service.getRandmR=function(params,callback){

	$http({
		url:'/random/getRandmR',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='分券完毕后获取分券结果失败';
		callback(pro);
	});
}


service.randomOver=function(params,callback){

	$http({
		url:'/random/randomOver',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='分券完毕后检查总券是否有剩余券失败';
		callback(pro);
	});
}

service.getTname=function(params,callback){

	$http({
		url:'/random/getTname',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='根据小组gid获取小组名称失败';
		callback(pro);
	});
}



service.getInfobyGid=function(params,callback){

	$http({
		url:'/random/getInfobyGid',
		params: params,
		method: 'GET'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='根据小组gid获取小组杠杆/分券市值失败';
		callback(pro);
	});
}

  return service;
});
