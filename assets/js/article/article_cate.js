$(function () {
    const form = layui.form;
    // 页面刚加载时获取文章分类并渲染
    getArticleCate();
    // 为添加类别绑定事件监听
    let indexAdd = null;
    $('.addBtn').click(function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#addCate').html(),
            area: ['500px', '250px']
        });
    })
    // 通过事件委托的方式为表单绑定提交事件
    $('body').on('submit', '#addArticleCate', function (e) {
        e.preventDefault();
        // //获取表单区域所有值
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                layer.msg('新增分类成功')
                getArticleCate();
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })
    // 编辑按钮事件监听(事件委托)
    let indexEdit = null;
    $('tbody').on('click', '.btnEdit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#editCate').html(),
            area: ['500px', '250px']
        });
        // 根据编辑按钮中的id获取对应的数据
        const id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                const data = res.data;
                //给表单赋值
                form.val("editForm", {
                    name: data.name,
                    alias: data.alias,
                    Id: data.Id
                });
            }
        })
    })
    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#editCate', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                layer.close(indexEdit);
                getArticleCate();
            }
        })
    })
    // 删除按钮事件监听(代理方式)
    $('tbody').on('click', '.btnDelete', function () {
        const id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '删除文章分类' }, function (index) {
            // 根据删除按钮中的id获取对应的数据
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    getArticleCate();
                    // 退出弹框
                    layer.close(index);
                }
            })
        });
    })


    // 获取文章分类列表并渲染
    function getArticleCate() {
        // 发送获取请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 获取成功后将数据渲染到列表中
                renderList(res);
            }
        })
    }
    // 列表渲染
    function renderList(res) {
        // 将模板渲染到表格中
        $('tbody').html(template('articleList', res));
    }
})