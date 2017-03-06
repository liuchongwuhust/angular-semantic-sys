var xlsx = require('node-xlsx');
var iconv = require('iconv-lite');
var fs=require('fs');
var path=require('path');



//获取当前目录绝对路径，这里resolve()不传入参数
var filePath = path.join(process.cwd(),'app');
console.log(filePath);

function traversalPath(){
  //读取文件目录
  fs.readdir(filePath,function(err,files){
    if(err){
      console.log(err);
      return;
    }
    files.forEach(function(filename){
      fs.stat(path.join(filePath,filename),
      function(err,stats){
        if (err) {
          throw err;
        }
        if (stats.isFile()) {
          var lastPoint=filename.lastIndexOf('.');
          if (lastPoint==-1) {
            return;
          }
          var filenameSubffix=filename.substring(lastPoint+1,filename.length);//文件的后缀
          var filenameNoSubffix=filename.substring(0,lastPoint);//文件名称不带后缀
          console.log(filename);

          if(filenameSubffix=='xlsx'||filenameSubffix==='csv'){
            var querySql='select id from product_2 where caption="'+filenameNoSubffix+'"';

            csp.db.query(querySql,function(err,result) {
              if (err||result.length==0) {
                console.log('没有对应的产品',filename);
                return;
              }
              importXlsxData(filename,result[0].id);
            });


          }
        }
      });
    });
  });
}



function getXlsxData(xlsxNetData,xlsxFileName){
  var xlsxPath=path.join(process.cwd(),'app',xlsxFileName);
  console.log(xlsxPath);

  var lastPoint=xlsxFileName.lastIndexOf('.');
  if (lastPoint==-1) {
    return;
  }
  var filenameSubffix=xlsxFileName.substring(lastPoint+1,xlsxFileName.length);
  if (filenameSubffix=='xlsx'||filenameSubffix=='xls') {
    var obj = xlsx.parse(xlsxPath);
    var xlsxData = obj[0].data;
    console.log(xlsxData);

  }else if (filenameSubffix=='csv') {
    var xlsxData =[];
    var fileStr = fs.readFileSync(xlsxPath, {encoding:'binary'});
    var buf = new Buffer(fileStr, 'binary');
    var str = iconv.decode(buf, 'GBK');
    var rows =str.split("\r\n");
    //排除EXCEL保存CSV文件时最后带空字符
    for(var j=0;j<rows.length;j++){
        if(rows[j]=='')
        rows.splice(j,1);
    }
    if(rows.length > 1) {
      for(var k = 0; k < rows.length; k ++) {
        var rData = [];
        rData = rows[k].split(",");
        xlsxData[k] = rData;
      }
      console.log('csv 表格数据',xlsxData);
    }else {
      return;
    }
  }
  else {
    return;
  }

  xlsxData.splice(0,1);//xlsxData保存的第一条数据需要去除
  console.log(xlsxData);

  //得到顺序的数组
  xlsxData.sort(function(x,y){
      return y[0]<x[0];
  });
  console.log(xlsxData);

  for (var i = 0; i < xlsxData.length; i++) {
    var tempProductNet=new Object();
    tempProductNet.date=new Date(xlsxData[i][0]);
    tempProductNet.yieldRate=xlsxData[i][1];
    // tempProductNet.proid=xlsxData[i][2];
    xlsxNetData.push(tempProductNet);
  }
  console.log(xlsxNetData);
}

function getDateString(date){
  return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
}

function importXlsxData(xlsxFileName,productID){
  //保存当前表格的净值数据
  var xlsxNetData=[];
  getXlsxData(xlsxNetData,xlsxFileName);

  var queryString='select * from netproduct_2 where proid='+productID+' order by date desc limit 0,1 ';
  csp.db.query(queryString,function(err,result) {
		if(err) {
      console.log('查询最新净值失败');
      return;
		}

    console.log('result.length',result);

    if (result.length==0) {//如果之前没有数据
      var lastNet={};
      lastNet.date=new Date('1970-1-1');
      lastNet.net=1;
      // lastNet.proid=productID;
      console.log('lastNet',lastNet,lastNet.date.getTime());
      var currNet=lastNet;

    }else {
      var lastNet=result[0];
      var currNet=result[0];
      lastNet.date=new Date(lastNet.date);
      console.log('lastNet',lastNet);
    }

    var importData=new Array();
    var tempProductNet;
    for (var i = 0; i < xlsxNetData.length; i++) {
      if (xlsxNetData[i].date.getTime()<=(lastNet.date.getTime()+8*60*60*1000)) {
            console.log(xlsxNetData[i].date,lastNet.date);
            console.log(xlsxNetData[i].date.getTime(),(lastNet.date.getTime()+8*60*60*1000));
            continue;
      }
      console.log('xlsxNetData',xlsxNetData[i].date,xlsxNetData[i].date.getTime(),lastNet.date.getTime());
      tempProductNet=new Object();
      tempProductNet.date=xlsxNetData[i].date;
      tempProductNet.yieldRate=xlsxNetData[i].yieldRate;
      tempProductNet.yearYieldRate=xlsxNetData[i].yieldRate*365;
      tempProductNet.net=currNet.net*(1+xlsxNetData[i].yieldRate);
      // tempProductNet.proid=xlsxNetData[i].proid;
      currNet=tempProductNet;
      importData.push(tempProductNet);
    }
    if (importData.length==0) {
      console.log('导入数据长度为0');
      return;
    }
    var insertData='';
    for (var i = 0; i < importData.length; i++) {
      insertData+='("'+getDateString(importData[i].date)+'",'+importData[i].net+','
            +importData[i].net+','+importData[i].yieldRate+','+importData[i].yearYieldRate+','+productID+'),';
    }
    insertData=insertData.substring(0,insertData.length-1);

    queryString='insert into netproduct_2 (date,net,totalnet,accrate,yearrate,proid) values';
    queryString+=insertData;
    console.log(queryString);
    csp.db.query(queryString,function(err,result) {
      if (err) {
        console.log('增加净值数据失败');
        return;
      }
      console.log('增加净值数据成功');

    });



  });
}




function refreshNet(){
  var onehour=60*60*1000;

  var today=new Date();
  var todayUTCSecond=today.getTime();//获取了本地时间距离世界时间1970-1-1的毫秒数
  var tomarrowLocal=new Date(todayUTCSecond+8*onehour+24*onehour);//本地时间现在的明天的 本地时间date
  var tomarrowZeroUTCSecond=Date.parse(getDateString(tomarrowLocal));//获取了本地时间的明天00:00距离世界时间1970-1-1的毫秒数
  console.log('todayUTCSecond',todayUTCSecond,'tomarrowZeroUTCSecond',tomarrowZeroUTCSecond,tomarrowZeroUTCSecond-todayUTCSecond);
  setTimeout(function(){
    setInterval(function(){
      console.log('setInterval');
      traversalPath();
    },24*onehour);
  },tomarrowZeroUTCSecond-todayUTCSecond);
    traversalPath();


}

refreshNet();
