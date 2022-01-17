$(function(){
    // 页面加载时获取用户基本信息并填充到表单中
    getUser();
    // 提交按钮事件监听
    $('.userForm').submit(function(e){
        // 阻止表单提交默认事件
        e.preventDefault();
        // 获取到表单中的值并向后端提交
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                // 判断是否修改成功
                if(res.status!==0){
                    return layer.msg(res.message);
                }
                // 修改成功后信息提示并重新渲染
                layer.msg(res.message);
                window.parent.initUser();
            }
        })
    })
    // 重置按钮事件监听
    $('.resetBtn').click(function(e){
        e.preventDefault();
        // 获取用户基本信息并填充到表单中
        getUser();
    })
    // 获取用户基本信息并填充到表单中
    function getUser(){
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // 判断用户信息是否获取成功
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                let data = res.data;
                // 将用户信息填充到表单中
                $('.id').val(data.id);
                $('.username').val(data.username);
                $('.nickname').val(data.nickname);
                $('.email').val(data.email);
            }
        })
    }
})