$.ajaxPrefilter(function (options) {
    // 1.在发起真正的ajax请求之前统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    // console.log(options.url);
    // 2.统一为有权限的接口  以/my开头的  设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
    // 3.拦截所有响应  登录拦截  判断身份认证信息  
    options.complete = function (res) {
        // console.log(res.responseJSON);
        var obj = res.responseJSON
        if (obj.status == 1 && obj.message == '身份认证失败！') {
            // 清空本地的token
            localStorage.removeItem('token')
            // 页面强制跳转
            location.href = '/login.html'
        }
    }
})









