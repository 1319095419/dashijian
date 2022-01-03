// 存放着一些公共的接口，方便统一修改和使用

// 项目接口的请求根路径
const url = 'http://api-breakingnews-web.itheima.net';
// 用jquery发送ajax请求之前，会触发此方法，options是ajax请求配置
$.ajaxPrefilter(function(options){
    // 在真正发送ajax请求时拼接请求根路径
    options.url = url+options.url;
})
