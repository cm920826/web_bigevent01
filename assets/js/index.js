// 入口函数
$(function () {
    // 调用获取用户信息的函数
    getUserInfo()


    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        // layui框架提供的询问框
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
            // 清空本地token
            localStorage.removeItem('token')
            // 页面跳转
            location.href = '/login.html'
            // 关闭询问框
            layer.close(index);
          });
    })
})


// 获取用户信息的函数要封装到入口函数的外面
// 因为后面其他的页面也要调用 写在入口函数里面就成了全局函数 别的页面就不能调用了
function getUserInfo() {
    $.ajax({
        method: 'GET',    // 这里的请求方式可以省略
        url: '/my/userinfo',
        // headers: {
        //     // 重新登录 因为token过期事件12小时
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            console.log(res);
            // 判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 请求成功之后 调用渲染用户头像信息的函数
            renderAvatar(res.data)
        }
    })
}


// 封装渲染用户头像信息的函数
function renderAvatar(user) {
    // 1.用户名  （昵称优先，没有昵称头像用username）
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 2.用户头像
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide()
    } else {
        // 没有头像
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase();
        $('.text-avatar').show().html(text)
    }
}