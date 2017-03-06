var mysql = require("mysql")



csp.db = mysql.createConnection(csp.config.db);

csp.db.connect()

//回调函数
csp.db._oridinQuery = csp.db.query;
csp.db.query = function(){
  var callback = arguments[arguments.length-1]
  if(typeof callback=="function"){
    arguments[arguments.length-1] = function(){
      try{
        callback.apply(this,arguments)
      }
      catch(e){
        console.error(e.stack)
      }
    }
  }
  csp.db._oridinQuery.apply(this,arguments)
}

csp.db.query_test = function(sql,cb){
    this.query(sql,function(err,data){
        if(err){
            console.log(sql)
        }
        cb(err,data)
    })
}
csp.db.find = function(table,columns,where,cb){
    if( typeof columns.join=="function" ) {
        columns = columns.join(", ")
    }
    var sql = "SELECT " + (columns||"*") + " FROM " + table + " WHERE " + this.escape_where(where)
    this.query_test(sql,cb)
}
csp.db.insert = function(table,data,cb){
    var sql = "INSERT INTO `" + table + "`" + this.escape_insert(data)
    this.query_test(sql,cb)
}
csp.db.update = function(table,data,where,cb){
    var sql = "UPDATE `"+table+"` SET "+this.escape_update(data)+" WHERE "+this.escape_where(where)
    this.query_test(sql,cb)
}
csp.db.prepare = function(temp_sql,data,cb){
    var self = this
    var sql = temp_sql.replace(/\?/g,function(item){
        return self.escape_injection(data.shift())
    })
    this.query_test(sql,cb)
}



csp.db.escape_update = function(data){
    var sqls = []
    for(var o in data){
        sqls.push('`'+o+'` = '+this.escape_injection(data[o]))
    }
    return sqls.join(',')
}
csp.db.escape_where = function(data){
    return get_where(data)||1
}
csp.db.escape_insert = function(data){
    var keys = []
    var values = []
    for(var o in data){
        keys.push('`'+o+'`')
        values.push(this.escape_injection(data[o]))
    }
    var temp = ' ('+keys.join(',')+') '+ 'VALUES ('+values+') '
    return temp

}


csp.db.escape_injection = function(data,without_quote){
    if( typeof data=="number" ){
        return data
    }else{
        if(without_quote){
            return data.replace(/([\\\'\"])/gm,"\\$1")
        }else{
            return "'"+data.replace(/([\\\'\"])/gm,"\\$1")+"'"
        }
    }
}
csp.db.escape_insert_values = function(data){
    var values = []
    if(Object.prototype.toString.call(data) === "[object Object]"){
        for(var o in data){
            item = data[o]
            values.push(this.escape_injection(item))
        }

    }else if(Object.prototype.toString.call(data) === "[object Array]"){
        for(var i=0,len=data.length;i<len;i++){
            var item = data[i]
            values.push(this.escape_injection(item))
        }
    }
    return '('+values+')'
}

function get_and(data){
    var temp = []
    for(var o in data){
        var item = data[o]
        var temp_item = get_item(o,item)
        if(temp_item.len > 1){
            temp.push('('+temp_item.data+')')
        }else{
            temp.push(temp_item.data)
        }
    }
    return {
        len:temp.length,
        data:temp.join(' and ')
    }
}
function get_or(data){
    var temp = []
    for(var i=0,len=data.length;i<len;i++){
        var item = data[i]
        var temp_item = get_and(item)
        if(temp_item.len > 1){
            temp.push('('+temp_item.data+')')
        }else{
            temp.push(temp_item.data)
        }
    }
    return {
        len:temp.length,
        data:temp.join(' or ')
    }
}
function get_item(key,value){
    if(Object.prototype.toString.call(value) == "[object Array]"){
        return get_or(value)
    }else if(Object.prototype.toString.call(value) == "[object Object]"){
        return get_and(value)
    }else{
        return {
            len:1,
            data:get_expression(key,value)
        }
    }
}
function get_expression(temp_key,value,operator){
    var operator = ''
    var key = temp_key
    if(/^(key)(like|>=|>|=|<|<=)$/.test(temp_key)){
        key = RegExp.$1
        operator = RegExp.$2
    }
    value = csp.db.escape_injection(value)
    switch(operator){
        case '=':
            data = '`'+key+'` = '+value
            break;
        case '>':
            data = '`'+key+'` > '+value
            break;
        case '>=':
            data = '`'+key+'` >= '+value
            break;
        case '<':
            data = '`'+key+'` < '+value
            break;
        case '<=':
            data = '`'+key+'` <= '+value
            break;
        case 'like':
            data = '`'+key+'` like '+value
            break;
        case '<':
            data = '`'+key+'` = '+value
            break;
        case '<':
            data = '`'+key+'`='+value
            break;
        default:
            data = '`'+key+'`='+value
    }
    return data
}

function get_where(data){
    if(!data || Object.keys(data).length < 1){
        return false
    }
    var temp =  []
    var len = Object.keys(data).length
    for(var o in data){
        var item = data[o]
        var temp_item = get_item(o,item)
        if(temp_item.len > 1 && len >1){
            temp.push('('+temp_item.data+')')
        }else{
            temp.push(temp_item.data)
        }
    }
    return ' '+temp.join(' and ')
}

exports.query = csp.db.query;
