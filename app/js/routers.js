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

  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home',{
      url: '/home',
      views: {
        '': {
          templateUrl: 'tpls/home/index.html'
        }
      }

    })

    .state('comment',{
      url: '/comment',
      views: {
        '': {
          templateUrl: 'tpls/comment/index.html',
        }
      }
    })

    .state('usercenter',{
        url: '/usercenter',
        views:{
            '': {
                templateUrl: 'tpls/usercenter/index.html'
            }
        },
        controller: 'usercenterCtrl'

    })
    .state('wchatreg',{
        url: '/wchatreg',
        views:{
            '': {
                templateUrl: 'tpls/usercenter/wchatregister.html'
            }
        }

    })

    .state('productView',{
        url: '/productView',
        views:{
            '': {
                templateUrl: 'tpls/productView/index.html'
            }
        },
        controller: 'productcontroller'
    })
    .state('productView0',{
        url: '/productView0',
        views:{
            '': {
                templateUrl: 'tpls/productView0/index.html'
            }
        },
        controller: 'productcontroller'
    })

    .state('allProducts',{
        url: '/allProducts',
        views:{
            '': {
                templateUrl: 'tpls/allProducts/index.html'
            }
        }
    })

    .state('allProducts0',{
        url: '/allProducts0',
        views:{
            '': {
                templateUrl: 'tpls/allProducts0/index.html'
            }
        }
    })

    .state('resetpass',{
        url: '/resetpass',
        views:{
            '': {
                templateUrl: 'tpls/resetpass/index.html'
            }
        }
    })
    .state('risklevel',{
        url:'/risklevel',
        views: {
            '': {
                templateUrl: 'tpls/risklevel/index.html'
            }
        }
    })
    .state('loginout',{
        url:'/loginout',
        views: {
            '': {
                templateUrl: 'tpls/loginout/index.html'
            }
        }
    })
    .state('managecenter',{
        url:'/managecenter',
        views: {
            '': {
                templateUrl: 'tpls/managecenter/index.html'
            }
        }
    })
    .state('customerGroup',{
      url:'/customerGroup',
      views:{
        '':{
          templateUrl: 'tpls/customerGroup/index.html'
        }
      }
    })
    .state('sendMessage',{
      url:'/sendMessage',
      views:{
        '':{
          templateUrl: 'tpls/sendMessage/index.html'
        }
      }
    })
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
