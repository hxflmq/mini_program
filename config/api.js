// 以下是业务服务器API地址
var WxApiRoot = 'http://www.baidu.com/';  //后端请求服务接口域名
module.exports = {
  FirstUrl: WxApiRoot + 'first/first/first',  //根据接口类型 对应请求
  /* ...
     接口的统一配置
  ... */
  LastUrl: WxApiRoot + 'last/last/last' //校验交易密码
};