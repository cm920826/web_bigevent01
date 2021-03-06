$(function () {
    // 1.自定义验证规则
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为1~6位数之间！'
            }
        }
    })


    initUserInfo()
    // 2.封装获取用户信息的ajax请求函数
    var layer = layui.layer
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 获取成功  然后渲染
                form.val('formUserInfo', res.data)
            }
        })
    }


    // 3.表单重置
    $('#btnReset').on('click', function (e) {
        // 阻止重置
        e.preventDefault()
        // 再从新用户渲染
        initUserInfo()
    })


    // 4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败')
                }
                layer.msg('恭喜您，用户信息修改成功')
                // 调用父页面中的获取用户信息和头像的函数
                window.parent.getUserInfo()
            }

        })
    })




})