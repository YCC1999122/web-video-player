/* ==========================================
   Web Video Player - main.js
   纯原生实现 · 无依赖
   ========================================== */

(function () {
  'use strict';

  // ===== 播放列表数据（公开测试视频源）=====
  // 这些是 Google 公开的 sample 视频，可自由访问。
  // 后续可替换为你自己的视频源。
  const PLAYLIST = [
    {
      title: 'Big Buck Bunny',
      author: 'Blender Foundation',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '9:56',
      views: '12.5K',
      likes: '1.2K',
      desc: '一只巨大的兔子在森林中遭遇三只小啮齿动物的恶作剧，最终以幽默的方式完成反击。Blender 基金会经典开源短片。',
      fmt: 'MP4 / 1080p'
    },
    {
      title: 'Elephants Dream',
      author: 'Blender Foundation',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: '10:53',
      views: '8.3K',
      likes: '0.9K',
      desc: '两个角色 Emo 和 Proog 进入一个离奇而超现实的机械装置世界，被称为"机器"。Blender 首部开源短片。',
      fmt: 'MP4 / 720p'
    },
    {
      title: 'For Bigger Blazes',
      author: 'Google',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '0:15',
      views: '5.6K',
      likes: '0.4K',
      desc: 'Chrome 测试用视频片段，展示更高清晰度的火焰画面。',
      fmt: 'MP4 / 1080p'
    },
    {
      title: 'For Bigger Escapes',
      author: 'Google',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      duration: '0:15',
      views: '4.1K',
      likes: '0.3K',
      desc: 'Chrome 测试用视频片段，展示汽车逃亡场景。',
      fmt: 'MP4 / 1080p'
    },
    {
      title: 'Sintel',
      author: 'Blender Foundation',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      duration: '14:18',
      views: '15.2K',
      likes: '2.1K',
      desc: '少女 Sintel 与一只小飞龙建立友谊，飞龙长大后却被成年巨龙抓走。Sintel 踏上寻龙之旅，第三部 Blender 开源短片。',
      fmt: 'MP4 / 1080p'
    },
    {
      title: 'Tears of Steel',
      author: 'Blender Institute',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      duration: '12:14',
      views: '9.7K',
      likes: '1.4K',
      desc: '一群战士和科学家在阿姆斯特丹应对机器人入侵。Mango 电影工作室制作的开源科幻短片，测试摄像机追踪与合成。',
      fmt: 'MP4 / 1080p'
    }
  ];

  // ===== DOM =====
  const $ = (id) => document.getElementById(id);
  const video = $('video');
  const playerWrap = $('playerWrap');
  const bigPlay = $('bigPlay');
  const playBtn = $('playBtn');
  const prevBtn = $('prevBtn');
  const nextBtn = $('nextBtn');
  const muteBtn = $('muteBtn');
  const volumeGroup = $('volumeGroup');
  const volumeFilled = $('volumeFilled');
  const volumeThumb = $('volumeThumb');
  const volumeSlider = $('volumeSlider');
  const speedBtn = $('speedBtn');
  const speedLabel = $('speedLabel');
  const speedMenu = $('speedMenu');
  const loopBtn = $('loopBtn');
  const fullscreenBtn = $('fullscreenBtn');
  const progressBar = $('progress');
  const progressFilled = $('progressFilled');
  const progressBuffered = $('progressBuffered');
  const progressThumb = $('progressThumb');
  const hoverTime = $('hoverTime');
  const currentTimeEl = $('currentTime');
  const durationEl = $('duration');
  const npTitle = $('npTitle');
  const badgeRes = $('badgeRes');
  const badgeFmt = $('badgeFmt');
  const playlistEl = $('playlist');
  const plCount = $('plCount');
  const infoThumb = $('infoThumb');
  const infoTitle = $('infoTitle');
  const infoAuthor = $('infoAuthor');
  const infoDesc = $('infoDesc');
  const statViews = $('statViews');
  const statLikes = $('statLikes');
  const statDur = $('statDur');
  const shuffleBtn = $('shuffleBtn');
  const repeatBtn = $('repeatBtn');
  const toast = $('toast');
  const buffering = $('buffering');

  // ===== 状态 =====
  let currentIndex = 0;
  let isLoop = false;
  let isShuffle = false;
  let isRepeatList = true;
  let hideControlsTimer = null;

  // ===== 工具函数 =====
  function formatTime(s) {
    if (!s || !isFinite(s)) return '0:00';
    s = Math.floor(s);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const mm = h > 0 ? String(m).padStart(2, '0') : m;
    const ss = String(sec).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  }

  function showToast(msg, dur = 1500) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), dur);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  // ===== 加载视频 =====
  function loadVideo(index, autoplay = false) {
    if (index < 0) index = PLAYLIST.length - 1;
    if (index >= PLAYLIST.length) index = 0;
    currentIndex = index;
    const item = PLAYLIST[index];

    video.src = item.src;
    video.load();
    npTitle.textContent = item.title;
    badgeFmt.textContent = item.fmt.split(' / ')[0];
    badgeRes.textContent = (item.fmt.split(' / ')[1]) || 'HD';
    infoTitle.textContent = item.title;
    infoAuthor.textContent = '作者: ' + item.author;
    infoDesc.textContent = item.desc;
    statViews.textContent = item.views;
    statLikes.textContent = item.likes;
    statDur.textContent = item.duration;

    // 高亮列表项
    [...playlistEl.children].forEach((el, i) => {
      el.classList.toggle('active', i === index);
    });

    if (autoplay) {
      video.play().catch(() => {});
    }
    renderBigPlay();
  }

  // ===== 播放/暂停 =====
  function togglePlay() {
    if (video.paused || video.ended) {
      video.play().catch(() => showToast('无法播放该视频'));
    } else {
      video.pause();
    }
  }

  function renderBigPlay() {
    if (video.paused) {
      bigPlay.classList.remove('hidden');
      playerWrap.classList.add('paused');
      playBtn.classList.remove('playing');
    } else {
      bigPlay.classList.add('hidden');
      playerWrap.classList.remove('paused');
      playBtn.classList.add('playing');
    }
  }

  // ===== 控制层自动隐藏 =====
  function showControlsTemp() {
    playerWrap.classList.add('show-controls');
    clearTimeout(hideControlsTimer);
    hideControlsTimer = setTimeout(() => {
      if (!video.paused) {
        playerWrap.classList.remove('show-controls');
      }
    }, 2600);
  }

  // ===== 进度条 =====
  function updateProgress() {
    const pct = (video.currentTime / video.duration) * 100 || 0;
    progressFilled.style.width = pct + '%';
    currentTimeEl.textContent = formatTime(video.currentTime);
  }

  function updateBuffered() {
    if (video.buffered.length && video.duration) {
      const end = video.buffered.end(video.buffered.length - 1);
      const pct = (end / video.duration) * 100;
      progressBuffered.style.width = pct + '%';
    }
  }

  function seekTo(e) {
    const rect = progressBar.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const pct = clamp(x / rect.width, 0, 1);
    if (video.duration) {
      video.currentTime = video.duration * pct;
      updateProgress();
    }
  }

  function onProgressHover(e) {
    if (!video.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = clamp(x / rect.width, 0, 1);
    hoverTime.textContent = formatTime(video.duration * pct);
    hoverTime.style.left = x + 'px';
  }

  // 拖拽
  let isDraggingProgress = false;
  progressBar.addEventListener('mousedown', (e) => {
    isDraggingProgress = true;
    seekTo(e);
  });
  document.addEventListener('mousemove', (e) => {
    if (isDraggingProgress) seekTo(e);
  });
  document.addEventListener('mouseup', () => { isDraggingProgress = false; });
  progressBar.addEventListener('touchstart', (e) => {
    isDraggingProgress = true;
    seekTo(e);
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (isDraggingProgress) seekTo(e);
  }, { passive: true });
  document.addEventListener('touchend', () => { isDraggingProgress = false; });
  progressBar.addEventListener('mousemove', onProgressHover);

  // ===== 音量 =====
  let lastVolume = 1;
  function setVolume(v) {
    v = clamp(v, 0, 1);
    video.volume = v;
    video.muted = v === 0;
    volumeFilled.style.width = (v * 100) + '%';
    volumeGroup.classList.toggle('muted', v === 0);
  }

  function onVolumeSlider(e) {
    const rect = volumeSlider.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    setVolume(x / rect.width);
  }

  let isDraggingVol = false;
  volumeSlider.addEventListener('mousedown', (e) => {
    isDraggingVol = true;
    onVolumeSlider(e);
  });
  document.addEventListener('mousemove', (e) => {
    if (isDraggingVol) onVolumeSlider(e);
  });
  document.addEventListener('mouseup', () => { isDraggingVol = false; });

  muteBtn.addEventListener('click', () => {
    if (video.muted || video.volume === 0) {
      setVolume(lastVolume || 1);
      showToast('取消静音');
    } else {
      lastVolume = video.volume;
      setVolume(0);
      showToast('已静音');
    }
  });

  // ===== 倍速 =====
  speedBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    speedMenu.classList.toggle('open');
  });
  speedMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const rate = parseFloat(e.target.dataset.rate);
      video.playbackRate = rate;
      speedLabel.textContent = rate + 'x';
      [...speedMenu.children].forEach(b => b.classList.toggle('active', b === e.target));
      speedMenu.classList.remove('open');
      showToast('倍速 ' + rate + 'x');
    }
  });
  document.addEventListener('click', (e) => {
    if (!speedMenu.contains(e.target) && e.target !== speedBtn) {
      speedMenu.classList.remove('open');
    }
  });

  // ===== 循环 =====
  loopBtn.addEventListener('click', () => {
    isLoop = !isLoop;
    video.loop = isLoop;
    loopBtn.classList.toggle('loop-active', isLoop);
    showToast(isLoop ? '单视频循环' : '取消循环');
  });

  // ===== 全屏 =====
  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const el = playerWrap;
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) req.call(el);
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) exit.call(document);
    }
  }
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    playerWrap.classList.toggle('fullscreen', !!(document.fullscreenElement || document.webkitFullscreenElement));
  });
  document.addEventListener('webkitfullscreenchange', () => {
    playerWrap.classList.toggle('fullscreen', !!(document.fullscreenElement || document.webkitFullscreenElement));
  });

  // ===== 上一首/下一首 =====
  function playNext() {
    if (isShuffle) {
      let r;
      do { r = Math.floor(Math.random() * PLAYLIST.length); } while (r === currentIndex && PLAYLIST.length > 1);
      loadVideo(r, true);
    } else {
      loadVideo(currentIndex + 1, true);
    }
  }
  function playPrev() {
    loadVideo(currentIndex - 1, true);
  }
  prevBtn.addEventListener('click', playPrev);
  nextBtn.addEventListener('click', playNext);

  shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
    showToast(isShuffle ? '随机播放' : '顺序播放');
  });
  repeatBtn.addEventListener('click', () => {
    isRepeatList = !isRepeatList;
    repeatBtn.classList.toggle('active', isRepeatList);
    showToast(isRepeatList ? '列表循环' : '播放一次');
  });

  // ===== 视频事件 =====
  video.addEventListener('play', renderBigPlay);
  video.addEventListener('pause', renderBigPlay);
  video.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(video.duration);
    updateProgress();
  });
  video.addEventListener('timeupdate', () => {
    updateProgress();
    updateBuffered();
  });
  video.addEventListener('progress', updateBuffered);
  video.addEventListener('waiting', () => buffering.hidden = false);
  video.addEventListener('playing', () => buffering.hidden = true);
  video.addEventListener('canplay', () => buffering.hidden = true);
  video.addEventListener('ended', () => {
    if (isLoop) return; // loop 由 video.loop 处理
    if (isRepeatList) {
      playNext();
    } else {
      renderBigPlay();
    }
  });
  video.addEventListener('error', () => {
    buffering.hidden = true;
    showToast('视频加载失败，请检查网络或视频源', 2500);
  });

  // 鼠标移动显示控制层
  playerWrap.addEventListener('mousemove', showControlsTemp);
  playerWrap.addEventListener('mouseleave', () => {
    if (!video.paused) playerWrap.classList.remove('show-controls');
  });
  playerWrap.addEventListener('touchstart', showControlsTemp, { passive: true });

  bigPlay.addEventListener('click', togglePlay);
  playBtn.addEventListener('click', togglePlay);

  // ===== 播放列表渲染 =====
  function renderPlaylist() {
    playlistEl.innerHTML = '';
    PLAYLIST.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'pl-item' + (i === currentIndex ? ' active' : '');
      el.innerHTML = `
        <div class="pl-thumb">
          <div class="pl-eq"><span></span><span></span><span></span></div>
        </div>
        <div class="pl-info">
          <div class="pl-title">${item.title}</div>
          <div class="pl-meta">
            <span class="pl-dur">${item.duration}</span>
            <span>${item.views} 观看</span>
          </div>
        </div>
        <div class="pl-num">${String(i + 1).padStart(2, '0')}</div>
      `;
      el.addEventListener('click', () => loadVideo(i, true));
      playlistEl.appendChild(el);
    });
    plCount.textContent = PLAYLIST.length;
  }

  // ===== 键盘快捷键 =====
  document.addEventListener('keydown', (e) => {
    // 输入框中不触发
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.target === speedMenu) return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        video.currentTime = clamp(video.currentTime - 5, 0, video.duration);
        showToast('后退 5 秒');
        break;
      case 'ArrowRight':
        e.preventDefault();
        video.currentTime = clamp(video.currentTime + 5, 0, video.duration);
        showToast('前进 5 秒');
        break;
      case 'ArrowUp':
        e.preventDefault();
        setVolume(video.volume + 0.1);
        showToast('音量 ' + Math.round(video.volume * 100) + '%');
        break;
      case 'ArrowDown':
        e.preventDefault();
        setVolume(video.volume - 0.1);
        showToast('音量 ' + Math.round(video.volume * 100) + '%');
        break;
      case 'KeyF':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'KeyM':
        e.preventDefault();
        muteBtn.click();
        break;
      case 'KeyN':
        e.preventDefault();
        playNext();
        break;
      case 'KeyP':
        e.preventDefault();
        playPrev();
        break;
      case 'Digit0': case 'Digit1': case 'Digit2':
      case 'Digit3': case 'Digit4': case 'Digit5':
      case 'Digit6': case 'Digit7': case 'Digit8':
      case 'Digit9':
        if (video.duration) {
          const n = parseInt(e.code.replace('Digit', ''));
          video.currentTime = video.duration * (n / 10);
          showToast('跳转到 ' + (n * 10) + '%');
        }
        break;
    }
  });

  // ===== 初始化 =====
  renderPlaylist();
  loadVideo(0, false);
  setVolume(1);

  // 首次显示控制层
  playerWrap.classList.add('paused');
})();
