## 消息通知框使用详解##

 1. 参数解析（下面的设置也是默认设置）
	    title: false,            // 是否显示标题，如果不显示标题，设置为false，如果显示标题，请设置标题内容
        size: 'mini',               // 通知消息栏的三种大小，有如下三种类型：normal, mini, large，csp只用mimi
        soundPath: 'src/sounds/',   // 语音文件设置路径
        soundExt: '.ogg',           // 语音文件默认后缀
        showClass: 'zoomIn',        // 显示消息通知栏的一个消息的显示动画
        hideClass: 'zoomOut',       // 显示消息通知栏的一个消息的隐藏动画
        icon: false,                // 图标显示
        msg: '',                    // 消息内容
        html: false,                // 是否将msg转化为html格式
        img: null,                  // 图片文件
        remove: true,               // 是否能被最上面的删除键删除
        closable: true,             // 是否能被消息里面的×删除
        delay: 15000,               // 延时的时间设置，单位为毫秒。设为false永远不会消失。
        delayIndicator: true,       // 是否显示时间进度条
        closeOnClick: false,        // 是否点击消息能自身关掉
        width: 400,                 // 设置的宽度
        sound: false,               // 是否弹出通知的时候有声音
        position: "top right"       // 消息存放的位置，有如下几个可以选择："top left", "top right", "bottom left", "bottom right"

 2. 使用实例。
 对于csp来说，目前只用到size为mini的通知栏。调用方法如下：
    csp.notify(type, options);
    type 为消息类型，string类型。有如下几种："notice", "info", "warning", "error", "success"。cps暂时只用到notice的消息类型。
     options为参数，object类型。具体参数含义见参数解析。
 如果使用简单的通知，使用实例如下：
     csp.notify('notice',  {
        msg: 'csp msg test......',
        delay: 15000,
    });
  如果要用到类型为html的通知，使用实例如下：
    csp.notify('notice', {
        remove: false,
        html: true,
        msg: '<button class="ui primary button">确定 </button>',
        delay: false,
    });

 3. 参考资料：http://www.htmleaf.com/Demo/201506011948.html
 4. 依赖文件：lib\notifications.js，css\lobibox.css
