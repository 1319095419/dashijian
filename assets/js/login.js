$(function () {
    // layui
    let form = layui.form;

    // 登录和注册表单验证
    form.verify({
        psd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repsd: function (value) {
            // 获取到密码框中的输入内容
            const text = $('.psd').val();
            // 判断两次密码输入是否一致
            if (value !== text) {
                return '两次密码输入不一致，请重新输入';
            }
        }
    });
    // 去注册账号
    $('.to-register').click(function () {
        // 登录表单隐藏
        $('.login').hide();
        // 注册表单显示
        $('.register').show();
    })
    // 注册注册事件监听
    $('.register').submit(function (e) {
        // 阻止默认事件（表单提交）
        e.preventDefault();
        // 向后端发送注册请求
        $.ajax({
            method:'POST',
            url:'/api/reguser',
            data:$(this).serialize(),
            success:function(res){
                // 判断是否注册成功
                if(res.status!==0){
                    return layer.msg(res.message); 
                }
                // 注册成功后弹出提示框并跳转到登录界面
                layer.msg(res.message);
                $('.to-login').click();
            }
        })
    })
    // 登录表单事件监听
    $('.login').submit(function (e) {
        // 阻止默认事件（表单提交）
        e.preventDefault();
        // 向后端发送登录请求
        $.ajax({
            method:'POST',
            url:'/api/login',
            data:$(this).serialize(),
            success:function(res){
                // 判断是否登录成功
                if(res.status!==0){
                    return layer.msg(res.message); 
                }
                // 登录成功后弹出提示框并跳转到首页，同时将用户登录标识保存到localStorage中
                layer.msg(res.message);
                localStorage.setItem('token',res.token);
                location.href='./index.html';
            }
        })
    })

    // 去登录
    $('.to-login').click(function () {
        // 注册表单隐藏
        $('.register').hide();
        // 登录表单显示
        $('.login').show();
    })
})