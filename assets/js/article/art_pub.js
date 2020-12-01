$(function () {
    //  一、 初始化文章类别里的下拉菜单内容
    var form = layui.form
    var layer = layui.layer

    // 调用
    initCate()

    // 调用富文本编辑器的函数
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 封装
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                // 赋值 渲染下拉菜单里的内容
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 二、给 选择封面 按钮绑定点击事件  实现选择图片的功能
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })


    // 三、设置 更换图片 监听 coverFile 的 change 事件 
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 非空校验
        if (file.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 四、设置下面两个按钮的点击状态
    var state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })


    // 五、为表单绑定submit提交事件 添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 创建FormData对象 收集数据
        var fd = new FormData(this)
        // 放入状态
        fd.append('state', state)
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                console.log(...fd);
                // 调用添加文章的函数
                publishArticle(fd)
            })
    })



    // 六、封装添加文章的函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // FormData类型数据执行ajax请求的时候必须有
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您发布文章成功')
                // 跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }


})  