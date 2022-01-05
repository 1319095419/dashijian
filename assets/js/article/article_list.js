$(function () {
    // 定义获取文章列表数据时需要服务端提交的参数
    var option = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 定义美化时间格式的过滤器
    template.defaults.imports.dateFormat = function (time) {
        const date = new Date(time);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const secends = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${secends}`
    }
    // 页面刚加载时初始化文章分类并获取文章列表数据渲染
    initCate();
    getArticleList();

    // 选择表单提交事件
    $('#selectFilter').submit(function (e) {
        e.preventDefault();
        // 获取到表单中选择框的值并修改option
        option.cate_id = $('.cate_id').val();
        option.state = $('.state').val();
        // 重新发送文章列表数据并渲染
        getArticleList();
    })
    // 删除按钮事件监听，通过事件委托方式绑定(动态绑定)
    $('tbody').on('click','.btnDelete',function(){
        const id = $(this).attr('data-id');
        // 获取当前删除按钮的个数，代表还有几条数据
        const num = $('.btnDelete').length;
        indexDelete = layer.confirm('确认删除?', { icon: 3, title: '删除文章分类' }, function (index) {
            // 根据删除按钮中的id获取对应的数据
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    // 点击删除按钮后要判断一下当前页中还有没有数据
                    if(num===1){ //删除后就没有数据了
                        // 如果不是第一页就向上翻一页
                        option.pagenum=option.pagenum===1?1:--option.pagenum
                    }
                    getArticleList();
                     // 退出弹框
                     layer.close(index);
                }
            })
        });
    })
    // 点击编辑按钮跳转到文章更新页面,事件委托方式动态绑定
    $('tbody').on('click','.btnEdit',function(){
        const id = $(this).attr('data-id');
        window.location.href = '/article/article_update.html?id='+id;
    })
    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 将获取到的数据通过模板渲染到分类单选框中
                $('.cate_id').append(template('cateArticle', res));
                // 通过 layui 重新渲染表单区域的UI结构
                layui.form.render()
            }
        })
    }
    // 获取文章列表数据并渲染
    function getArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: option,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败');
                }
                // 获取成功后将数据渲染到页面上
                let html = template('articleList', res);
                $('tbody').html(html);
                // 执行分页效果渲染函数，将数据总数作为参数传进去
                renderPage(res.total);
            }
        })
    }

        // 分页效果渲染函数
        function renderPage(total){
            layui.use('laypage', function () {
                var laypage = layui.laypage;
                //执行一个laypage实例
                laypage.render({
                    elem: 'page',  //ID，不用加 # 号
                    count: total, //数据总数，从服务端得到
                    groups: 3, //连续出现的页码个数
                    curr:option.pagenum, //起始页,默认为1
                    limit:option.pagesize, //默认一页展示几条数据
                    limits: [2, 3, 5, 10], //每页条数的选择项。
                    layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义排版
                    jump: function (obj, first) { //翻页或laypage.render触发时会执行的回调
                        //obj包含了当前分页的所有参数
                        option.pagenum = obj.curr; //当前页
                        option.pagesize = obj.limit; //每页显示的条数
                        //true表示jump是由laypage.render触发，false表示是由跳页触发
                        if (!first) {
                            // 为避免陷入死循环，只有当手动翻页时才会触发列表渲染函数
                            getArticleList();
                        }
                    }
                });
            });
        }
})