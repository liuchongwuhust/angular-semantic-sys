 1. main函数中引入模块，可在全局使用：
    nodeExcel = require('excel-export');
 2. 用于导出excel表格。
 3. 用法参考：
 randomCtrl randomOutput导出函数。该函数对应html中的click点击导出函数.

 var id = $scope.currentSelectTid
 var url = "/random/exportExcel/"+id;
 window.location = url;

 使用window.location的方式而不直接使用get方法。

 在randomRoutes中，使用参数'/exportExcel/:id'跳转到后台函数saveTidExcelFile：

 router.get('/exportExcel/:id', function(req, res){
   console.log("saveTidExcelFile")
   randomDao.saveTidExcelFile(req, res);
 });

 在randomDao中，  获取id = req.params['id'];
 var conf = { };
 conf.cols = cols
 conf.rows = rows

 var result = nodeExcel.execute(conf);

 res.setHeader('Content-Type', 'application/vnd.openxmlformats');
 res.setHeader("Content-Disposition", "attachment; filename=d.xlsx");
 res.end(result, 'binary');

4. 参考：https://github.com/functionscope/Node-Excel-Export
