$(function () {
    //文章状态默认为已发布
    let articleState = '已发布';
    // 获取到本文章对应的id
    const id = window.location.search.replace('?id=', '');
    // 点击存为草稿后后改为草稿
    $('.draft').click(function () {
        articleState = '草稿';
    })
    // 获取要修改的文章数据并填充到页面中
    getArticleData(id);

    // 初始化富文本编辑器
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

    // 为选择封面按钮绑定事件
    $('.selectImg').click(function () {
        // 打开文件选择框
        $('.fileImg').click();
    })
    // 为图片文件上传到文件表单绑定事件监听
    $('.fileImg').change(function (e) {
        // 获取到上传到文件表单的图片
        const files = e.target.files;
        // 判断是否有文件上传
        if (files.length === 0) return;
        // 如果上传了图片就将图片显示在裁剪区域中
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 为表单提交绑定事件监听
    $('.articleUpdate').submit(function (e) {
        e.preventDefault();
        // 先获取到需要向服务器提交的数据
        let fd = new FormData($(this)[0]);
        // 文章状态和id
        fd.append('state', articleState);
        fd.append('Id',id);
        // 将裁减后的文件输出为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，将文件放入formdata中
                fd.append('cover_img', blob);
                // 发起ajax请求
                sendArticleData(fd);
            })
    })
    // 发送更新文章的请求
    function sendArticleData(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false, //不修改content-type，使用formdata提供的
            processData: false, //不对数据进行编码
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                // 更新成功后提示并跳转到文章列表页面
                layer.msg(res.message);
                // 程序触发文章列表按钮点击事件，跳转到文章列表页
                window.parent.articleList.click();
            }
        })
    }
    // 获取文章类别数据并渲染到类别选择框中
    function getArticleCate(cateId) {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                $('[name="cate_id"]').html(template('cateList', res));
                // layui重新渲染,类目选择框默认选中cateId对应的类目选项，如果没有就说明已经被删除，需要重新选择类目
                $('.cate_id').val(cateId);
                layui.form.render();
            }
        })
    }
    // 获取要修改的文章数据并填充到页面中
    function getArticleData(id) {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                //给表单赋值
                const data = res.data;
                $('.title').val(data.title);
                $('.content').val(data.content);
                // 将图片填充到对应裁剪区域中
                var newImgURL = url+data.cover_img;
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
                // 获取文章类别数据并渲染到类别选择框中
                getArticleCate(data.cate_id);
            }
        })
    }
})