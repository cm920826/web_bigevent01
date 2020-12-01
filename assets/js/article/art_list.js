$(function () {
    // 定义事件过滤器
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n > 0 ? n : '0' + n
    }

    var layer = layui.layer
    // 1.定义提交的参数
    var q = {
        pagenum: 1,   // 页码值
        pagesize: 2,   // 每页显示多少条数据
        cate_id: '',   // 文章分类的Id
        state: '',   // 文章的状态，可选值有：已发布、草稿
    };
    initTable()
    // 2.初始化文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }


    // 3.初始化下拉框的分类
    var form = layui.form
    // 调用
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染到下拉框里面
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }


    // 4.筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        // 赋值
        q.state = state
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })


    // 5.定义渲染分页的方法
    var laypage = layui.laypage
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',     //这里的pageBox是ID，不用加 # 号
            count: total,        //数据总数，从服务端得到
            limit: q.pagesize,   // 每页几条
            curr: q.pagenum,     // 第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }


    // 6. 删除功能
    var layer = layui.layer
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        layer.confirm('是否确认删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('恭喜您文章删除成功')
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--
                    initTable()
                }
            })
            layer.close(index);
        });
    })


})