$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击上传按钮上传文件
    $('.uploadBtn').click(function () {
        $('#file').click();
    })
    // 为文件上传表单绑定时间
    $('#file').change(function (e) {
        // 获取到上传的新文件的地址
        const file = e.target.files[0];
        const newImgURL = URL.createObjectURL(file);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 点击确定按钮后将裁剪好的base64格式图片上传到服务端
    $('.avatarBtn').click(function(){
        var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
          width: 100,
          height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.post('/my/update/avatar',{
            avatar:dataURL
        },function(res){
            if(res.status!==0){
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            // 重新初始化用户信息
            window.parent.initUser();
        })
    })
})