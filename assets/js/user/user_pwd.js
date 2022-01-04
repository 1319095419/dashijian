$(function () {
    const form = layui.form;
    // 正则表达式验证
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        newpwd: function (value) {
            // 获取到原密码中的内容
            let oldPwd = $('.oldPwd').val();
            // 原密码和新密码不能相同
            if (value === oldPwd) {
                return '新密码和原密码不能相同';
            }
        },
        repwd: function (value) {
            // 获取到新密码中的内容
            let newPwd = $('.newPwd').val();
            // 两次密码输入必须一致
            if (value !== newPwd) {
                return '两次密码输入不一致，请重新输入';
            }
        }
    });
    //  提交表单事件监听
    $('.pwdForm').submit(function (e) {
        e.preventDefault();
        // 像服务端发送修改密码的请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 如果修改密码成功并退出登录状态重新登陆
                layer.msg(res.message);
                localStorage.removeItem('token');
                window.parent.location.reload();
            }
        })
    })
})