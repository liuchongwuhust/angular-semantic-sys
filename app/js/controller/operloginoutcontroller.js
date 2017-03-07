
 cspCtrls.controller('cspOperLoginOutCtrl',function($scope,$state,$interval,operLoginService){
	 $scope.cspOperLoginOutLoad = function() {
		 operLoginService.cspOperLoginOut({},function(res) {
			 //清除cookie
			 if((document.cookie || navigator.cookieEnabled)) {
				 var cookieName = "cspOperLoginInfo=";
				 var expires = new Date();
				 expires.setTime(expires.getTime());
    			 document.cookie = cookieName + ";expires=" + expires.toGMTString();
	 		}
			$state.go('operlogin');
		 })
	 }
 })
