var pix = {


    /**
     * 页面運行時間
     */
    addRuntime: function () {
        const $runtimeCount = document.getElementById('runtimeshow');
        if ($runtimeCount) {
            var s1 = $runtimeCount.innerText;//建站时间
            if (s1) {
                s1 = new Date(s1.replace(/-/g, "/"));
                s2 = new Date();
                var days = s2.getTime() - s1.getTime();
                var number_of_days = parseInt(days / (1000 * 60 * 60 * 24));
                $runtimeCount.innerText = number_of_days + '天';
            }
        }
    },

    loadLightbox: function () {
        /**
         * fancybox
         */
        const addFancybox = function (ele) {
            const runFancybox = (ele) => {
                ele.each(function (i, o) {
                    const $this = $(o)
                    const lazyloadSrc = $this.attr('data-src') || $this.attr('src')
                    const dataCaption = $this.attr('alt') || ''
                    $this.wrap(`<a href="${lazyloadSrc}" data-fancybox="images" class="fancybox" data-srcset="${lazyloadSrc}"></a>`)
                })
            }

            runFancybox($(ele))
        }
        const $fancyboxEle = document.querySelectorAll('.single-content :not(a) > img,.single-content > img')
        if ($fancyboxEle.length > 0) {
            addFancybox($fancyboxEle)
        }

    },

    initTopBar: function () {
        let topBar = $('#masthead .top_bar');
        var placeholder = document.querySelector('#masthead .uk-sticky-placeholder');
        var width = $('#masthead').width();
        var height = '71.9979px;'
        if (window.innerWidth < 960) {
            if (window.innerWidth <= 540) {
                height = '63.9957px'
            }
            topBar.addClass('uk-sticky-fixed').css({ "width": width, "top": '0px', "position": "fixed" });
            $('#masthead .uk-sticky-placeholder').css({ "width": width, "height": height, "margin": "0px" });
            placeholder.hidden = false;
        } else {
            topBar.removeAttr("style");
            $('#masthead .uk-sticky-placeholder').css({ "width": width, "height": '71.9979px;', "margin": "0px" });
            placeholder.hidden = true;
        }
    },


    getMsg: function () {
        var com_msg_btn = $('.com_msg_btn')
        var msg_modal_inner = $('.msg_modal_inner')
        let username = localStorage.getItem('username')
        var f_unread_num = 0;
        if (com_msg_btn.length > 0) {
            $.ajax({
                type: "get",
                url: `/apis/api.notification.halo.run/v1alpha1/userspaces/${username}/notifications?fieldSelector=spec.unread=true`,
                success: function (res) {
                    if (res.total > 0) {
                        f_unread_num = res.total
                        com_msg_btn.append(`<small class="f_unread_num">${res.total}</small>`);
                    }
                    if (msg_modal_inner.length > 0) {
                        $.ajax({
                            type: "get",
                            url: `/apis/api.notification.halo.run/v1alpha1/userspaces/${username}/notifications?page=1&size=10`,
                            success: function (res) {
                                var data = res.items
                                if (data.length > 0) {
                                    var unread_box = `
                                        <div class="unread_box">
                                        <div class="unread_tip"># 您有${f_unread_num}条未读消息 #
                                        <a href="/uc/notifications" target="_blank">查看全部</a>
                                        </div>
                                    `
                                    var read_box = `
                                       <div class="read_box">
                                    `
                                    var unreadSum = 0
                                    data.forEach((e => {
                                            if (e.spec.unread) {
                                                unreadSum = unreadSum + 1;
                                                unread_box += `
                                            <div class="vi_reply_item">
                                                <div class="box" msg-name="${e.metadata.name}">
                                                    <span class="mark_read">标记为已读</span>
                                                    <div class="avatar_top"><img alt=""
                                                            src="https://cravatar.cn/avatar/?d=mp"
                                                            class="avatar avatar-50 photo" height="50" width="50" decoding="async"></div>
                                                    ${e.spec.htmlContent}
                                                </div>
                                            </div>
                                            `
                                            } else {
                                                read_box += `
                                            <div class="vi_reply_item">
                                                <div class="box">
                                                    <div class="avatar_top"><img alt=""
                                                             src="https://cravatar.cn/avatar/?d=mp"
                                                            class="avatar avatar-50 photo" height="50" width="50" decoding="async"></div>
                                                    ${e.spec.htmlContent}
                                                </div>
                                            </div>
                                            `
                                            }
                                        }
                                    ))
                                    unread_box += `</div>`
                                    read_box += `</div><p class="msg_limit">只显示最新10条未读和已读信息</p> `
                                    msg_modal_inner.html(unread_box + read_box)

                                } else {
                                    msg_modal_inner.html(`
                                    <p class="no_posts"><small># 暂无消息 #</small><img class="s_nodata"
                                                src="/themes/theme-pix/assets/img/nodata.png"></p>
                                    <p class="msg_limit">只显示最新10条未读和已读信息</p>
                                    `)
                                }
                            },
                            error: function () {
                                msg_modal_inner.html(`
                                <p class="no_posts"><small># 暂无消息 #</small><img class="s_nodata"
                                            src="/themes/theme-pix/assets/img/nodata.png"></p>
                                <p class="msg_limit">只显示最新10条未读和已读信息</p>
                                `)

                            },
                        });
                    }
                }
            });

        }

    },


    initGalleryPhotos: function () {
        var galleryPhotos = document.querySelectorAll('.gallery-photos .gallery-photo');
        if (galleryPhotos.length > 0) {
            // 瀑布流排版
            imgStatus.watch('.photo-img', () => {
                waterfall('.gallery-photos');
            });
        }

    },

    topCategoriesBarScroll: function () {
        if (document.getElementById("cat_nav_items")) {
            let xscroll = document.getElementById("cat_nav_items");
            xscroll.addEventListener("mousewheel", function (e) {
                //计算鼠标滚轮滚动的距离
                let v = -e.wheelDelta / 2;
                xscroll.scrollLeft += v;
                //阻止浏览器默认方法
                e.preventDefault();
            }, false);
        }
    },

    topTableBarScroll: function () {
        var tables = document.querySelectorAll('.single-content table')
        if (tables.length>0) {
            tables.forEach(function (xscroll) {
                xscroll.addEventListener("mousewheel", function (e) {
                    //计算鼠标滚轮滚动的距离
                    let v = -e.wheelDelta / 2;
                    xscroll.scrollLeft += v;
                    //阻止浏览器默认方法
                    e.preventDefault();
                }, false);
            })
        }
    },
}