// 存放着一些公共的接口，方便统一修改和使用

// 项目接口的请求根路径
const url = 'http://www.liulongbin.top:3007'; //别人的接口
// const url = 'http://127.0.0.1:3007'; //自己开发的接口
// 用jquery发送ajax请求之前，会触发此方法，options是ajax请求配置
$.ajaxPrefilter(function (options) {
    // 在真正发送ajax请求时拼接请求根路径
    options.url = url + options.url;
    // 以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
    if(options.url.indexOf('/my')!==-1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        };
    }
    // 全局统一挂载complete配置，无论成功失败都会执行
    // 每次发送/my请求时都判断一下用户的登录状态，如果获取不到用户信息就退出登录状态，返回首页
    options.complete = function (res) {
        // 获取用户信息失败
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清除localStorage中的用户标识
            location.href = '/login.html';
            localStorage.removeItem('token');
        }
    }
})
