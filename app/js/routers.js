/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

/**
 * 配置路由。
 * 注意这里采用的是ui-router这个路由，而不是ng原生的路由。
 * ng原生的路由不能支持嵌套视图，所以这里必须使用ui-router。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
var cspRouters = angular.module('cspRouters', ['ui.router']);

cspRouters.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/operlogin');
  $stateProvider
 
    .state('operlogin',{
      url:'/operlogin',
      views:{
        '':{
          templateUrl: 'tpls/securitiesManage/operLogin.html'
        }
      }
    })
    .state('allocateStock',{
      url:'/allocateStock',
      views:{
        '':{
          templateUrl: 'tpls/allocateStock/index.html'
        }
      }
    })
    .state('tradeTeamManage',{
      url:'/tradeTeamManage',
      views:{
        '':{
          templateUrl: 'tpls/allocateStock/tradeTeamManageIndex.html'
        }
      }
    })
    .state('opermanage',{
      url:'/opermanage',
      views:{
        '':{
          templateUrl: 'tpls/operManage/index.html'
        }
      }
    })

    .state('layoutmanage',{
        url:'/layoutmanage',
        views:{
            '':{
                templateUrl: 'tpls/layoutmanage/index.html'
            }
        }
    })

    .state('unitManage',{
      url:'/unitManage',
      views:{
        '':{
          templateUrl: 'tpls/unitManage/index.html'
        }
      }
    })

    .state('wishList',{
      url:'/wishList',
      views:{
        '':{
          templateUrl: 'tpls/wishList/index.html'
        }
      }
    })
    .state('groupexchange',{
      url:'/groupexchange',
      views:{
        '':{
          templateUrl: 'tpls/groupexchange/index.html'
		}
	   }
	})

    .state('random',{
      url:'/random',
      views:{
        '':{
          templateUrl: 'tpls/random/index.html'
        }
      }
    })

    .state('importStockData',{
      url:'/importStockData',
      views:{
        '':{
          templateUrl: 'tpls/importStockData/index.html'
        }
      }
    })
    .state('operloginout',{
      url:'/operloginout',
      views:{
        '':{
          templateUrl: 'tpls/operloginout/index.html'
        }
      }
    })
})
