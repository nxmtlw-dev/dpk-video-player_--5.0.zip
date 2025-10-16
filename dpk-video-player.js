// DPK Video Player - 支持自动连续播放版本
function initMineStylePlayer(containerSelector, playerData) {
    'use strict';
    
    const $container = jQuery(containerSelector);
    const $mainVideo = $container.find('#dpk-main-video');
    const $tabs = $container.find('.dpk-tab');
    const $videoItems = $container.find('.dpk-video-item');
    const $videosList = $container.find('.dpk-videos-list');
    
    let currentTabIndex = 0;
    let currentVideoIndex = 0;
    let isAutoPlayEnabled = true; // 自动播放开关
    
    // 初始化播放器
    function initPlayer() {
        console.log('初始化Mine风格播放器', playerData);
        
        if (!playerData.videos || !playerData.videos[0] || playerData.videos[0].length === 0) {
            console.error('没有找到视频数据');
            return;
        }
        
        // 绑定事件
        bindEvents();
        
        // 播放第一个视频
        playVideo(0, 0);
        
        console.log('DPK Mine风格播放器初始化完成');
    }
    
    // 绑定所有事件
    function bindEvents() {
        // 选项卡点击事件
        $tabs.on('click', function() {
            const $tab = jQuery(this);
            const tabIndex = $tab.data('tab');
            
            if (tabIndex === currentTabIndex) return;
            
            // 切换选项卡
            switchTab(tabIndex);
        });
        
        // 视频项点击事件
        $videoItems.on('click', function() {
            const $item = jQuery(this);
            const tabIndex = $item.data('tab-index');
            const videoIndex = $item.data('video-index');
            
            // 如果点击的是不同选项卡的视频，先切换选项卡
            if (tabIndex !== currentTabIndex) {
                switchTab(tabIndex);
            }
            
            // 播放视频
            playVideo(tabIndex, videoIndex);
        });
        
        // 视频结束事件 - 自动播放下一个视频
        $mainVideo.on('ended', function() {
            console.log('视频播放结束，准备播放下一个');
            playNextVideo();
        });
        
        // 视频错误处理
        $mainVideo.on('error', function(e) {
            console.error('视频加载错误:', e);
            // 如果当前视频加载失败，尝试播放下一个
            setTimeout(function() {
                playNextVideo();
            }, 2000);
        });
        
        // 视频可以播放
        $mainVideo.on('canplay', function() {
            console.log('视频可以播放');
        });
        
        // 视频开始播放
        $mainVideo.on('play', function() {
            console.log('视频开始播放');
        });
    }
    
    // 切换选项卡
    function switchTab(tabIndex) {
        console.log('切换选项卡:', tabIndex);
        
        if (!playerData.videos[tabIndex] || playerData.videos[tabIndex].length === 0) {
            console.error('该选项卡没有视频:', tabIndex);
            return;
        }
        
        // 更新选项卡状态
        $tabs.removeClass('active');
        $tabs.filter('[data-tab="' + tabIndex + '"]').addClass('active');
        
        // 更新当前选项卡索引
        currentTabIndex = tabIndex;
        
        // 重新渲染视频列表
        renderVideoList(tabIndex);
        
        // 播放新选项卡的第一个视频
        playVideo(tabIndex, 0);
    }
    
    // 渲染视频列表
    function renderVideoList(tabIndex) {
        console.log('渲染视频列表，选项卡:', tabIndex);
        
        const videos = playerData.videos[tabIndex];
        if (!videos) return;
        
        $videosList.empty();
        
        videos.forEach((video, index) => {
            const isActive = (tabIndex === currentTabIndex && index === currentVideoIndex);
            
            const $item = jQuery(`
                <div class="dpk-video-item ${isActive ? 'active' : ''}" 
                     data-video-url="${video.url}"
                     data-video-title="${video.title}"
                     data-tab-index="${tabIndex}"
                     data-video-index="${index}">
                    <div class="dpk-item-cover">
                        <img src="${video.cover}" alt="${video.title}" loading="lazy">
                        <div class="dpk-play-icon">▶</div>
                    </div>
                    <div class="dpk-item-info">
                        <div class="dpk-item-title">${video.title}</div>
                    </div>
                </div>
            `);
            
            $videosList.append($item);
        });
        
        // 重新绑定事件
        $videosList.find('.dpk-video-item').off('click').on('click', function() {
            const $item = jQuery(this);
            const tabIndex = $item.data('tab-index');
            const videoIndex = $item.data('video-index');
            
            playVideo(tabIndex, videoIndex);
        });
    }
    
    // 播放视频
    function playVideo(tabIndex, videoIndex) {
        console.log('播放视频:', tabIndex, videoIndex);
        
        const videos = playerData.videos[tabIndex];
        if (!videos || !videos[videoIndex]) {
            console.error('视频不存在:', tabIndex, videoIndex);
            return;
        }
        
        const video = videos[videoIndex];
        
        // 更新当前索引
        currentTabIndex = tabIndex;
        currentVideoIndex = videoIndex;
        
        // 更新视频源
        $mainVideo.attr('src', video.url);
        
        // 更新视频列表项状态
        $videosList.find('.dpk-video-item').removeClass('active');
        $videosList.find(`[data-tab-index="${tabIndex}"][data-video-index="${videoIndex}"]`).addClass('active');
        
        // 尝试播放
        const playPromise = $mainVideo[0].play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('自动播放被阻止:', error);
                // 显示播放按钮让用户手动点击
            });
        }
    }
    
    // 自动播放下一个视频
    function playNextVideo() {
        console.log('尝试播放下一个视频');
        
        const currentVideos = playerData.videos[currentTabIndex];
        if (!currentVideos) return;
        
        // 检查是否还有下一个视频
        if (currentVideoIndex < currentVideos.length - 1) {
            // 播放下一个视频
            console.log('播放下一个视频:', currentVideoIndex + 1);
            playVideo(currentTabIndex, currentVideoIndex + 1);
        } else {
            // 如果是最后一个视频，可以选择循环播放第一个视频
            console.log('已经是最后一个视频');
            // 可选：循环播放第一个视频
            // playVideo(currentTabIndex, 0);
        }
    }
    
    // 初始化播放器
    initPlayer();
}

// 全局错误处理
jQuery(document).ready(function($) {
    // 可以在这里添加全局的播放器初始化逻辑
});