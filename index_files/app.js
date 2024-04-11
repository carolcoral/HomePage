var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
var storage = window.localStorage;

var lazyLoadInstance = new LazyLoad({});

$(document).on('click', '.left_menu_box ul li a , .widget_nav_menu ul li a', function () {
    var t = $(this);
    t.siblings("ul").slideToggle(200);
    t.parent().siblings().find("ul").hide(200);
    if (t.parent().hasClass('has_children')) {
        t.find('.drop_icon').toggleClass('up');
    }
    $('.left_menu_box ul li').removeClass('current-pjax-item current-menu-item current-menu-parent current-menu-ancestor');
    t.parent().addClass('current-pjax-item');
});

var route = location.href.substring(0, location.href.indexOf('?') === -1 ? (location.href.indexOf('#') === -1 ? location.href.length : location.href.indexOf('#')) : location.href.indexOf('?'))

$('.left_menu_box ul li a').each((i, e) => {
    if (e.parentElement.childNodes.length > 3) {
        return
    }
    let href = e.href.substring(0, e.href.indexOf('?') === -1 ? (e.href.indexOf('#') === -1 ? e.href.length : e.href.indexOf('#')) : e.href.indexOf('?'))
    if (route === href) {
        e.parentElement.classList.add('current-pjax-item')
    }
})
$('.left_menu_box ul li ul li a').each((i, e) => {
    let href = e.href.substring(0, e.href.indexOf('?') === -1 ? (e.href.indexOf('#') === -1 ? e.href.length : e.href.indexOf('#')) : e.href.indexOf('?'))
    if (route === href) {
        e.parentElement.parentElement.parentElement.classList.add('current-pjax-item')
    }
})


//全局loading
function loading_template() {
    tag = '<div class="loader" uk-spinner></div>';
    tag += '</div>';

    return tag;
}

function loading_start(target) {
    target.append(loading_template());
}

function loading_done(target) {
    target.children('.loader').remove();
}


//话题表情添加
$(document).on('click', 'a.smile_btn', function () {
    var a = $(this).html();
    var textarea = $("textarea#topic_content");
    var content = textarea.val();
    textarea.val(content + a);
    textarea.focus();
});

$(document).on('click', '.smile_box i', function () {
    var t = $(".smile_show");
    t.slideToggle(100);
});
//选择话题
$(document).on('click', '.t_cat_box li', function () {
    var name = $(this).find('.c_name span').html();
    $('.t_cat_toogle span').html(name);

    UIkit.dropdown('.t_cat_box').hide(false);
});

$(document).on('click', '.up_cat_btn', function () {
    var name = $('input#add_cat').val();
    if (!name) {
        cocoMessage.error("请填写话题");
        return false;
    }
    $('.t_cat_toogle span').text(name)
    UIkit.dropdown('.t_cat_box').hide(false);
});

$(document).on('click','.simi a',function(){
    var visible = $(this).attr('visible');
    if(visible == 'PUBLIC'){
        $(this).html('<i class="ri-lock-line"></i>').attr('visible','PRIVATE');
        $(this).children().css({"background":"#ddd","color":"#c6c6c6"});
    } else {
        $(this).html('<i class="ri-lock-unlock-line"></i>').attr('visible','PUBLIC');
        $(this).children().css({"background":"#e3efe7","color":"#66c187"});
    }
});

//消息通知
cocoMessage.config({
    duration: 2000,
});

//sortable事件 隐藏input
UIkit.util.on('.img_show', 'start', function (item) {
    $(".up_img_btn").hide();
});
UIkit.util.on('.img_show', 'moved', function (item) {
    var img_num = $('.add_img_box .t_media_item').length;
    if (img_num < 9) {
        $(".up_img_btn").show();
    }

});
UIkit.util.on('.img_show', 'stop', function (item) {
    var img_num = $('.add_img_box .t_media_item').length;
    if (img_num < 9) {
        $(".up_img_btn").show();
    }
});


//ajax上传图片到媒体库
$(document).on('change', '#topic_img_up', function (e) {
    e.preventDefault();
    if ($('#topic_img_up').val() == '') {
        return;
    }
    const policyName = Theme.moments.policyName;
    const groupName = Theme.moments.groupName;

    var data = new FormData($('topic_img_up')[0]);
    var imgtot = 0;
    $.each($('#topic_img_up')[0].files, function (i, file) {
        data.append('file', file);
        imgtot += file['size'];
    });
    policyName && data.append('policyName',policyName)
    groupName && data.append('groupName',groupName)

    //计算总大小
    var tot = imgtot / 1024000;
    $(".up_img_btn i").remove();
    $(".up_img_btn").prepend("<div class='img_load_text'><div uk-spinner='ratio: .6'></div><span>" + tot.toFixed(2) + "MB</span></div>");

    var num = $('.add_img_box .t_media_item').length;

    $.ajax({
        type: "POST",
        url: '/apis/api.console.halo.run/v1alpha1/attachments/upload',
        dataType: 'json',
        data: data,
        processData: false,
        contentType: false,
        beforeSend: function () {
            if (check_image_num()) {
                return false;
            }
            ;
            $('input#topic_img_up').attr('disabled', 'disabled');
        },
        success: function (data) {
            var thum = data.metadata.annotations["storage.halo.run/uri"] || data.metadata.annotations["storage.halo.run/external-link"]
            var src = thum;
            var media = '<div class="t_media_item" data-src="' + src + '" data-thum="' + thum + '">';
            media += '<a class="topic-img-de"><i class="ri-subtract-line"></i></a>';
            media += '<img src="' + thum + '">';//图片预览
            media += '</div>';
            $(".img_show").prepend(media);

            $(".img_load_text").remove();
            $(".up_img_btn").prepend("<i class='ri-add-line'></i>");
            if (num == '8') {
                $("a.up_img_btn").hide();
            }
            $('input#topic_img_up').removeAttr('disabled');
        },
    });
});

//检查上传图片数量
function check_image_num() {
    var num = $('.add_img_box .t_media_item').length;
    if (num > 8) {
        cocoMessage.error("最多上传9张图片");
        return true;
    }
    //if(num == '8'){$("a.up_img_btn").hide();}
}

//sortable事件 隐藏input
UIkit.util.on('.img_show', 'start', function (item) {
    $(".up_img_btn").hide();
});
UIkit.util.on('.img_show', 'moved', function (item) {
    var img_num = $('.add_img_box .t_media_item').length;
    if (img_num < 9) {
        $(".up_img_btn").show();
    }

});
UIkit.util.on('.img_show', 'stop', function (item) {
    var img_num = $('.add_img_box .t_media_item').length;
    if (img_num < 9) {
        $(".up_img_btn").show();
    }
});

//获取媒体库图片
$(document).on('click', '.up_from_media a', function () {
    $(".attch_nav .pre").hide();
    $(".attch_nav .nex").hide();
    $(".attch_nav").attr('paged', '1');
    $(".wp_get_media_list").empty();
    $(".show_media_box").show();
    $.ajax({
        type: "get",
        url: '/apis/api.console.halo.run/v1alpha1/attachments?group=&page=1&size=40&ungrouped=false',
        contentType: "application/json",
        beforeSend: function () {

        },
        success: function (data) {
            console.log(data)
            var list = data.items;
            $.each(list, function (i, value) {
                var thum = value.status.permalink;
                var src = value.status.permalink;
                var wf_media = '<li data-src="' + src + '"><img src="' + thum + '"></li>';//图片预览
                $(".wp_get_media_list").append(wf_media);
            });
            var max = data.totalPages;
            if (max > 1) {
                $(".attch_nav .nex").show();
            } else {
                $(".attch_nav .nex").hide();
            }

        }
    });
});

//媒体库分页
$(document).on('click', '.attch_nav a', function () {
    $(".wp_get_media_list").empty();
    var type = $(this).attr('class');
    var paged = $(".attch_nav").attr('paged');

    if (type == 'nex') {
        var paged = parseInt(paged) + 1;
    } else if (type == 'pre' && paged !== '') {
        var paged = parseInt(paged) - 1;
    }

    $(".attch_nav").attr('paged', paged);
    $.ajax({
        type: "get",
        url: `/apis/api.console.halo.run/v1alpha1/attachments?group=&page=${paged}&size=40&ungrouped=false`,
        contentType: "application/json",

        beforeSend: function () {

        },
        success: function (data) {
            $(".wp_get_media_list").empty();
            var list = data.items;
            $.each(list, function (i, value) {
                var thum = value.status.permalink;
                var src = value.status.permalink;
                var mediaType = value.spec.mediaType
                var wf_media = `<li data-src="${src}" data-type="${mediaType}"><img src="${thum}"></li>`;//图片预览
                $(".wp_get_media_list").append(wf_media);
            });

            var max = data.totalPages;
            if (max <= paged) {
                $(".attch_nav .nex").hide();
            } else {
                $(".attch_nav .nex").show();
            }

            if (paged > 1) {
                $(".attch_nav .pre").show();
            } else {
                $(".attch_nav .pre").hide();
            }

        }
    });
});

//收起媒体库
$(document).on('click', '.show_media_box .souqi', function () {
    $(".show_media_box").hide();
    $(".wp_get_media_list").empty();

});

//从媒体库插入图片
$(document).on('click', '.wp_get_media_list li', function () {
    var num = $('.add_img_box .t_media_item').length;
    if (num == '8') {
        $("a.up_img_btn").hide();
    }

    if (check_image_num()) {
        return false;
    }
    ;
    var thum = $(this).children().attr('src');
    var src = $(this).attr('data-src');
    var type = $(this).attr('data-type');
    var media = '<div class="t_media_item" data-src="' + src + '" data-thum="' + thum + '" data-type="' + type + '">';
    media += '<a class="topic-img-de"><i class="ri-subtract-line"></i></a>';
    media += '<img src="' + thum + '">';//图片预览
    media += '</div>';
    $(".img_show").prepend(media);

});

//删除图片
$(document).on('click', '.topic-img-de', function () {
    var msg = "确认删除此图片？";
    if (confirm(msg) == true) {
        $(this).parent().remove();
    } else {
        return false;
    }

    var num = $('.add_img_box .t_media_item').length;
    if (num < 9) {
        $("a.up_img_btn").show();
    }

});


//插入外部图片链接
$(document).on('click', '.up_from_cdn a', function () {
    //$(".show_media_box .souqi").click();
    $(".show_cdn_media").show();

});

//取消
$(document).on('click', 'a.img_link_cancel', function () {
    $(".show_cdn_media").hide();
});

//插入
$(document).on('click', 'a.img_link_btn', function () {
    var img_url = $("#img_link_up").val();
    //获得上传文件名
    if (!/\.(jpg|png|gif|webp|jpeg)$/.test(img_url) || img_url == '') {
        cocoMessage.error("图片格式不正确！");
        return false;
    }

    if (check_image_num()) {
        return false;
    }

    var num = $('.add_img_box .t_media_item').length;
    if (num == '8') {
        $("a.up_img_btn").hide();
    }

    var src = img_url;
    var type = 'image/'+img_url.substring(img_url.lastIndexOf('.') + 1);
    var media = '<div class="t_media_item" data-src="' + src + '" data-thum="' + src + '" data-type="' + type + '">';
    media += '<a class="topic-img-de"><i class="ri-subtract-line"></i></a>';
    media += '<img src="' + src + '">';//图片预览
    media += '</div>';
    $(".img_show").prepend(media);

    $("#img_link_up").val('');
});

//发布更新瞬间
$(document).on('click', '.push_item', function () {
    var content = $("#topic_content").val(); //内容
    var catname = $(".t_cat_toogle span").text(); //分类名
    var loca = $(".loca_text").text(); //位置
    var act = $('.push_item').attr('action');
    var pid = $('.push_item').attr('pid');
    var moment_type = $('.push_item').attr('type'); //片刻类型
    var visible = $(".simi a").attr('visible'); //私密  PUBLIC：公开 PRIVATE：私密

    var min = Theme.moments.min_push_num;

    if (min > 0) {
        if (content == '') {
            cocoMessage.error("请输入内容");
            return false;
        }

        if (content.length < min) {
            cocoMessage.error("内容不得少于" + min + "个字");
            return false;
        }
    }

    let tags = []
    if(catname!=null && catname!=''){
        tags.push(catname)
        content+=`<p><a class=\"tag\" href=\"?tag=${catname}\" data-pjax=\"\">${catname}</a></p>`
    }


    get_moment_data(moment_type);

    if(act == 'push'){
        $.ajax({
            type: "post",
            url: '/apis/console.api.moment.halo.run/v1alpha1/moments',
            contentType: "application/json",
            data: JSON.stringify({
                apiVersion: 'moment.halo.run/v1alpha1',
                kind: 'Moment',
                metadata: {generateName: "moment-"},
                spec:{
                    content: {
                        html: content,
                        medium: moment_data,
                        raw:content
                    },
                    owner: "",
                    tags:tags,
                    visible: visible
                },
            }),
            beforeSend: function () {
                cocoMessage.info("发布中..");
            },
            success: function (data) {
                cocoMessage.success('发布成功！');
                location.reload();
            },
            error: function (request) {
                cocoMessage.success('发布失败！');
                console.log(request)
            }

        });
    }

    if(act == 'update'){
        var version = $('.push_item').attr('version');
        var owner = $('.push_item').attr('owner');
        var releaseTime = $('.push_item').attr('releaseTime');

        $.ajax({
            type: "PUT",
            url: '/apis/moment.halo.run/v1alpha1/moments/'+pid,
            contentType: "application/json",
            data: JSON.stringify({
                apiVersion: 'moment.halo.run/v1alpha1',
                kind: 'Moment',
                metadata: {
                    generateName: "moment-",
                    name: pid,
                    finalizers:["tag-moment-protection","moment-protection"],
                    version: parseInt(version)
                },

                spec:{
                    content: {
                        html: content,
                        medium: moment_data,
                        raw:content
                    },
                    owner: owner,
                    releaseTime:releaseTime,
                    tags:tags,
                    visible: visible
                },
            }),
            beforeSend: function () {
                cocoMessage.info("更新中..");
            },
            success: function (data) {
                cocoMessage.success('更新成功！');
                location.reload();
            },
            error: function (request) {
                cocoMessage.success('更新失败！');
                console.log(request)
            }

        });
    }

});

//获取片刻类型参数
function get_moment_data(type) {
    moment_data = [];
    switch (type) {
        case "image":
            $(".t_media_item").each(function () {
                var src = $(this).attr('data-src');
                var type = $(this).attr('data-type');
                var obj = {
                    url: src,
                    type: "PHOTO",
                    originType: type
                }
                moment_data.push(obj); //图片
            });
            break;
        case "card":
            $(".card_sortble .moment_card_item").each(function(){
                var pid = $(this).attr('pid');
                var type = $(this).attr('type');
                var obj = {
                    url: pid,
                    type: "POST",
                    originType: type
                }
                moment_data.push(obj); //卡片
            });
            break;
        case "video":
            get_video_data();
            break;
    }
}

//片刻音乐参数
function get_audio_data() {
    var type = $('.audio_choose li.uk-active a').attr('au_type');
    if (type == 'local') {
        var url = $('input#moment_audio_url').val();
        var title = $('input#moment_audio_name').val();
        var author = $('input#moment_audio_author').val();
        var cover = $('.loacl_audio .audio_left img').attr('data');
        var obj = {
            url: url,
            type: "VIDEO",
            originType:'image/png'

        }

    } else {
        var n_id = $('input#moment_audio_api').val();
        var obj = {
            url: n_id,
            type: "VIDEO",
            originType:'image/png'
        }

    }

    moment_data.push(obj);

}

//片刻视频参数
function get_video_data() {
    var type = $('.video_choose li.uk-active a').attr('vi_type');
    if (type == 'local') {
        var url = $('input#moment_video_url').val();
        var obj = {
            url: url,
            type: "VIDEO",
            originType:'video/mp4'
        }

    } else if (type == 'bili') {
        var bvid = $('input#moment_video_bili').val();
        var obj = {
            url: bvid,
            type: "VIDEO",
            originType:'video/bili'
        }
    }
    moment_data.push(obj);

}

//片刻空值提示
function get_moment_error(type) {
    switch (type) {
        case "card":
            var v = $('.show_card .moment_card_item');
            if (v.length == 0) {
                return false;
            }
            break;
        case "audio":
            var au_type = $('.audio_choose li.uk-active a').attr('au_type');
            var url = $('input#moment_audio_url').val(); //歌曲链接
            var title = $('input#moment_audio_name').val(); //标题
            var cover = $('.loacl_audio .audio_left img').length; //封面
            if (au_type == 'local') {
                if (url == '' || title == '' || cover == 0) {
                    return false;
                }
            } else {
                var n_id = $('input#moment_audio_api').val();
                if (n_id == '') {
                    return false;
                }
            }
            break;
        case "video":
            var vi_type = $('.video_choose li.uk-active a').attr('vi_type');
            var url = $('input#moment_video_url').val();
            //var cover = $('.m_media_left img').length;
            if (vi_type == 'local') {
                if (url == '') {
                    return false;
                }
            } else {
                var bvid = $('input#moment_video_bili').val();
                if (bvid == '') {
                    return false;
                }
            }
            break;
    }
}

//ajax 分类筛选 moment
$(document).on('click', '.moment_cat_nav ul li a', function () {
    var t = $('.moment_cat_nav ul li a');
    if (t.hasClass('disabled')) {
        return false;
    }
    $('.moment_cat_nav ul li a').addClass('disabled');

    var temp = $("#comment_form_reset");
    var form = $(".respond_box");
    var form = $("#t_commentform").prop('outerHTML');
    temp.html(form);

    $(".moment_list").empty();
    $('#t_pagination a').hide();
    $(this).addClass('active');
    $(this).parent().siblings().children().removeClass('active');
    var cat = $(this).attr('data');

    $.ajax({
        type: "GET",
        url: cat,
        beforeSend: function () {
            $('.moment_list').html('<div class="loading_box"><div uk-spinner></div></div>');
        },
        success: function (data) {
            $('.moment_list .loading_box').remove();
            $('#t_pagination a').text(Theme.site_page);
            var result = $(data).find(".moment_list .p_item");

            $(".moment_list").append(result.fadeIn(300));

            var newhref = $(data).find("#t_pagination a").attr("href");

            if (newhref == undefined) {
                $('#t_pagination a').hide();
            } else {
                $("#t_pagination a").attr("href", newhref);
                $('#t_pagination a').show();
            }

            initAgree()

            lazyLoadInstance.update();
            $('.moment_cat_nav ul li a').removeClass('disabled');

        }
    });
});


//ajax加载片刻
$(document).on('click', '#t_pagination a', function () {
    const postListElement = document.getElementById("post_item");
    var href = $(this).attr('data');
    $.ajax({
        type: "GET",
        url: href,
        beforeSend: function () {
            $('#t_pagination .post-paging').html('<div uk-spinner></div>');
        },
        success: function (posts) {

            if (posts) {

                var result = $(posts).find(".moment_list .p_item");
                $('#t_pagination .post-paging').html(`<a>${Theme.site_page}</a>`);
                $(".moment_list").append(result.fadeIn(300));
                window.pjax.refresh(postListElement)
                var newhref = $(posts).find("#t_pagination a").attr("data"); //找出新的下一页链接

                if (newhref != undefined) {
                    $("#t_pagination a").attr("data", newhref);
                    $('#t_pagination a').show();
                } else {
                    $("#t_pagination a").hide(); //如果没有下一页了，隐藏
                }

                $body.animate({scrollTop: result.offset().top - 58}, 500);

                initAgree()

                lazyLoadInstance.update();
            } else {
                $('#t_pagination a').hide();
            }


        }
    });
    return false;

});


//ajax加载图库
$(document).on('click', '#p_pagination a', function () {
    var href = $(this).attr('data');
    $.ajax({
        type: "GET",
        url: href,
        beforeSend: function () {
            $('#p_pagination .post-paging').html('<div uk-spinner></div>');
        },
        success: function (photos) {
            if (photos) {
                var result = $(photos).find(".norpost_list .gallery-photo");
                $('#p_pagination .post-paging').html(`<a>${Theme.site_page}</a>`);
                $(".gallery-photos").append(result.fadeIn(300));

                var newhref = $(photos).find("#p_pagination a").attr("data"); //找出新的下一页链接

                if (newhref != undefined) {
                    $("#p_pagination a").attr("data", newhref);
                    $('#p_pagination a').show();
                } else {
                    $("#p_pagination a").hide(); //如果没有下一页了，隐藏
                }
                pix.initGalleryPhotos();
            } else {
                $('#p_pagination a').hide();
            }
        }
    });
    return false;

});

//阅读更多按钮
$(document).on('click', 'a.show-more-btn', function () {
    var t = $(this);
    t.prev().show();
    t.next().show();
    t.siblings('.dotd').hide();
    t.hide();
});

$(document).on('click', 'a.read-less-btn', function () {
    var t = $(this);
    t.siblings('.rm_hidden').hide();
    t.siblings('.dotd').show();
    t.prev().show();
    t.hide();
});


//加载阅读全文
/*
function load_readmore(post_data){
   var max = 80;
   var moretext = '更多';
   var lesstext = '收起';
   var data = $(post_data).find('.t_content p');
    $.each(data, function(index, value) {
    //console.log(value);
    var t =  $(this);
    var str = t.text();
    //if (str.length > max) {
    var excerpt = str.substring(0, max);
    var secdHalf = str.substring(max, str.length);
    var strtoadd = excerpt + "<span class='second-section'>" + secdHalf + "</span><a class='show-more-btn'  title='Click to Show More'>" + moretext + "</a><span class='read-less' title='Click to Show Less'>" + lesstext + "</span>";
    $(this).html(excerpt);
    
    //}
    console.log(excerpt);
});

}
*/

//正则替换链接 无用
function replaceReg(str) {
    var regexp = /((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
    return str.replace(regexp, function (m) {
        return '<a class="mo_link" target="_blank" href="' + m + '"><i class="ri-links-line"></i>' + m + '</a>';
    })
}

//ajax加载评论
$(document).on('click', '.show_comment', function () {
    $('.blog_list_inner').css('min-height', 'calc(100vh)');
    var pid = $(this).attr('pid');
    var other = $(this).parents('.moment_item').siblings('div');
    $.each(other, function (name, value) {

        //遍历每个 回复表单
        var otherid = $(this).find('.show_comment').attr('pid');
        $("#halo-comment-" + otherid).hide();

    });
    $(`#halo-comment-${pid}`).css('display', $(`#halo-comment-${pid}`).css('display') == 'block' ? 'none' : 'block');

});

//片刻点赞
$(document).on('click', '.up_like ', function () {

    if ($(this).hasClass('done')) {
        cocoMessage.info("您已经点过赞了");
        return false;
    } else {
        $(this).addClass('done');
        var pid = $(this).data("id");
        var key = $(this).data("key");
        console.log(key)
        let agreeArr = localStorage.getItem(`pix.upvoted.${key}.names`)
            ? JSON.parse(localStorage.getItem(`pix.upvoted.${key}.names`))
            : [];
        rateHolder = $(this).children('span');
        iconHolder = $(this).children('i');
        $.ajax({
            type: 'post',
            contentType: "application/json; charset=utf-8",
            url: '/apis/api.halo.run/v1alpha1/trackers/upvote',
            data: JSON.stringify({
                group: key == "moment" ? "moment.halo.run" : "content.halo.run",
                plural: key == "moment" ? "moments" : "posts",
                name: pid,
            }),
            success: function (data) {
                $(iconHolder).toggleClass('ri-heart-2-fill');
                var num = $(rateHolder).text();
                $(rateHolder).text(++num);
                agreeArr.push(pid);
                const val = JSON.stringify(agreeArr);
                localStorage.setItem(`pix.upvoted.${key}.names`, val);
                cocoMessage.success("感谢您的支持");
            }
        }); // end ajax

    }
});

function initAgree() {
    var agreeAnnius = $('.up_like')
    if (agreeAnnius.length > 0) {
        let agreeArr = JSON.parse(localStorage.getItem(`pix.upvoted.${$(agreeAnnius[0]).data("key")}.names`))
        for (var i = 0; i < agreeAnnius.length; i++) {
            let pid = $(agreeAnnius[i]).attr('data-id');
            if (agreeArr != null) {
                let flag = agreeArr.includes(pid);
                if (flag) {
                    $(agreeAnnius[i]).addClass('done');
                }
            }


        }
    }
}


//ajax分类筛选 posts
$(document).on('click', '.posts_cat_nav ul li a', function () {
    const postListElement = document.getElementById("post_item");
    var t = $('.posts_cat_nav ul li a');
    if (t.hasClass('disabled')) {
        return false;
    }
    $('.posts_cat_nav ul li a').addClass('disabled');

    $(".norpost_list").empty();
    $('#pagination a').hide();
    $(this).addClass('active');
    $(this).parent().siblings().children().removeClass('active');
    var cat = $(this).attr('data');
    $.ajax({
        type: "GET",
        url: cat,
        headers: {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
        },
        beforeSend: function () {

            $('.norpost_list').html('<div class="loading_box"><div uk-spinner></div></div>');
        },
        success: function (data) {
            $('#pagination a').text(Theme.site_page);

            var result = $(data).find(".norpost_list").children();
            $(".norpost_list").append(result.fadeIn(300));
            window.pjax && window.pjax.refresh(postListElement)
            let newhref = $(data).find("#pagination a").attr("data") || $(data).find(".arc_pagenav a").attr("data");

            if (newhref != undefined) {
                $("#pagination a").attr("data", newhref);
                $('#pagination a').show();
            } else {
                $('#pagination a').hide();
            }
            $('.loading_box').remove();
            initAgree()
            lazyLoadInstance.update();
            $('.posts_cat_nav ul li a').removeClass('disabled');

        }
    });
});

//首页ajax加载文章
$('body').on('click', '#pagination a', function () {
    const postListElement = document.getElementById("post_item");
    var href = $(this).attr('data');
    $.ajax({
        type: "GET",
        url: href,
        headers: {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
        },
        beforeSend: function () {
            $('#pagination .post-paging').html('<div uk-spinner></div>');
        },
        success: function (data) {
            if (data) {
                var result = $(data).find(".norpost_list ").children();
                $('#pagination .post-paging').html(`<a>${Theme.site_page}</a>`);
                $('.norpost_list').append($(result).fadeIn(400));

                window.pjax && window.pjax.refresh(postListElement)

                var newhref = $(data).find("#pagination a").attr("data") || $(data).find(".arc_pagenav a").attr("data"); //找出新的下一页链接

                if (newhref != undefined) {
                    $("#pagination a").attr("data", newhref);
                    $('#pagination a').show();
                } else {
                    $("#pagination a").hide(); //如果没有下一页了，隐藏
                }
                $body.animate({scrollTop: result.offset().top - 58}, 500);
                initAgree()
                lazyLoadInstance.update();
            }

        }
    });
    return false;
});

//分类页面文章加载
$('body').on('click', '.arc_pagenav a', function () {
    const postListElement = document.getElementById("post_item");
    $(this).hide();
    var content = $('.norpost_list');
    var href = $(this).attr('data');
    if (href != undefined) {
        $.ajax({
            type: "GET",
            url: href,
            headers: {
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
            },
            beforeSend: function () {
                $('.arc_pagenav').append('<div uk-spinner></div>');
            },
            success: function (data) {
                var post = $(data).find(".norpost_list").children();
                content.append(post.fadeIn(300));

                window.pjax && window.pjax.refresh(postListElement)

                var newhref = $(data).find(".arc_pagenav a").attr("data"); //找出新的下一页链接
                if (newhref != undefined) {
                    $(".arc_pagenav a").attr("data", newhref);
                    $('.arc_pagenav a').show();
                } else {
                    $(".arc_pagenav a").hide(); //如果没有下一页了，隐藏
                }

                $('.arc_pagenav .uk-spinner').remove();

                $body.animate({scrollTop: post.offset().top - 58}, 500);
                initAgree()
                lazyLoadInstance.update();
            }
        });
    }

    return false;

});

//退出登录
$('body').on('click', '.inner .logout , .admin_tool .logout', function () {

    axios.post('/logout').then((res) => {
        window.location.reload()
    }).catch(function (error) {
        var response = error.response
        console.log(error)
        cocoMessage.error(response.data.detail);
    })

});

//登录
$('body').on('submit', 'form#login', function (e) {
    action = 'ajaxlogin';
    username = $('form#login #username').val();
    password = $('form#login #password').val();

    if (username == '' || password == '') {
        cocoMessage.error('请填写用户名或密码');
        return false;
    }

    function randomUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0,
                v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    const handleLogin = async () => {
        const {data: publicKey} = await axios.get('/login/public-key')
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey.base64Format);

        const token = randomUUID();
        document.cookie = `XSRF-TOKEN=${token}; Path=/;`;
        var formData = {
            _csrf: token,
            username: username,
            password: encrypt.encrypt(password)
        };
        cocoMessage.info('登陆中...');

        await axios.post(
            '/login',
            formData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }).then((res) => {
            if (res.status == 200) {
                cocoMessage.success('登录成功');
                localStorage.setItem('username', username);
                window.location.reload()
            }
        }).catch(function (error) {
            var response = error.response
            console.log(error)
            cocoMessage.error(response.data.detail);
        })
    }
    handleLogin()

    e.preventDefault();
});


$(document).on('mouseenter', '.lbc .left_menu_box ul li a , body.mod_third_s .left_menu_box ul li a', function (event) {
    var title = $(this).find('.nav_title').text();
    $(this).append("<span class='menu_tips'>" + title + "</span>");
});

$(document).on('mouseleave', '.lbc .left_menu_box ul li a , body.mod_third_s .left_menu_box ul li a', function (event) {
    $(this).find('.menu_tips').remove();

});

//滚动
$(document).ready(function (e) {
    $(window).scroll(function () {

        var b = $(window).scrollTop(); //监控窗口已滚动的距离;

        if (b > 190) {

            $('.top_bar').addClass('mobile_active');

        } else {
            $('.top_bar').removeClass('mobile_active');
        }

        if (b > 200) {
            $('a.go_top').addClass('show');
        } else {
            $('a.go_top').removeClass('show');
        }

    });
});

$.fn.autoTextarea = function (options) {
    var defaults = {
        maxHeight: null,//文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
        minHeight: 50
    };
    var opts = $.extend({}, defaults, options);
    return $(this).each(function () {
        $(this).bind("paste cut keydown keyup focus blur", function () {
            var height, style = this.style;
            this.style.height = opts.minHeight + 'px';
            if (this.scrollHeight > opts.minHeight) {
                if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
                    height = opts.maxHeight;
                    style.overflowY = 'scroll';
                } else {
                    height = this.scrollHeight;
                    style.overflowY = 'hidden';
                }
                style.height = height + 'px';
            }
        });
    });
};

//$("textarea#comment").autoTextarea({
// maxHeight: 160,//文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
//});

$('body').on('click', '.com_msg_btn', function () {

    var num = $(this).attr('check');
    if (num == 0) {
        return false;
    }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: Theme.ajaxurl,
        data: {
            'action': 'up_unread_msg',
        },
        beforeSend: function () {

        },
        success: function (data) {
            if (data.code == '0') {
                $('small.f_unread_num').remove();
            } else {
                return false;
            }
        }
    });

});

//黑暗模式
$('body').on('click', '.t_dark a', function () {
    var date = new Date();
    date.setTime(date.getTime() + (3 * 60 * 60 * 1000));
    var t = $('html');
    if (t.hasClass('dark')) {
        document.cookie = "dark=normal;path=/;expires=" + date.toGMTString();
    } else {
        document.cookie = "dark=dark;path=/;expires=" + date.toGMTString();
    }
    t.toggleClass('dark');

});
//片刻管理按钮  

$(document).on('mouseenter', '.post_control_btn', function (event) {
    var a = $(this).siblings('.post_control_box');
    a.addClass('show');
});

$(document).on('mouseleave', '.post_control', function (event) {
    $(this).find('.post_control_box').removeClass('show');
});


//社交小工具二维码
$(document).on('mouseenter', '.sw_social', function (event) {
    var qrbox = $(this).siblings('.sw_qrcode');
    if (qrbox.length > 0) {
        qrbox.addClass('active');
        qrbox.fadeIn(200);
    }
});

$(document).on('mouseleave', '.sw_social', function (event) {
    var qrbox = $(this).siblings('.sw_qrcode');
    if (qrbox.length > 0) {
        qrbox.removeClass('active');
        qrbox.fadeOut(200);
    }
});

//点击收起移动侧栏
$('body').on('click', '.m_offcanvas', function () {
    UIkit.offcanvas('.m_offcanvas').hide();
});

//刷新一言
$('body').on('click', '.yiyan_box .change', function () {
    var url = Theme.widget_yiyan.api || 'https://v1.hitokoto.cn'
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const hitokoto = document.querySelector('.yiyan_box p')
            hitokoto.setAttribute("uk-tooltip", data.from);
            hitokoto.innerText = data.hitokoto

        })
        .catch(console.error)

});

$('.yiyan_box .change').click();

//pjax
if (Theme.pjax) {
    let pjaxSelectors = ["head title", "#pjax-container", ".pjax"]
    var pjax = new Pjax({
        elements: 'a:not([target="_blank"]):not([pjax="exclude"])',
        selectors: pjaxSelectors,
        analytics: false,
        cacheBust: false,
    });

    document.addEventListener('pjax:send', function () {
        NProgress.start();
    })

    document.addEventListener('pjax:complete', function () {
        lazyLoadInstance.update();
        typeof hljs === 'object' && hljs.highlightAll();
        typeof Prism === 'object' && Prism.highlightAll();
        autoload_posts_music();
        initBlog();
        NProgress.done();
    })
}

$('body').on('click', '.msg_modal_inner .unread_box .box .mark_read', function (e) {
    console.log(e)
    let msg_name = $(this).parent()[0].getAttribute('msg-name')
    let username = localStorage.getItem('username')
    $.ajax({
        type: "put",
        url: `/apis/api.notification.halo.run/v1alpha1/userspaces/${username}/notifications/${msg_name}/mark-as-read`,
        success: function (res) {
            console.log(res)
            pix.getMsg()
        }
    });
})



const getWindowInfo = () => {
    pix.initTopBar()
};
const debounce = (fn, delay) => {
    let timer;
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn();
        }, delay);
    }
};

const cancalDebounce = debounce(getWindowInfo, 1);
window.addEventListener('resize', cancalDebounce);



//固定顶部栏
$(document).scroll(function () {
    let topBar = $('#masthead .top_bar');
    var placeholder = document.querySelector('#masthead .uk-sticky-placeholder');
    console.log()
    var width = topBar.width();
    var scrT = document.documentElement.scrollTop;
    if (window.innerWidth > 960) {
        // 如果滚动的距离>60
        if (scrT > 60) {
            topBar.addClass('uk-active uk-sticky-fixed').css({"width": width, "top": '0px', "position": "fixed"});
            placeholder.hidden = false;
        } else {
            topBar.removeClass('uk-active uk-sticky-fixed').css({"width": "auto", "top": "auto", "position": ""});
            placeholder.hidden = true;
        }
    } else {
        // 如果滚动的距离>0
        if (scrT > 0) {
            topBar.addClass('uk-active uk-sticky-below')
        } else {
            topBar.removeClass('uk-active uk-sticky-below')
        }

    }

});


$('body').on('click', '.listree-btn', function () {
    "目录[+]" == $(".listree-btn").text() ? $(".listree-btn").attr("title", "收起").text("目录[-]").parent().next().show() : $(".listree-btn").attr("title", "展开").text("目录[+]").parent().next().hide();
    return !1
});

// toc
function autotree() {
    $(document).ready(function() {
        $('.listree-titles').html('<a class="listree-btn" title="展开">目录[+]</a>')
        $('#listree-ol').empty();
        $("#listree-ol").css("display", "none")
        var f = 1
            , T = $("#listree-ol");
        $(".single-content").find("h1, h2, h3,h4,h5,h6").each(function(b) {
            if ("" !== $(this).text().trim()) {
                $(this).attr("id", "listree-list" + b).attr("class", "listree-list");
                var Q = parseInt($(this)[0].tagName.slice(1));
                0 === b || Q === f ? (b = $('<li><a id="listree-click" href="#listree-list' + b + '">' + $(this).text() + "</a></li>"),
                    T.append(b)) : Q > f ? (b = $('<ul><li><a id="listree-click" href="#listree-list' + b + '">' + $(this).text() + "</a></li></ul>"),
                    T.append(b),
                    T = b) : Q < f && (b = $('<li><a id="listree-click" href="#listree-list' + b + '">' + $(this).text() + "</a></li>"),
                    1 === Q ? ($("#listree-ol").append(b),
                        T = $("#listree-ol")) : (T.parent("ol").append(b),
                        T = T.parent("ol")));
                f = Q
            }
        });
        $(".listree-btn").click(function() {
            "目录[+]" == $(".listree-btn").text() ? $(".listree-btn").attr("title", "收起").text("目录[-]").parent().next().show() : $(".listree-btn").attr("title", "展开").text("目录[+]").parent().next().hide();
            return !1
        });
        $("a#listree-click").click(function(f) {
            f.preventDefault();
            $("html, body").animate({
                scrollTop: $($(this).attr("href")).offset().top - 77
            }, 800)
        });
        if(1 < f){
            $(".listree-box").css("display", "block")

        }else{

            $(".listree-box").css("display", "none")
        }
    })
    jQuery(document).ready(function(f) {
        var T = f(".listree-list");
        if (T.length < 1)
            return;
        var b = [];
        function Q() {
            T.each(function() {
                var T = f(this).offset();
                b.push(Math.floor(T.top))
            })
        }
        function a(T) {
            var b = f("#listree-ol li");
            var Q = f(".listree-list dt");
            if (b.length < 1)
                return;
            var a = b.outerHeight();
            if (!b.eq(T).hasClass("current")) {
                b.removeClass("current");
                b.eq(T).addClass("current");
                Q.animate({
                    top: a * T + (b.outerHeight() - Q.outerHeight()) / 2 + 1
                }, 50)
            }
        }
        function X() {
            if ($('#listree-ol').children().length < 1)
                return;
            var f = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            var Q = Math.ceil(f + 77);
            var X = 0;
            for (var aU = 0; aU < b.length; aU++) {
                if (Q >= b[aU]) {
                    X = aU
                } else {
                    break
                }
            }
            if (X < 0)
                X = 0;
            if (!T.eq(X).hasClass("current")) {
                T.removeClass("current");
                T.eq(X).addClass("current");
                a(X)
            }
        }
        Q();
        setTimeout(X, 0);
        f(window).on("scroll", X)
    });
}
pix.addRuntime();

$(document).ready(function() {
    $("[data-fancybox]").fancybox({
        selector: '[data-fancybox]',
        loop: true,
        transitionEffect: 'slide',
        protect: true,
        buttons: ['slideShow', 'fullScreen', 'thumbs', 'close'],
        hash: false
    })
})


function initBlog() {
    pix.initTopBar(),
        pix.getMsg(),
        initAgree(),
        pix.initGalleryPhotos(),
        pix.loadLightbox(),
        pix.topCategoriesBarScroll(),
        pix.topTableBarScroll(),
        autotree()
}

initBlog()




