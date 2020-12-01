$(function () {
    // 调用获取文章分类列表的函数
    initArtCateList()
    // 封装获取文章分类列表的函数
    function initArtCateList() {
        $.ajax({
            // 请求方式不写默认是GET
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                // 传的是对象res  模板里循环用的是属性data
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }


    // 为  添加分类按钮  绑定点击事件
    var layer = layui.layer
    var form = layui.form
    $('#btnAdd').on('click', function () {
        // 利用框架代码 弹出层
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    })


    // 提交文章分类功能实现 form-add （通过事件委托给确认添加按钮绑定事件）
    var indexAdd = null
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log('ok');
                // 因为添加类别成功了 所以要重新调用 渲染页面中的数据
                initArtCateList()
                layer.msg('恭喜您，文章类别添加成功')
                layer.close(indexAdd)
            }
        })
    })


    // 修改文章分类 给  编辑按钮  绑定点击事件 （事件委托）
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // console.log('ok');
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });
        // 获取 Id 发送ajax请求获取数据 渲染到页面提示框
        // 下面的这些要卸载编辑按钮的点击事件里面
        var Id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })


    // 修改  提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log('ok');
                // 因为更新类别成功了 所以要重新调用 渲染页面中的数据
                initArtCateList()
                layer.msg('恭喜您，文章类别更新成功')
                layer.close(indexEdit)
            }
        })
    })



    // 删除功能
    // 思路
    // 1.通过事件委托的方式为每个删除按钮绑定点击事件
    // 2.在点击事件函数中要拿到要删除的数据的Id
    // 3.弹出询问的提示层
    // 4.用户点击询问框里确定按钮的时候发起ajax请求来删除数据
    // 5.数据删除后要关闭询问框并且更新列表里的数据

    $('tbody').on('click', '.btn-delete', function () {
        // 先获取Id  这儿的this指的是btn按钮 一定要写在下面显示对话框的外面
        var Id = $(this).attr('data-id')
        // 显示对话框
        layer.confirm('是否确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/updatecate' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        layer.msg(res.message)
                    }
                    // 因为删除成功了所以要重新更新 并渲染页面的数据
                    initArtCateList()
                    layer.msg('恭喜您，文章类别删除成功')
                    layer.close(index)
                }
            })
        });
    })
})