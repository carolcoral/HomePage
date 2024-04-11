main_content = $('.moment_type_main');
function remove_image_temp(){
    if(!$('.image_edit_temp .add_img_box').length > 0){
        var temp = $('.add_img_box');
        $('.image_edit_temp').html(temp);
    }
    main_content.empty();
}

function back_image_temp(){
    var temp = $('.add_img_box');
    main_content.html(temp);
    $('.image_edit_temp').empty();
}

//发布卡片
$('body').on('click', '.moment_card_type a', function () {
    $('.push_item').attr('type', 'card');
    main_content = $('.moment_type_main');
    if ($('.add_card_box').length > 0) {
        return false;
    }
    remove_image_temp();
    main_content.html('<div class="loading_box"><div uk-spinner></div></div>');
    $('.moment_type_main .loading_box').remove();
    main_content.append(
        `<div class="add_card_box">
    <div class="edit_card_box">
        <div class="card_choose" uk-switcher="animation: uk-animation-fade">
            <li><a class="card_c_btn post" c_type="post">文章</a></li>
            <li><a class="card_c_btn page" c_type="page">页面</a></li>
        </div>
        <div class="tips"># 输入别名或者标题,自动生成链接卡片 <span>支持文章, 页面等网址</span></div>
        <div class="edit_content">
            <input type="text" placeholder="别名或者标题" name="moment_card_link" id="moment_card_link" required="required">
            <a class="push_card">生成</a>
        </div>
    </div>
    <div class="show_card"><div class="card_sortble" uk-sortable="handle: .moment_card_item"></div></div>
</div>`);
});
$('body').on('click', '.edit_content .push_card', function () {
    var card_url = $('.edit_card_box .edit_content input').val();
    var num = $('.card_sortble .moment_card_item').length;
    if (num > 2) {
        cocoMessage.error('最多插入3个卡片');
        $('.edit_card_box .edit_content input').val('');
        return false;
    }
    var c_type = $('.card_choose .uk-active a').attr('c_type');
    switch (c_type) {
        case "post":
            card_post(card_url);
            break;
        case "page":
            edit_page(card_url);
            break;
    }
});

function card_post(card_url){
    $.ajax({
        type: 'GET',
        url: `/apis/api.console.halo.run/v1alpha1/posts?keyword=${card_url}&labelSelector=content.halo.run%2Fdeleted%3Dfalse&page=1&size=20`,
        beforeSend: function () {
            cocoMessage.info('生成中...');
        },
        success: function (data) {
            $('.edit_card_box .edit_content input').val('');
            if (data.total > 0) {
                if(data.total>1){
                    cocoMessage.error('当前搜索的文章有多个无法选择');
                }else{
                    var item = data.items[0]
                    $('.show_card').show();
                    $('.card_sortble').append(getcard(item.post.metadata.name,item.post.spec.cover,item.post.spec.title,'post'));
                    cocoMessage.success('已生成卡片');
                }

            } else {
                cocoMessage.error('文章不存在');
            }

        }
    });
}


function edit_page(card_url){
    $.ajax({
        type: 'GET',
        url: `/apis/api.console.halo.run/v1alpha1/singlepages?keyword=${card_url}&labelSelector=content.halo.run%2Fdeleted%3Dfalse&page=1&size=20`,
        beforeSend: function () {
            cocoMessage.info('生成中...');
        },
        success: function (data) {
            $('.edit_card_box .edit_content input').val('');
            if (data.total > 0) {
                if(data.total>1){
                    cocoMessage.error('当前搜索的页面有多个无法选择');
                }else{
                    var item = data.items[0]
                    $('.show_card').show();
                    $('.card_sortble').append(getcard(item.page.metadata.name,item.page.spec.cover,item.page.spec.title,'page'));
                    cocoMessage.success('已生成卡片');
                }

            } else {
                cocoMessage.error('页面不存在');
            }

        }
    });
}

function getcard(name,cover,title,type){

    return `<div class="moment_card_item" pid="${name}" type="${type}">
        <a>
            <div class="left"><img src="${cover}"></div>
            <div class="right">
                <h4>${title}</h4>
                <div class="content"></div>
            </div>
            <span class="de_card"><i class="ri-close-line"></i></span>
        </a>
    </div>`
}

$(document).on('click', '.de_card', function() {
    var msg = "确认删除此卡片？";
    var num = $('.moment_card_item').length;
    if (confirm(msg)==true){
        $(this).parents('.moment_card_item').remove();
    } else {
        return false;
    }

    if(num == 1){
        $(".show_card").hide();
    }
});

//图文编辑 返回图文编辑区域
$('body').on('click', '.moment_image_type a', function() {
    back_image_temp();
    $('.push_item').attr('type','image');
});

//发布音乐--------------------------------------------------------------
$('body').on('click', '.moment_audio_type a', function() {
    $('.push_item').attr('type','audio');
    main_content = $('.moment_type_main');
    if($('.add_audio_box').length > 0){
        return false;
    }
    remove_image_temp();
    main_content.append(
        `<div class="add_audio_box">
    <div class="edit_audio_box">
        <div class="audio_choose" uk-switcher="animation: uk-animation-fade">
            <li class="local"><a href="#" class="audio_c_btn" au_type="local">本地</a></li>
            <li class="netease"><a href="#" class="audio_c_btn" au_type="netease">网易云</a></li>
            <li class="tencent"><a href="#" class="audio_c_btn" au_type="tencent">QQ音乐</a></li>
            <li class="kugou"><a href="#" class="audio_c_btn" au_type="kugou">酷狗</a></li>
            <li class="kuwo"><a href="#" class="audio_c_btn" au_type="kuwo">酷我</a></li>
        </div>
        <div class="tips"># 请插入封面,歌名以及歌曲外链 <span></span></div>
        <div class="edit_content audio_type uk-switcher">
            <div class="loacl_audio">
                <div class="audio_left m_media_left">
                    <i class="ri-add-line"></i>
                    <input type="file" name="moment_img_up" id="moment_img_up" accept="image/jpg,image/jpeg,image/png,image/gif,image/webp" multiple="multiple" title="上传封面">
                </div>
                <div class="audio_right">
                    <div class="audio_meta">
                        <input type="text" placeholder="歌名" name="moment_audio_name" id="moment_audio_name" class="required" required="required">
                        <input type="text" placeholder="歌手(选填)" name="moment_audio_author" id="moment_audio_author">
                    </div>
                    <input type="text" placeholder="歌曲外链" name="moment_audio_url" id="moment_audio_url" class="required" required="required">
                </div>
            </div>
            <div class="netease_audio type_audio_text"></div>
            <div class="tencent_audio type_audio_text"></div>
            <div class="kugou_audio type_audio_text"></div>
            <div class="kuwo_audio type_audio_text"></div>
        </div>
    </div>
</div>`);
});

//音乐和视频上传
$(document).on('change','#moment_img_up',function(){
    if($('#moment_img_up').val() == '')
        return;
    var f = this.files[0];
    var formData = new FormData();
    formData.append('file',f);
    const policyName = Theme.moments.policyName;
    const groupName = Theme.moments.groupName;
    policyName && formData.append('policyName',policyName)
    groupName && formData.append('groupName',groupName)

    $.ajax({
        type: "POST",
        url: "/apis/api.console.halo.run/v1alpha1/attachments/upload",
        dataType:  'json',
        data: formData,
        processData : false,
        contentType : false,
        beforeSend: function () {
            cocoMessage.info('上传中...');
            $('.m_media_left i').remove();
            $('.m_media_left').append("<div class='up_loading' uk-spinner='ratio: .6'></div>");
            var imged = $('.m_media_left img');
            if(imged.length > 0){
                imged.remove();
            }
        },
        success: function(data){
            var thum = data.metadata.annotations["storage.halo.run/uri"] || data.metadata.annotations["storage.halo.run/external-link"]
            $('.m_media_left .up_loading').remove();
            $('.m_media_left').append('<img src="/themes/theme-pix/assets/img/video.png" data="'+thum+'">');
            cocoMessage.success('上传成功');
            $('input#moment_video_url').val(thum)
        }
    });
});

$('body').on('click', '.audio_choose a', function() {
    var text = '# 请插入封面,歌名以及歌曲外链';
    var type = $(this).attr('au_type');
    if(type != 'local'){
        var text = '# 请输入歌曲ID';
    }
    $('.edit_audio_box .tips').text(text);
});

//发布视频--------------------------------------------------------------
$('body').on('click', '.moment_video_type a', function() {
    $('.push_item').attr('type','video');
    main_content = $('.moment_type_main');
    if($('.add_video_box').length > 0){
        return false;
    }
    remove_image_temp();
    main_content.html('<div class="loading_box"><div uk-spinner></div></div>');
    $('.moment_type_main .loading_box').remove();
    main_content.append(
        `<div class="add_video_box">
    <div class="edit_video_box">
        <div class="video_choose" uk-switcher="animation: uk-animation-fade">
            <li><a href="#" class="video_c_btn local" vi_type="local">本地</a></li>
            <li><a href="#" class="video_c_btn bili" vi_type="bili">B站</a></li>
        </div>
        <div class="tips"># 请上传视频或填写视频外链 <span></span></div>
        <div class="edit_content video_type uk-switcher">
            <div class="local_video">
                <div class="video_left m_media_left">
                    <i class="ri-add-line"></i>
                    <input type="file" name="moment_img_up" id="moment_img_up" accept="video/mp4,video/ogg,video/webm,video/3gpp,video/flv,video/avi,video/mov,video/wmv,video/rm,video/rmvb,video/3gp,video/3g2,video/asf,video/mkv,video/mpg,video/mpeg,video/ts" multiple="multiple" title="上传视频">
                </div>
                <div class="video_right">
                    <div class="video_meta">
                        <input type="text" placeholder="视频外链" name="moment_video_url" id="moment_video_url" class="required" required="required">
                    </div>
                </div>
            </div>
            <div class="bili_video">
                <input type="text" placeholder="B站视频bvid" name="moment_video_bili" id="moment_video_bili" class="required" required="required">
            </div>
        </div>
    </div>
</div>`);

});

$('body').on('click', '.video_choose a', function() {
    var text = '# 请上传视频或填写视频外链';
    var type = $(this).attr('vi_type');
    if(type == 'bili'){
        var text = '# 请输入B站视频bvid';
    }
    $('.edit_video_box .tips').text(text);
});

//图文类型
//$('body').on('click', '.moment_video_type a', function() {

//});

//删除片刻文章
$('body').on('click', '.control_delete_post', function() {
    var pid = $(this).parent().attr('pid');

    var msg = "确定删除瞬间？";
    if (confirm(msg)==true){
        $.ajax({
            type: 'DELETE',
            dataType: 'json',
            url: '/apis/moment.halo.run/v1alpha1/moments/'+pid,
            contentType: "application/json",
            beforeSend: function () {
                cocoMessage.info('处理中..');
            },
            success: function (data) {
                cocoMessage.success('删除成功');
                setTimeout(()=>{
                    $(`#post-${pid}`)[0].remove()
                },1000)
            },
            error: function (request) {
                if(request.status){
                    cocoMessage.error('瞬间不存在或已删除');
                }else{
                    cocoMessage.error('删除失败');
                }
                console.log(request)
            },
        });
    } else {
        return false;
    }

});

//置顶片刻
$('body').on('click', '.sticky_btn', function() {
    var pid = $(this).parent().attr('pid');
    var stick = $(this).hasClass('stick');
    if(stick){
        var state = 'stick';
    } else {
        var state = 'unstick';
    }
    var msg = "确定执行此操作？";
    if (confirm(msg)==true){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: Theme.ajaxurl,
            data: {
                'action':'stick_moment',
                pid:pid,
                state:state
            },
            beforeSend: function () {
                cocoMessage.info('处理中..');
            },
            success: function (data) {
                if(data.state == '1'){
                    cocoMessage.success(data.msg);
                    if(data.type == 'stick'){
                        var post_item = $('#post-'+pid+'.moment_item');
                        post_item.remove();
                        $('.moment_list').prepend(post_item.prop('outerHTML'));
                        $('#post-'+pid+'.moment_item').find('.post_footer_meta .right').prepend('<span class="sticky_icon"><i class="ri-fire-line"></i> TOP</span>');
                        $('#post-'+pid+'.moment_item').find('.post_control').remove();
                    } else {
                        $('#post-'+pid+'.moment_item').find('.sticky_icon').remove();
                    }

                } else {
                    cocoMessage.error('操作失败');
                }
            }
        });
    } else {
        return false;
    }

});

//编辑片刻
$('body').on('click', '.control_edit_post', function() {
    $('.t_media_item').remove();
    $('#moment_audio_api').remove();
    var pid = $(this).parent().attr('pid');
    $('.push_item').html('<i class="ri-edit-box-line"></i>更新');
    $('.push_item').attr('pid',pid).attr('action','update')
    $.ajax({
        type: 'GET',
        url: '/apis/moment.halo.run/v1alpha1/moments/'+pid,
        beforeSend: function () {
            cocoMessage.info('数据拉取中');
            //$('.t_form').before('<div class="edit_overlay"></div>');
        },
        success: function (data) {
            $('.push_item').attr('version',data.metadata.version)
            $('.push_item').attr('owner',data.spec.owner)
            $('.push_item').attr('releaseTime',data.spec.releaseTime)
            //发布状态
            if(data.spec.visible == 'PRIVATE'){
                $(".simi a").html('<i class="ri-lock-line"></i>').attr('visible','PRIVATE');
                $(".simi a").children().css({"background":"#ddd","color":"#c6c6c6"});
            } else {
                $(".simi a").html('<i class="ri-lock-unlock-line"></i>').attr('visible','PUBLIC');
                $(".simi a").children().css({"background":"#e3efe7","color":"#66c187"});
            }
            var medium = data.spec.content.medium;
            var tags = data.spec.tags
            if(medium.length > 0){
                var type = medium[0].type;
            }
            let content = data.spec.content.html;
            if(content == null){
                content = '';
            }else{

                // 创建一个新的HTML解析器对象
                var parser = new DOMParser();
                // 解析HTML字符串并获取根元素
                var doc = parser.parseFromString(content, 'text/html');
                // 获取根元素下的所有子元素
                var elements = doc.body.childNodes;
                // 需要删除的链接元素的条件
                var conditions = doc.querySelectorAll('p > a.tag');
                // 遍历子元素并删除特定段落元素和链接元素
                for (var i = 0; i < conditions.length; i++) {
                    for (var j = 0; j < elements.length; j++) {
                        if (elements[j].nodeName === 'P' && elements[j].querySelector('a.tag')) {
                            elements[j].parentNode.removeChild(elements[j]);
                        }
                    }
                    content = doc.body.innerHTML;
                }
            }

            $('#topic_content').val(content);
            if(tags.length > 0){
                $('.t_cat_toogle span').text(tags[0]);
            }

            switch(type)
            {
                case "PHOTO":
                    //if(data.moment_data.length > 0){ 文字片刻没有数据
                    edit_image(data);
                    //}
                    break;
                case "POST":
                    edit_card(data);
                    break;
                case "AUDIO":
                    edit_audio(data);
                    break;
                case "VIDEO":
                    edit_video(data);
                    break;
            }
            cocoMessage.success('拉取完成');
        }
    });
});

//发布片刻重置
$('body').on('click', '.normal_edit,.center .mobile_edit', function() {
    $('.push_item').attr('action','push').html('<i class="ri-send-plane-2-line"></i>发布');
    $('.moment_image_type a').click();
    $(".simi a").html('<i class="ri-lock-unlock-line"></i>').attr('visible','PUBLIC');
    $(".simi a").children().css({"background":"#e3efe7","color":"#66c187"});
    $('#topic_content').val('');
    $('.t_media_item').remove();
});

//编辑片刻类型------------------------------------------------------------------------------
function edit_image(data){
    var m_data = data.spec.content.medium;
    $('.t_media_item').remove();
    $('.moment_image_type a').click();
    if(m_data.length > 0){
        var new_data = m_data.reverse();
        $.each(new_data, function(index, value) {
            var thum = value.url;
            var src = value.url;
            var type = value.originType;
            var media = `<div class="t_media_item" data-type="${type}" data-src="${src}" data-thum="${thum}">`;
            media += '<a class="topic-img-de"><i class="ri-subtract-line"></i></a>';
            media += '<img src="'+thum+'">';//图片预览
            media += '</div>';
            $(".img_show").prepend(media);
        });
    }
}

function edit_video(data){
    var m_data = data.spec.content.medium[0];
    var type = m_data.originType;
    //var url = m_data.url;
    $('.moment_video_type a').click();

    var add = setInterval(function() {
        if(type != 'video/bili'){
            var url = m_data.url;

            $('input#moment_video_url').val(url);
            if(url !== ''){
                $('.m_media_left i').remove();
                $('.m_media_left').append('<img src="/themes/theme-pix/assets/img/video.png" data="'+url+'">');
            }

        } else if(type == 'video/bili') {
            if($('.video_choose').length > 0){
                var bvid = m_data.url;
                UIkit.switcher('.video_choose').show(1);
                $('input#moment_video_bili').val(bvid);
            }

        }

        if($('.edit_video_box').length == 1){
            clearInterval(add);
        }

    }, 100);
}

function edit_audio(data){
    var m_data = data.moment_data[0];
    var type = m_data.type;
    $('.moment_audio_type a').click();
    var add = setInterval(function() {
        if(type == 'local'){
            var url = m_data.url;
            var cover = m_data.cover;
            var author = m_data.author ? m_data.author : '';
            var title = m_data.title;
            $('.m_media_left i').remove();
            $('.m_media_left').append('<img src="'+cover+'" data="'+cover+'" att_id="">');
            $('input#moment_audio_name').val(title);
            $('input#moment_audio_author').val(author);
            $('input#moment_audio_url').val(url);

        } else {
            if($('.audio_choose').length > 0){
                var n_id = m_data.n_id;
                var index = $('.audio_choose li.'+type+'').index();
                UIkit.switcher('.audio_choose').show(index);
                $('.'+type+'_audio').append('<input type="text" placeholder="歌曲ID" name="moment_audio_api" id="moment_audio_api" class="required" required="required">');
                $('input#moment_audio_api').val(n_id);
            }
        }

        if($('.edit_audio_box').length == 1){
            clearInterval(add);
        }

    }, 100);
}

function edit_card(data) {
    var m_data = data.spec.content.medium;
    $('.card_sortble .moment_card_item').remove();
    $('.moment_card_type a').click();
    var pid = data.metadata.name;
    var card_list = $("#post-"+pid+"").find('.moment_card_item');
    var add = setInterval(function() {
        $('.show_card').show();
        $.each(m_data, function(index, value) {
            var srcValue = card_list.eq(index).find('img').attr('src');
            var h4Text  = card_list.eq(index).find('h4').text();
            $('.card_sortble').append(getcard(value.url,srcValue,h4Text,value.originType));
        });
        if($('.edit_card_box').length == 1){
            clearInterval(add);
        }
    }, 100);
}

