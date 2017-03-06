/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

/*
WebSocket.CONNECTING 0	连接正在进行，但还没有建立
WebSocket.OPEN 1 连接已经建立，可以发送消息。
WebSocket.CLOSING 2 连接正在进行关闭握手
WebSocket.CLOSED 3 连接已经关闭或不能打开

传入对象属性说明:
  type
  --exchangeStock:表明该数据用于换券的数据推送.
  --noticeUsers:表明该数据应用于用户通知推送.
  --stock:表明该websocket对象应用于换券推送.
  --notice:表明该websocket对象应用于用户通知推送.
*/


var WebSocketServer = require('ws').Server;

var exchangeStockUsers=[];  //保存所有换券的用户数组
var noticeUsers=[];         //需要接受通知的用户数组

m_webSocket = new WebSocketServer({ port: 8181 });

m_webSocket.on('connection', function (ws) {

    if (ws.readyState===1) {//WebSocket.OPEN
      console.log('client connected');
    }else {
      console.log('webSocket请求失败:',wes);
      return;
    }

    ws.on('message', function (message) {
        var msgObj= JSON.parse(message) ;
        if (msgObj.type === 'exchangeStock') {
          for (var i = 0; i < exchangeStockUsers.length; i++) {
            wsSend(exchangeStockUsers[i],i,message);
          }
        }else if (msgObj.type === 'noticeUsers') {
          console.log('noticeUsers');
        }
        else if (msgObj.type === 'stock'){
            exchangeStockUsers.push(ws);
            console.log('exchangeStockUsers.length',exchangeStockUsers.length);

        }else if (msgObj.type === 'notice') {
          noticeUsers.push(ws);
          console.log('noticeUsers.length',noticeUsers.length);

        }


        console.log('message',message);
    });

    ws.on('error', function (message) {
        console.log(message);
        console.log('exchangeStockUsers.length error',exchangeStockUsers.length);

    });

    ws.on('close', function (message) {
        console.log(message,arguments.length,arguments);
        console.log('exchangeStockUsers.length closes',exchangeStockUsers.length);
        for (var i = 0; i < exchangeStockUsers.length; i++) {
          if (exchangeStockUsers[i].readyState===3) {
            exchangeStockUsers.splice(i,1);
            return;
          }
        }

        for (var i = 0; i < noticeUsers.length; i++) {
          if (exchangeStockUsers[i].readyState===3) {
            noticeUsers.splice(i,1);
            return;
          }
        }
    });

});


function wsSend(destUser,userIndex,messageObj){

  if (destUser.readyState === 1) {

    destUser.send( JSON.stringify(messageObj) );

  }else if (destUser.readyState === 3) {
    exchangeStockUsers.splice(userIndex,1);
  }

}
