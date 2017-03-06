/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

var captchapng = require('captchapng');

module.exports = function (req, res, next) {
    var width=!isNaN(parseInt(req.query.width))?parseInt(req.query.width):100;
    var height=!isNaN(parseInt(req.query.height))?parseInt(req.query.height):30;

    var code = parseInt(Math.random()*9000+1000);
    req.session.resetimgcode = code.toString();
    var p = new captchapng(width,height, code);
    p.color(222, 222, 222, 255);
    p.color(205,127,50, 255);

    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
}
