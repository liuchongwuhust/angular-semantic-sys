/* Copyright (C) 2017 LeHigh Hongking - All Rights Reserved
 * You may not use, distribute and modify this code for any
 * purpose unless you receive an official authorization from
 * ShenZhen LeHigh Hongking Technologies Co., Ltd.
 *
 * You should have received a copy of the license with
 * this file. If not, please write to: admin@hongkingsystem.cn,
 * or visit: http://hongkingsystem.cn
 */

function cspManageProductFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
		//删除掉上次的
		document.getElementById('csp_manage_product_delete_button').click();
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "jpg" || kind === "png" || kind === "bmp")) {
			//error
			document.getElementById('csp_manage_product_error_button').click();
		}
		else {
			//上传
			document.getElementById('csp_manage_product_right_button').click();
		}
	}
}

function cspManageSelectFile() {
	document.getElementById("csp_manage_file_input").click();
}

function cspManageanalogProductFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
		//删除掉上次的
		document.getElementById('csp_manage_analogProduct_delete_button').click();
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "jpg" || kind === "png" || kind === "bmp")) {
			//error
			document.getElementById('csp_manage_analogProduct_error_button').click();
		}
		else {
			//上传
			document.getElementById('csp_manage_analogProduct_right_button').click();
		}
	}
}

function cspModuleFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "jpg" || kind === "png" || kind === "bmp")) {
			document.getElementById("csp_module_file_tips_label").innerText = "仅支持JPG,PNG,BMP格式的图片";
		}
		else {
			document.getElementById('csp_module_file_commit').click();
		}
	}
}

function cspManageImportLoadFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
			document.getElementById('csp_manage_import_file_error_btn').click();
		}
		else {
			document.getElementById('csp_manage_import_file_load_btn').click();
		}
	}
}

 function cspCustomerImportLoadFileChange (obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
      console.log("yyyyyyyyyy",kind);
		}


		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
      document.getElementById('csp_customer_import_file_error_btn').click();

		}
		// else {
		// 	document.getElementById('csp_manage_import_file_load_btn').click();
		// }
	}
}





function cspModuleImgLoad(obj) {
	if(obj.width > obj.height ) {
		obj.style.width = "auto";
		obj.style.height = "150px";
	}
	else {
		obj.style.width = "150px";
		obj.style.height = "auto";
	}
	//设置上下左右居中
	var left = (150 -obj.width)/2 + "px";
	var top = (150-obj.height)/2 + "px";
	obj.style.marginLeft = left;
	obj.style.marginTop = top;

}

function cspModuleBigImgLoad(obj) {
	console.log(window.innerWidth,window.innerHeight);
	console.log(obj.src,obj.width,obj.height);
	if(obj.width >= window.innerWidth && obj.height < window.innerHeight) {
		console.log("宽缩小，高自动");
		obj.style.width = "100%";
		obj.style.height = "auto";
	}
	if(obj.width >= window.innerWidth && obj.height >= window.innerHeight) {
		if((obj.width*1000/window.innerWidth) > (obj.height*1000/window.innerHeight)) {
			console.log("宽缩小，高自动");
			obj.style.width = "100%";
			obj.style.height = "auto";
		}
		else {
			console.log("高缩小，宽自动");
			obj.style.width = "auto";
			obj.style.height = "100%";
		}
	}
	if(obj.width < window.innerWidth && obj.height >= window.innerHeight) {
		console.log("高缩小，宽自动");
		obj.style.width = "auto";
		obj.style.height = "100%";
	}
	var left = (-obj.width)/2 + "px";
	var top = (-obj.height)/2 + "px";
	console.log(left,top);
	obj.style.marginLeft = left;
	obj.style.marginTop = top;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
Date.prototype.Format = function(fmt)
{ //author: meizz
	var o = {
		"M+" : this.getMonth()+1,                 //月份
		"d+" : this.getDate(),                    //日
		"h+" : this.getHours(),                   //小时
		"m+" : this.getMinutes(),                 //分
		"s+" : this.getSeconds(),                 //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S"  : this.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt))
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(fmt))
	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	return fmt;
}

function cspManageThemesMouseOver(obj) {
	obj.style.backgroundColor = "#d5d5d5";
}

function cspManageThemesMouseOut(obj) {
	obj.style.backgroundColor = "white";
}


function getMinimum(arr){
	var min=arr[0];
	for (var i = 1; i < arr.length; i++) {
		if(min>arr[i])
			min=arr[i];
	}
	return min;
}

//主要用于图表的显示,默认
function getMaximum(arr){
	var max=arr[0];
	for (var i = 1; i < arr.length; i++) {
		if(max<arr[i])
			max=arr[i];
	}
	return max;
}

function cspManageSpotLoadFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
			document.getElementById('csp_manage_spot_file_error_btn').click();
		}
		else {
			document.getElementById('csp_manage_spot_file_load_btn').click();
		}
	}
}

function cspManageFuturesLoadFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
	}
	else {
		var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
			document.getElementById('csp_manage_futures_file_error_btn').click();
		}
		else {
			document.getElementById('csp_manage_futures_file_load_btn').click();
		}
	}
}

function loadStockFileChange(obj) {
	var filename = obj.value;
	if(filename === "") {
		document.getElementById('stockfile_error_btn').click();
	}
	else {
		// var file = filename.substring(12);
		var filekindarr = filename.split(".");
		var kind = "";
		if(filekindarr.length > 1) {
			kind = filekindarr[filekindarr.length -1].toLowerCase();
		}
		else {
			document.getElementById('stockfile_error_btn').click();
		}

		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
			document.getElementById('stockfile_error_btn').click();
		}
		else {
			document.getElementById('stockfile_load_btn').click();
		}
	}
}

//分页算法,current表示当前的，length表示总的页数，displayLength表示一次显示的分页数
function calculateIndexes(current, length, displayLength) {
 var indexes = [];
	current=current>length?length:current;

 var start = Math.round(current - displayLength / 2);
 var end =   Math.round(current + displayLength / 2);
 console.log('start',start,'end',end);
 if (start < 1) {
		 start = 1;
 }
 if (end !=start+displayLength-1) {
		 end = start+displayLength - 1 ;
 }
 if(end>length)
	 end=length;

 if(end-displayLength+1<start){
	 start=end-displayLength+1>0?end-displayLength+1:1;
 }

 for (var i = start; i <= end; i++) {
	 var obj={};
	 obj.page=i;
	 if (i==current) {
		 obj.select=true;
	 }else {
		 obj.select=false;
	 }
	 indexes.push(obj);
 }
 console.log(indexes);
 return indexes;
 }

 //操作登录界面背景图片
 function cspOperLoginBgChange() {
	 if(window.innerHeight <= 400) {
		 document.getElementById("csp_oper_login_html").style.height = "400px";
	 }
	 else {
		 document.getElementById("csp_oper_login_html").style.height = "100%";
	 }
 }



 //新建公告选择文件
 function cspManageNewNoticeFileChange(obj) {
	 var filename = obj.value;
 	if(filename === "") {
 		//删除掉上次的
 		document.getElementById('csp_manage_newnotice_file_delete_button').click();
 	}
 	else {
 		var file = filename.substring(12);
 		var filekindarr = filename.split(".");
 		var kind = "";
 		if(filekindarr.length > 1) {
 			kind = filekindarr[filekindarr.length -1].toLowerCase();
			if(kind === "pdf") {
				document.getElementById('csp_manage_newnotice_file_right_button').click();
			}
 		}
 	}
 }

 //导入用户选择文件
 function cspManageLoadUserLoadFileChange(obj) {
	 var filename = obj.value;
 	if(filename === "") {
 	}
 	else {
 		var file = filename.substring(12);
 		var filekindarr = filename.split(".");
 		var kind = "";
 		if(filekindarr.length > 1) {
 			kind = filekindarr[filekindarr.length -1].toLowerCase();
 		}
 		if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
 			document.getElementById('csp_manage_futures_file_error_btn').click();
 		}
 		else {
 			document.getElementById('csp_manage_futures_file_load_btn').click();
 		}
 	}
 }

 //导入已购产品选择文件
 function cspManageLoadBoughtLoadFileChange(obj) {
	 var filename = obj.value;
   	 if(filename === "") {
     }
   	 else {
	    var file = filename.substring(12);
	    var filekindarr = filename.split(".");
	    var kind = "";
	    if(filekindarr.length > 1) {
		    kind = filekindarr[filekindarr.length -1].toLowerCase();
	    }
	    if(!(kind === "csv" || kind === "xlsx" || kind === "xls")) {
		    document.getElementById('csp_manage_loadbought_file_error_btn').click();
	    }
	    else {
		    document.getElementById('csp_manage_loadbought_file_load_btn').click();
	    }
    }
 }


 //传入最大值,返回设置图表的最大值和分段间隔
 var getMaxAndInterval = function(max)
 {
 	var splitNumber=5;//分割的块数
 	var interval=max/splitNumber;
 	var newinterval = interval;
 	var n = 0;

 	//获取数的十为底的次数,1为0,0.1为0
 	if(interval < 1)
 	{
 		var n = 1;
 		while(interval < 1)
 		{
 			interval = interval*10;
 			n = n - 1;
 		}
 	}
 	else
 	{
 		while(interval >= 1)
 		{
 			interval = interval/10;
 			n = n + 1;
 		}
 	}
 	console.log('n',n);

 	newinterval = Math.ceil(newinterval/Math.pow(10,n-1))*Math.pow(10,n-1);

 	if (Math.abs(n)+1<=20) {
 		n=Math.abs(n)+1;
 	}
	else{
		n=20;
	}
 	newinterval = parseFloat(newinterval.toFixed(n));

 	if(max >= newinterval*splitNumber - 0.5*newinterval)
 	{
 		max = newinterval * (splitNumber + 1);
 		splitNumber = splitNumber + 1;
 	}
 	else
 	{
 		max = newinterval*splitNumber;
 	}
	max = parseFloat(max.toFixed(n));

 	var obj={};
 	obj.max=max;
 	obj.interval=newinterval;

 	return obj;
 }
