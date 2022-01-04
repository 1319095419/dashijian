$(function(){
    // 登录成功进入主页后发送请求获取用户信息并渲染
    initUser();

    // 退出登录按钮事件监听
    $('#logout').on('click',function(){
        // 清除localStorage中的用户标识
        location.href = './login.html';
        localStorage.removeItem('token');
    })

    // 初始化用户信息
    function initUser(){
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // 判断用户信息是否获取成成功
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                // 如果登录成功要将用户信息渲染在页面上
                renderUser(res.data);
            }
        })
    }
    // 将初始化用户信息放到全局中
    window.initUser = initUser;
    // 用户信息渲染
    function renderUser(data){
        // 判断有没有设置头像，没有头像用文字头像
        if(data.user_pic){
            $('.user-pic').prop('src',data.user_pic).show();
            $('.text-avatar').hide();
        }else{
            $('.text-avatar').html(data.username[0]).show();
            $('.user-pic').hide();
        }
        // 昵称
        $('#nickname').html('&nbsp;&nbsp;'+data.nickname || '&nbsp;&nbsp;***');
    }
})