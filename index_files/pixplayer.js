/*
* pix主题音乐播放器 
*/

var rem=[];
rem.audio = $('<audio id="pix_player"></audio>');

var audiobox = $('<audio id="pix_player"></audio>');
var au = $('#pix_player');
var volume = 1;
var loop = Theme.play.m_loop;
var playlist = [];
var post_playlist = [];
var Paused = true;
var playLrc = '';

var m_cover = $('.player_mod .m_cover img');
var m_title	= $('.player_mod .m_info h2');
var m_artist = $('.player_mod .m_info small');


$(document).on('click','.play_btn',function(){
	$('.player_box').append(audiobox);
	$('.pix_player').removeClass('playing');
    $(this).parents('.pix_player').addClass('playing');
    var url = $(this).attr('data');
    var audio_s = $('#pix_player').attr('src');
	//var play = new Audio(url);

	var meta = $(this).siblings('.player_meta').find('.title');
	m_title.text(meta.find('.name').text());
	m_artist.text(meta.find('.author').text());
	m_cover.attr('src',$('.pix_player.playing .player_thum img').attr('src'));

    if(audio_s == '' || audio_s !== url){
		$('#pix_player').attr('src',url);
		audiobox[0].play();
    } else {
		pasued();
    }

	$(".play_btn").html("<i class='ri-play-line'></i>");

	initAudio();
});

// 初始化函数
function initAudio(){

	// 给音乐标签绑定事件之后所触发的函数
	audiobox[0].addEventListener("play",audioplay);
	audiobox[0].addEventListener("pause",audiopause);
	// timeupdate,代表音乐播放过程中只要发生变化就触发updateProcess
	audiobox[0].addEventListener("timeupdate",updateProcess);
	if(Theme.bgm_open == true){
		audiobox[0].addEventListener("ended",endplay);
	}
}

//音乐结束触发
function endplay(){
	var index = $('.musci_list_box li.active').index() + 1;
	var max = $('.musci_list_box li').length;
	var new_mid = 0;
	if(loop=="one"){
		new_mid = index-1;
	}else if(loop=="none") {
		new_mid = (Math.floor(Math.random() * max) + 1)-1;
	}else if(loop=="all") {
		new_mid = index > (max - 1) ? 0 : index;
	}
	mulist_play(new_mid);
}

// 当音乐标签加载完成之后所触发的函数
audiobox[0].oncanplay=function(){
	// 音乐的总时间
	var duration=handleTime(this.duration);
	// 音乐播放的当前时间
	var currenttime=handleTime(this.currentTime);
	$(".timer .total_time").text(duration);
	$(".timer .current_time").text(currenttime);
	initAudio();
}

// 音乐播放暂停的函数
function pasued(){
	// paused,保存音乐播放和暂停的状态
	if(Paused === false){//音乐是一个播放状态
		audiobox[0].pause();
	}else{
		audiobox[0].play();
	}
}

// 音乐播放之后触发的函数
function audioplay(){
	//var height = $('.footer_menu').height();
	var mheight = $('.footer_nav_box').height();
	$('.footer_nav_box').animate({top:-mheight},200,'linear');
	//music_bar.lock(false);//取消进度条的锁定
	Paused=false;//更新音乐的播放状态(暂停)
	$(".pix_player.playing .play_btn").html("<i class='ri-pause-line'></i>");//暂停按钮
	$('.m_play').html('<i class="ri-pause-circle-fill"></i>');
}

// 音乐暂停之后触发的函数
function audiopause(){
	//music_bar.lock(true);//添加进度条的锁定
	Paused=true;  //播放的状态
	$(".pix_player.playing .play_btn").html("<i class='ri-play-line'></i>");
	$('.m_play').html('<i class="ri-play-circle-fill"></i>');
}

// 更新进度条
function updateProcess(){
	// 如果音乐不是暂停状态，则继续执行函数的代码块
	if(Paused!==false) return true;
	// 音乐的总时间
	var duration = handleTime(this.duration);
	// 音乐播放的当前时间
	var currenttime = handleTime(this.currentTime);
	var percent = audiobox[0].currentTime/audiobox[0].duration;
	$(".player_mod .player_bar .progress").css('width',(percent)*100+"%");
	$(".timer .total_time").text(duration);
	$(".timer .current_time").text(currenttime);
}

//循环歌曲  m_loop
$(document).on('click','.m_loop',function(){
	if($(this).hasClass('all')){   // 如果当前是循环
		$(this).removeClass('all');
		$(this).addClass('one');
		$(this).html('<i class="ri-repeat-one-line"></i>');
		loop = 'one';
	}else if(($(this).hasClass('one'))){  // 如果当前是单曲循环
		$(this).removeClass('one');
		$(this).addClass('none');
		$(this).html('<i class="ri-shuffle-line"></i>');
		loop = 'none';
	}else {
		$(this).removeClass('none');
		$(this).addClass('all');
		$(this).html('<i class="ri-repeat-line"></i>');
		loop = 'all';
	}
});

// 时间处理的函数
function handleTime(seconedTime){
	// 定义一个变量保存分钟
	var minute=parseInt(seconedTime/60,10);
	if(minute<10){minute="0"+minute};
	//console.log(minute);
	// 定义变量存放秒数
	var second=(seconedTime-minute*60).toFixed(2).split(".")[0];
	//console.log(second);
	if(second<10){second="0"+second};
	var Time=minute+":"+second;
	// 返回最终的时间数值
	return Time;
}

//视频播放
var video = $('#pix_video_player');
$(document).on('click','.video_play_btn',function(){
	var video = $(this).siblings('#pix_video_player');
	video.attr('controls','controls'); //显示控制条
	$(this).remove(); //去除覆盖层
	video[0].play();
});

function stopOtherMedia(element) {

    $("video").not(element).each(function(index, video) {
        video.pause();
    });

}




//背景音乐
function autoload_music() {
	var state = Theme.bgm_open;
	var api =  `${Theme.play.pix_mu_api || 'https://api.i-meto.com/meting/api'}?server=:server&type=:type&id=:id&r=:r`
	var meta = {
		server : Theme.play.mu_source,
		type : Theme.play.mu_type,
		id : Theme.play.play_id,
		auth : ''
	}
	if(state == true){
		let url = api.replace(":server", meta.server).replace(":type", meta.type).replace(":id", meta.id).replace(":auth", meta.auth).replace(":r", Math.random());
		$.ajax({
			type: "get",
			url:url,
			success: function (res) {
				if(res.length > 0){
					var new_mid = 0;
					if(loop=="none") {
						new_mid = (Math.floor(Math.random() * res.length) + 1)-1;
					}
					var f = res[new_mid];
					var playnum = 1;
					//$(".m_play").html('<i class="ri-pause-circle-line"></i>');

					//默认播放第一首
					audiobox.attr('src',f.url);
					playLrc = f.lrc;
					$('.player_mod .m_cover img').attr('src',f.pic);
					$('.player_mod .m_info h2').text(f.title || f.name);
					$('.player_mod .m_info small').text(f.author || f.artist);
					$('.player_box').append(audiobox);


					//存储一个播放列表
					playlist.push(res);

					//插入播放列表
					$.each(res, function(key, data) {
						$(".musci_list_box").append('<li class="item" id='+ key +'>'  + playnum++ + '. ' + (data.title || data.name) + ' - ' + (data.author || data.artist) + '</li>');
					});

					$(".musci_list_box li").removeClass('active').eq(new_mid).addClass('active');
					//console.log(playlist);
				} else {
					$(".musci_list_box").append('<div class="nodata">背景音乐未设置</div>');
				}

			}
		});
	}

}


//播放选中音乐
function mulist_play(index){
	audiobox[0].removeEventListener("play",audioplay);
	audiobox[0].removeEventListener("pause",audiopause);
	$(".pix_player.playing .play_btn").html("<i class='ri-play-line'></i>");
	$(".m_play").html('<i class="ri-pause-circle-fill"></i>');
	$('.musci_list_box li').eq(index).addClass('active').siblings().removeClass('active');
	scrollToPosition(index);
	var data = playlist[0][index];
	playLrc = data.lrc;
	//console.log(data);
	audiobox.attr('src',data.url);
	m_cover.attr('src',data.pic);
	m_title.text(data.title || data.name);
	m_artist.text(data.author || data.artist);
	audiobox[0].play();

	Paused = false;
}

//点击展开播放列表
$(document).on('click', '.ri-bar-chart-horizontal-line', function () {
	var position = $('.musci_list_box li.active').index()
	// 延迟一段时间后进行滚动
	setTimeout(function () {
		if($('.m_list').attr('aria-expanded')){
			scrollToPosition(position)
		}
	}, 200); // 延迟100毫秒后执行滚动操作
});

//点击列表播放
$(document).on('click','.musci_list_box li',function(){
	$('.musci_list_box li').removeClass('active');
	$(this).addClass('active');
	var id = $(this).attr('id');
	mulist_play(id)
});

//上一首
$(document).on('click','.m_prev',function(){
	var index = $('.musci_list_box li.active').index() - 1;
	var max = $('.musci_list_box li').length;
	var new_mid = 0;
	if(loop=="none") {
		new_mid = (Math.floor(Math.random() * max) + 1)-1;
	}else {
		new_mid = index < 0 ? max - 1 : index;
	}
	mulist_play(new_mid);
});

//下一首
$(document).on('click','.m_next',function(){
	var index = $('.musci_list_box li.active').index() + 1;
	var max = $('.musci_list_box li').length;
	var new_mid = 0;
	if(loop=="none") {
		new_mid = (Math.floor(Math.random() * max) + 1)-1;
	}else{
		new_mid = index > (max - 1) ? 0 : index;
	}
	mulist_play(new_mid);
});


//播放和暂停
function m_play() {

	if(Paused === false){//音乐是一个播放状态
		audiobox[0].pause();
		$('.m_play').html('<i class="ri-play-circle-fill"></i>');
		Paused = true;
	}else{
		audiobox[0].play();
		$('.m_play').html('<i class="ri-pause-circle-fill"></i>');
		Paused = false;
	}

}

//播放按钮
$(document).on('click','.m_play',function(){
	if(!$("#pix_player").length > 0){
		cocoMessage.error('没有音乐可播放');
		return false;
	} else {
		m_play();
	}

});

/*
document.addEventListener('click', musicPlay);
function musicPlay() {
    audiobox[0].play();
    document.removeEventListener('click', musicPlay);
}
*/

//触发显示播放器
var trigger;
function mu_box_show(){
	clearTimeout(trigger);
	var mheight = $('.footer_nav_box').height();
	$('.footer_nav_box').animate({top:-mheight},200,'linear');
}

function mu_box_hide(){
	$('.footer_nav_box').animate({top:"0px"},200,'linear');
}

$(document).on('mouseenter', '.player_hand , .footer_nav_box', function(event) {
    mu_box_show();

});

$(document).on('mouseleave', '.footer_nav_box .right_inner', function(event) {

    trigger = setTimeout(function(){
        mu_box_hide();
    },2000);

});

//音乐进度条跳转
function getMousePosition(e){
	var e = e || window.event;
	var x = e.pageX;
	var y = e.pageY;
	return {'left':x,'top':y}
}

$(document).on('click','.player_bar',function(){
	// 获取当前鼠标点击的位置
	// console.log(getMousePosition().left)
	// console.log($('.progress').offset())
	var long = (getMousePosition().left) - ($('.progress').offset().left);
	// console.log(long)
	// 将当前点击的长度重新给p标签
	$('.progress').width(long);
	// 获得当前点击长度的时间
	allTime = parseInt(audiobox[0].duration);
	var nowtime = (long/$('.player_bar').width()) * allTime;
	audiobox[0].currentTime = nowtime;
});


//音量调节  m_volume
$(document).on('click','.m_volume',function(){
	if($(this).hasClass('mute')){   // 如果当前是静音
		$(this).removeClass('mute');
		$(this).html('<i class="ri-volume-down-line"></i>');
		audiobox[0].muted = false;
	}else{  // 如果当前不是静音
		$(this).addClass('mute');
		audiobox[0].muted = true;
		$(this).html('<i class="ri-volume-mute-line"></i>');

	}
});

$(document).on('click','.vo_bar',function(){
	var long = (getMousePosition().top) - ($(this).offset().top)

	var meter = long / $(this).height();
	var finalLong = 1 - meter;

	$('.vo_size').height(finalLong * $(this).height());

	// 将audio音量调整为对应的音量
	//var finalLong = volume;
	audiobox[0].volume = finalLong;

	// 改变数字
	//$('.vol b').html(parseInt(finalLong * 100) + '%')

	// 点击后音量调整键隐藏
	//$('.vol a').css('display','none')

});

//文章歌曲
function autoload_posts_music() {
	post_playlist.splice(0,post_playlist.length);
	var pid = $('.posts_mu_list').attr('pid');
	var api =  `${Theme.play.pix_mu_api || 'https://api.i-meto.com/meting/api'}?server=:server&type=:type&id=:id&r=:r`
	var meta = {
		server : $('.posts_mu_list').attr('mus_source'),
		type : $('.posts_mu_list').attr('mus_type'),
		id : $('.posts_mu_list').attr('plays_id'),
		mu_on: $('.posts_mu_list').attr('mu_on'),
		auth : ''
	}
	if(pid && meta.mu_on=='true'){
		let url = api.replace(":server", meta.server).replace(":type", meta.type).replace(":id", meta.id).replace(":auth", meta.auth).replace(":r", Math.random());
		$.ajax({
			type: "get",
			url:url,
			beforeSend: function () {
				$('.posts_mu_list').html('<div class="loading_box"><div uk-spinner></div></div>');
			},
			success: function (res) {

				if(res.length > 0){
					$('.posts_mu_list .loading_box').remove();

					var playnum = 1;

					if(!$('#pix_player').length > 0){
						$('.player_box').append(audiobox);
					}


					//存储一个播放列表
					post_playlist.push(res);

					//插入播放列表
					$.each(res, function(key, data) {
						$(".posts_mu_list").append('<li class="item" id='+ key +'><div class="mu_id">' + playnum++ + '</div><a class="s_play_btn"><i class="ri-play-circle-line"></i></a><div class="mus_info">'+ (data.title || data.name) +' <span>- ' + (data.author || data.artist) + '</span></div></li>');

					});

					//$(".musci_list_box li").removeClass('active').eq(0).addClass('active');
				}

			}
		});
	}

}

//文章歌曲播放
$(document).on('click','.s_play_btn',function(){
	mu_box_show();
	$('.posts_mu_list li').removeClass('active');
	audiobox[0].removeEventListener("play",audioplay);
	audiobox[0].removeEventListener("pause",audiopause);
	$(".m_play").html('<i class="ri-pause-circle-fill"></i>');
	$(this).parent().addClass('active');

	var id = $(this).parents('li').attr('id');
	var data = post_playlist[0][id];
	playLrc = data.lrc;
	//console.log(data);
	audiobox.attr('src',data.url);
	m_cover.attr('src',data.pic);
	m_title.text(data.title || data.name);
	m_artist.text(data.artist || data.artist);
	audiobox[0].play();

	Paused = false;
});

//播放器按钮
$(document).on('click','a.bg_music',function(){
	mu_box_show();
});



$(function () {
	autoload_music();
	autoload_posts_music();
});

//播放类型切换
$(document).on('click','.audio_c_btn',function(){
	var type = $(this).attr('au_type');
	var input = $('<input type="text" placeholder="歌曲ID" name="moment_audio_api" id="moment_audio_api" class="required" required="required">');
	$('.type_audio_text').empty();
	$('.'+type+'_audio.type_audio_text').append(input);
});


$('.bg_lrc').click(function () {
	if (lyricsContainer.css('display') === 'none') {
		lyricsContainer.css('display', 'block');
		$('a.bg_lrc i').css({
			"color": "",
		});
		$('a.bg_lrc').css({
			"background": "",
		});
	} else {
		lyricsContainer.css('display', 'none');
		$('a.bg_lrc i').css({
			"color": "#aeaeae",
		});
		$('a.bg_lrc').css({
			"background": "rgb(196 208 230 / 38%)",
		});
	}
});


//创建容器
if(Theme.play.lrc_open){
	var lyricsContainer = $('<div class="lyrics-container"></div>');
	$('.player_box').append(lyricsContainer);
	var css = $(window).width() > 767 ?
		{
			//桌面歌词css（按照下面格式自行修改）
			position: 'fixed',
			bottom: '10px',
			left: '2%',
			width: '350px',
			height: '100px',
			overflow: 'hidden',
			zIndex: '999',
			pointerEvents: 'none',
		} :
		{
			//移动端歌词css（按照下面格式自行修改）
			position: 'fixed',
			bottom: '88px',
			left: '0',
			width: '100%',
			height: '72px',
			textAlign: 'center',
			overflow: 'hidden',
			zIndex: '999',
			pointerEvents: 'none',
		};
	lyricsContainer.css(css);
}

var lyricsMap = {};

// 获取歌词
async function fetchLyrics(url) {
	if (!lyricsMap[url]) {
		var lrcOriginal = await $.get(url);
		lyricsMap[url] = parseLyrics(lrcOriginal);
	}
	return lyricsMap[url];
}

// 解析歌词
function parseLyrics(lrcOriginal) {
	var lyrics = [];
	var lines = lrcOriginal.split("\n");
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (!line.trim()) {
			continue;
		}
		var timeAndText = line.split("]");
		var time = timeAndText[0].substr(1);
		var text = timeAndText[1];
		// 增加代码：如果歌词为空，跳过此次循环
		if (!text.trim()) {
			continue;
		}
		// 增加代码：把时间转换成秒
		var timeInSeconds = 0;
		var timeParts = time.split(":");
		timeInSeconds += parseInt(timeParts[0], 10) * 60 - 0.5;
		timeInSeconds += parseFloat(timeParts[1]);
		lyrics.push({
			time: timeInSeconds,
			text: text
		});
	}
	return lyrics;
}

// 更新歌词
function updateLyrics(currentTime, lyrics) {
	for (var i = 0; i < lyrics.length; i++) {
		if (currentTime >= lyrics[i].time && (i === lyrics.length - 1 || currentTime < lyrics[i + 1].time)) {
			// 创建4行歌词
			// 防止数组i越界
			var currentLine3 = "";
			if (i - 1 >= 0 && typeof lyrics[i - 1].text === "string") {
				currentLine3 = lyrics[i - 1].text;
			}
			var currentLine = "";
			if (typeof lyrics[i].text === "string") {
				currentLine = lyrics[i].text;
			}
			var currentLine1 = "";
			if (i + 1 < lyrics.length && typeof lyrics[i + 1].text === "string") {
				currentLine1 = lyrics[i + 1].text;
			}
			var currentLine2 = "";
			if (i + 2 < lyrics.length && typeof lyrics[i + 2].text === "string") {
				currentLine2 = lyrics[i + 2].text;
			}
			//歌词文本css（修改style内的内容即可）
			lyricsContainer.html(`
<div class="current-line" style="font-size: 10px;opacity: .4;">${currentLine3}</div>
<div class="current-line active" style="font-size: 14px;">${currentLine}</div>
<div class="current-line" style="font-size: 12px;opacity: .4;">${currentLine1}</div>
<div class="current-line" style="font-size: 10px;opacity: .1;">${currentLine2}</div>
`);
			// 增加代码：添加从下往上线性滚动的动画
			$('.current-line').animate({
				top: '-=30px'
			}, 2000, function () {
				$(this).css({
					top: '30px'
				});
			});
		}
	}
}

// 监听音频播放进度更新事件，更新歌词
Theme.play.lrc_open && audiobox[0].addEventListener("timeupdate", async function () {
	var lyrics = await fetchLyrics(playLrc)
	updateLyrics(this.currentTime, lyrics);
});

// 根据选择的位置定位滚动条
function scrollToPosition(position) {
	let container = document.getElementById("musci_list");
	let items = container.getElementsByClassName("item");

	if (position >= 0 && position < items.length) {
		items[position].scrollIntoView();
	}
}

