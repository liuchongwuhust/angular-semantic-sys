/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */
cspCtrls.controller('cspOperLoginCtrl',function($scope,$state,$interval,operLoginService) {
	$scope.timePromise = undefined;
	$scope.loginInfo = {};
	$scope.cspOperLoginInit = function() {
		document.getElementById('csp_header_containter').style.display = "none";
		document.getElementById('csp_footer').style.display = "none";
		document.getElementById('homeSpaceDiv_37px').style.display = "none";
		if(!(document.cookie || navigator.cookieEnabled)) {
			alert("浏览器未开启cookie,网站可能无法正常使用")
		}
		else {
			//先判断登录验证session是否具有login_maid 和 login_oid
			operLoginService.cspOperCheckLogin({},function(res) {
				if(res.result == "succeed" && res.loginState == true) {
					$state.go('allocateStock');
				}
				else {
					//读取cookie maid oid
					var exist = false;
					var operCookieInfo;
					var cookieName = "cspOperLoginInfo=";
					var clist = document.cookie.split(";");
					for(var i = 0; i< clist.length; i++) {
						var ca = clist[i].trim();
						if(ca.indexOf(cookieName) == 0) {
							exist = true;
							operCookieInfo = JSON.parse(unescape(ca.substring(cookieName.length,ca.length)));
							break;
						}
					}

					if(exist) {
						$scope.loginInfo.maid = operCookieInfo.maid;
						$scope.loginInfo.oid = operCookieInfo.oid;
						$scope.loginInfo.password = operCookieInfo.password;
						$scope.loginInfo.logining = true;
						$scope.loginInfo.loadState = "正在登录";
						$scope.loginInfo.error = false;
						$scope.loginInfo.save = operCookieInfo.save;
						var json = {};
						json.login_maid = $scope.loginInfo.maid;
						json.login_oid = $scope.loginInfo.oid;
						json.login_pass = $scope.loginInfo.password;
						operLoginService.cspOperLogin(json,function(res) {
							if(res.result == "succeed") {
								$scope.loginInfo.loadState = "登录成功";
								$state.go('allocateStock');
							}
							else {
								var second = 2;
								$scope.loginInfo.error = true;
								$scope.loginInfo.loadState = res.reason;
								$scope.timePromise = undefined;
								$scope.timePromise = $interval(function(){
									if(second<=0){
									  $interval.cancel($scope.timePromise);
									  $scope.timePromise = undefined;
									  $scope.loginInfo.logining = false;
									}else{
									  second--;
									}
								},500,100);
							}
						})
					}
					else {
						//显示登录界面
						$scope.loginInfo.maid = "";
						$scope.loginInfo.oid = "";
						$scope.loginInfo.password = "";
						$scope.loginInfo.logining = false;
						$scope.loginInfo.loadState = "正在登录";
						$scope.loginInfo.error = false;
						$scope.loginInfo.save = false;
					}
				}
			})
		}
	}

	$scope.cspOperLoginClick = function() {
		var second = 1;
		$scope.loginInfo.logining = true;
		$scope.loginInfo.error = false;
		$scope.loginInfo.loadState = "正在登录";
		$scope.loginInfo.error = false;
		if($scope.loginInfo.maid == "") {
			$scope.loginInfo.error = true;
			$scope.loginInfo.loadState = "请输入资产管理人编号";
			$scope.timePromise = undefined;
			$scope.timePromise = $interval(function(){
				if(second<=0){
				  $interval.cancel($scope.timePromise);
				  $scope.timePromise = undefined;
				  $scope.loginInfo.logining = false;
				}else{
				  second--;
				}
			},500,100);
		}
		else if($scope.loginInfo.oid == "") {
			$scope.loginInfo.error = true;
			$scope.loginInfo.loadState = "请输入操作员账号";
			$scope.timePromise = undefined;
			$scope.timePromise = $interval(function(){
				if(second<=0){
				  $interval.cancel($scope.timePromise);
				  $scope.timePromise = undefined;
				  $scope.loginInfo.logining = false;
				}else{
				  second--;
				}
			},500,100);
		}
		else if($scope.loginInfo.password == "") {
			$scope.loginInfo.error = true;
			$scope.loginInfo.loadState = "请输入密码";
			$scope.timePromise = undefined;
			$scope.timePromise = $interval(function(){
				if(second<=0){
				  $interval.cancel($scope.timePromise);
				  $scope.timePromise = undefined;
				  $scope.loginInfo.logining = false;
				}else{
				  second--;
				}
			},500,100);
		}
		else {
			//提交到后台验证账号密码
			var json = {};
			json.login_maid = $scope.loginInfo.maid;
			json.login_oid = $scope.loginInfo.oid;
			json.login_pass = $scope.loginInfo.password;
			operLoginService.cspOperLogin(json,function(res) {
				if(res.result == "succeed") {
					$scope.loginInfo.loadState = "登录成功";
					//判断是否需要保存cookie
					console.log($scope.loginInfo.save);
					if($scope.loginInfo.save == true) {
						var savejson = {};
						savejson.maid = $scope.loginInfo.maid;
						savejson.oid = $scope.loginInfo.oid;
						savejson.password = $scope.loginInfo.password;
						savejson.save = $scope.loginInfo.save;
						var savestr = JSON.stringify(savejson);
						//document.cookie.cspOperLoginInfo = escape(savestr);
						var expires = new Date();
					    expires.setTime(expires.getTime() + 7*24*60*60*1000);
					    var str="cspOperLoginInfo="+escape(savestr)+";expires=" + expires.toGMTString();
					    document.cookie =str;
					}
					else {
						//删除掉保存的cookie
						var cookieName = "cspOperLoginInfo=";
						var expires = new Date();
					    expires.setTime(expires.getTime());
						var clist = document.cookie.split(";");
						for(var i = 0; i< clist.length; i++) {
							var ca = clist[i].trim();
							if(ca.indexOf(cookieName) == 0) {
								document.cookie = ca + ";expires=" + expires.toGMTString();
								break;
							}
						}
					}
					$state.go('allocateStock');
				}
				else {
					$scope.loginInfo.error = true;
					$scope.loginInfo.loadState = res.reason;
					$scope.timePromise = undefined;
					$scope.timePromise = $interval(function(){
						if(second<=0){
						  $interval.cancel($scope.timePromise);
						  $scope.timePromise = undefined;
						  $scope.loginInfo.logining = false;
						}else{
						  second--;
						}
					},500,100);
				}
			})
		}
	}

})
