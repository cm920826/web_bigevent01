$(function () {
    // 1.点击 去注册账号的链接 显示注册页 隐藏登录页
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击 去登录的链接 显示登录页 隐藏注册页
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    // 2.自定义验证规则
    var form = layui.form      // 从layui中获取form对象
    form.verify({              // 通过form.verify()函数自定义校验规则
        // 密码框的校验规则
        pwd: [
            /^[\S]{6,12}$/     // 自定义了一个叫做pwd的校验规则
            , '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码的校验规则
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()      // 后代选择器后面一定要带空格
            if (pwd !== value) {
                return '两次输入的密码不一致！'
            }
        }
    })


    // 3.实现注册功能 发起ajax请求
    var layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 提交成功后
                // alert(res.message)
                layer.msg('恭喜您注册成功，请登录')
                $('#link_login').click()
                $('#form_reg')[0].reset()
            }
        })
    })


    // 4.实现登录功能  发起ajax请求
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // 判断返回的状态
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您，登录成功')
                // 在本地存储保存token
                localStorage.setItem("token", res.token)
                location.href = '/index.html'
            }
        })
    })











})