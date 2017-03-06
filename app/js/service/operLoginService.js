/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */
cspServices.factory('operLoginService',function($http) {
	var service = {};
	service.cspOperCheckLogin = function(params,callback) {
		$http({
			url:'/operlogin/checklogin',
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
	service.cspOperLogin = function(params,callback) {
		$http({
			url:'/operlogin/login',
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
	//判断登录及自动登录 参数
	// {
	// 	cookieExist : true / false, 表示是否传递了cookie信息，若为false，则不需要传递后三个字段
	// 	login_maid : "x",
	// 	login_oid : "x", //此处login_oid 与数据库中的不同
	// 	login_pass: "x"
	// }
	service.cspOperCheckAndLogin = function(params,callback) {
		$http({
			url:'/operlogin/checkandlogin',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res); //仅当result值为succeed时，表示登录成功
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}
	//验证身份证号码
	service.cspOperCheckIdcard = function(params) {
		var sId = params;
		var city={
			11:"北京",
			12:"天津",
			13:"河北",
			14:"山西",
			15:"内蒙古",
			21:"辽宁",
			22:"吉林",
			23:"黑龙江",
			31:"上海",
			32:"江苏",
			33:"浙江",
			34:"安徽",
			35:"福建",
			36:"江西",
			37:"山东",
			41:"河南",
			42:"湖北",
			43:"湖南",
			44:"广东",
			45:"广西",
			46:"海南",
			50:"重庆",
			51:"四川",
			52:"贵州",
			53:"云南",
			54:"西藏 ",
			61:"陕西",
			62:"甘肃",
			63:"青海",
			64:"宁夏",
			65:"新疆",
			71:"台湾",
			81:"香港",
			82:"澳门",
			91:"国外 "};
		var iSum=0 ;
	    var info="" ;
	 	if(!/^\d{17}(\d|x)$/i.test(sId)) return false;
	 	sId=sId.replace(/x$/i,"a");
	 	if(city[parseInt(sId.substr(0,2))]==null) return false;
	 	var sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
	 	var d=new Date(sBirthday.replace(/-/g,"/")) ;
	 	if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())) return false;
	 	for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
	 	if(iSum%11!=1) return false;
	 	//aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
	 	return true;
	}

	//判断操作员是否是某个交易单元的组长,同时返回交易单元
	// 参数传递
	// {
	// 	useparams: 0, //0表示不使用传递的参数，改成使用session中的maid 和 oid，若要使用参数，将该字段值设为1
	// 	oid: "1.1"
	// }
	service.cspOperCheckGroupAndGetList = function(params,callback) {
		$http({
			url:'/operlogin/checkgroupandgetlist',
	        params: params,
	        method: 'GET'
		}).success(function(res) {
			callback(res); //仅当result值为succeed时，表示登录成功
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}

	service.cspOperLoginOut = function(params,callback) {
		$http({
			url:'/operlogin/loginout',
	        params: params,
	        method: 'POST'
		}).success(function(res) {
			callback(res); //仅当result值为succeed时，表示登录成功
		}).error(function(res) {
			var back = {};
			back.result = "failed";
			back.reason = "服务器连接失败";
			callback(back);
		});
	}

	return service;
})
