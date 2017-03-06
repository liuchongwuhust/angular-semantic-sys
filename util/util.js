/**
 * Created by fujunou on 2015/3/6.
 */

module.exports = {
    extend: function (target, source, flag) {
        for (var key in source) {
            if (source.hasOwnProperty(key))
                flag ?
                    (target[key] = source[key]) :
                    (target[key] === void 0 && (target[key] = source[key]));
        }
        return target;
    },

    // 向前台返回JSON方法的简单封装
    jsonWrite: function (res, ret) {
        if (typeof ret === 'undefined') {
            res.json({
                code: '1',
                msg: '操作失败'
            });
        } else {
            res.json(ret);
        }
    },

    DateUtile: {
        formate: function (fmt) {
            var datenow = new Date();
            var o = {
                "M+": datenow.getMonth() + 1, //月份
                "d+": datenow.getDate(), //日
                "h+": datenow.getHours() % 12 === 0 ? 12 : datenow.getHours() % 12, //小时
                "H+": datenow.getHours(), //小时
                "m+": datenow.getMinutes(), //分
                "s+": datenow.getSeconds(), //秒
                "q+": Math.floor((datenow.getMonth() + 3) / 3), //季度
                "S": datenow.getMilliseconds() //毫秒
            };
            var week = {
                "0": "/u65e5",
                "1": "/u4e00",
                "2": "/u4e8c",
                "3": "/u4e09",
                "4": "/u56db",
                "5": "/u4e94",
                "6": "/u516d"
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (datenow.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[datenow.getDay() + ""]);
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }

    }
}
