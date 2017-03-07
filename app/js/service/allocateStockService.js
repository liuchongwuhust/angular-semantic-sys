

cspServices.factory('allocateStockService',function($http) {
	var service = {};


  	service.getModel=function(params,callback){

  		$http({
  			url:'/tradeTeamManage/getModel',
  			params: params,
  			method: 'GET'
  		}).success(function(res){
  			console.log(res);
  			callback(res);
  		}).error(function(res) {
  			var pro = {};
  			pro.result=false;
  			pro.reason='获取交易单元失败';
  			callback(pro);
  		});
  	}


//获取指定交易单元下未被分组的交易员
		service.getTradersNotInTeams=function(params,callback){

			$http({
				url:'/tradeTeamManage/getTradersNotInTeams',
				params: params,
				method: 'GET'
			}).success(function(res){
				console.log(res);
				callback(res);
			}).error(function(res) {
				var pro = {};
				pro.result=false;
				pro.reason='获取指定交易单元下未被分组的交易员失败';
				callback(pro);
			});
		}

//获取指定交易单元下未分组和在特定小组的成员信息
		service.getTradersForEdit=function(params,callback){

			$http({
				url:'/tradeTeamManage/getTradersForEdit',
				params: params,
				method: 'GET'
			}).success(function(res){
				console.log(res);
				callback(res);
			}).error(function(res) {
				var pro = {};
				pro.result=false;
				pro.reason='获取getTradersForEdit交易员失败';
				callback(pro);
			});
		}

//获取指定小组的小组成员及小组组长信息
		service.getTeamTraders=function(params,callback){

			$http({
				url:'/tradeTeamManage/getTeamTraders',
				params: params,
				method: 'GET'
			}).success(function(res){
				console.log(res);
				callback(res);
			}).error(function(res) {
				var pro = {};
				pro.result=false;
				pro.reason='获取指定小组的小组成员及小组组长信息失败';
				callback(pro);
			});
		}

		//新建小组数据库数据插入
				service.addNewTeam=function(params,callback){

					$http({
						url:'/tradeTeamManage/addNewTeam',
						params: params,
						method: 'POST'
					}).success(function(res){
						console.log(res);
						callback(res);
					}).error(function(res) {
						var pro = {};
						pro.result=false;
						pro.reason='新建小组数据插入失败';
						callback(pro);
					});
				}
				//获取交易单元下小组详细信息
						service.teamsInfo=function(params,callback){

							$http({
								url:'/tradeTeamManage/teamsInfo',
								params: params,
								method: 'GET'
							}).success(function(res){
								console.log(res);
								callback(res);
							}).error(function(res) {
								var pro = {};
								pro.result=false;
								pro.reason='获取交易单元下小组详细信息';
								callback(pro);
							});
						}





//确认编辑小组按钮
		service.editTeamConfirm=function(params,callback){

			$http({
				url:'/tradeTeamManage/editTeamConfirm',
				params: params,
				method: 'POST'
			}).success(function(res){
				console.log(res);
				callback(res);
			}).error(function(res) {
				var pro = {};
				pro.result=false;
				pro.reason='确认编辑小组失败';
				callback(pro);
			});
		}
//确认删除小组信息

service.delGid=function(params,callback){

	$http({
		url:'/tradeTeamManage/delGid',
		params: params,
		method: 'POST'
	}).success(function(res){
		console.log(res);
		callback(res);
	}).error(function(res) {
		var pro = {};
		pro.result=false;
		pro.reason='确认删除小组信息失败';
		callback(pro);
	});
}
  return service;
});
