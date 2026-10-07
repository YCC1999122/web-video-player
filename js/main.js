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
      title: '问候 · Hello',
      author: 'AR Generated Demo',
      src: '问候.mp4',
      duration: '0:08',
      views: '0.5K',
      likes: '0.1K',
      desc: 'AR 生成的问候演示视频，作为本页交互概念的演示素材。',
      fmt: 'MP4 / 720p',
      // 视频内容描述（AI 内容理解 Step 1）
      contentDesc: 'AR 虚拟形象站在纯色背景前挥手问候，动作自然流畅，视频时长约 8 秒，无对白。',
      // AI 提取的视频内容关键词（用于内容检索）
      aiTags: ['问候', '挥手', '人物', '动画', '演示', '科技感', '虚拟形象', '3D 渲染'],
      // 视频中可识别的物体（用于拖拽识别，按实物标注）
      objects: [
        { name: '人物', type: '人物' },
        { name: '手', type: '肢体' },
        { name: '上衣', type: '服装' }
      ],
      // 声纹波形数据（0-1 的相对音量，用于功能2：声纹预警）
      // 在第 4 秒和第 6 秒有突然的响声（红色预警点）
      waveform: [0.2, 0.25, 0.3, 0.4, 0.85, 0.95, 0.9, 0.5, 0.3, 0.25, 0.2, 0.18, 0.2, 0.22, 0.2, 0.18, 0.2, 0.25, 0.3, 0.35, 0.4, 0.3, 0.25, 0.2],
      // 声纹预警时间点（秒）
      audioWarnings: [3.8, 5.5]
    },
    {
      title: 'Big Buck Bunny',
      author: 'Blender Foundation',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '9:56',
      views: '12.5K',
      likes: '1.2K',
      desc: '一只巨大的兔子在森林中遭遇三只小啮齿动物的恶作剧，最终以幽默的方式完成反击。Blender 基金会经典开源短片。',
      fmt: 'MP4 / 1080p',
      contentDesc: '巨大的兔子在森林中享受午后，三只小啮齿动物（飞鼠）抢走它的果篮并掷出果实，兔子随后展开幽默反击。',
      aiTags: ['兔子', '森林', '恶作剧', '啮齿动物', '反击', '幽默', '自然', '飞行', '蝴蝶', '果篮'],
      objects: [
        { name: '兔子', type: '动物' },
        { name: '果篮', type: '容器' },
        { name: '蝴蝶', type: '动物' }
      ],
      waveform: [0.15, 0.2, 0.3, 0.4, 0.5, 0.4, 0.3, 0.2, 0.6, 0.7, 0.8, 0.9, 0.7, 0.5, 0.4, 0.3, 0.2, 0.15, 0.3, 0.5, 0.7, 0.6, 0.4, 0.3],
      audioWarnings: [8.5]
    },
    {
      title: 'Elephants Dream',
      author: 'Blender Foundation',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: '10:53',
      views: '8.3K',
      likes: '0.9K',
      desc: '两个角色 Emo 和 Proog 进入一个离奇而超现实的机械装置世界，被称为"机器"。Blender 首部开源短片。',
      fmt: 'MP4 / 720p',
      contentDesc: 'Emo 与 Proog 在一个由机械装置构成的超现实世界中穿行，探讨成熟与幼稚、秩序与混乱之间的张力。'
    },
    {
      title: 'For Bigger Blazes',
      author: 'Google',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '0:15',
      views: '5.6K',
      likes: '0.4K',
      desc: 'Chrome 测试用视频片段，展示更高清晰度的火焰画面。',
      fmt: 'MP4 / 1080p',
      contentDesc: '画面聚焦于燃烧的火焰，色彩浓烈，用于测试浏览器的视频解码能力。'
    },
    {
      title: 'For Bigger Escapes',
      author: 'Google',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      duration: '0:15',
      views: '4.1K',
      likes: '0.3K',
      desc: 'Chrome 测试用视频片段，展示汽车逃亡场景。',
      fmt: 'MP4 / 1080p',
      contentDesc: '汽车在道路上疾驰的短片段，画面切换迅速，用于测试清晰度播放。'
    },
    {
      title: 'Sintel',
      author: 'Blender Foundation',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      duration: '14:18',
      views: '15.2K',
      likes: '2.1K',
      desc: '少女 Sintel 与一只小飞龙建立友谊，飞龙长大后却被成年巨龙抓走。Sintel 踏上寻龙之旅，第三部 Blender 开源短片。',
      fmt: 'MP4 / 1080p',
      contentDesc: '少女 Sintel 救下并养大小飞龙，飞龙被成年巨龙掳走后，她踏上漫漫寻龙路，最终在冰雪洞穴中迎来命运的相遇。'
    },
    {
      title: 'Tears of Steel',
      author: 'Blender Institute',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      duration: '12:14',
      views: '9.7K',
      likes: '1.4K',
      desc: '一群战士和科学家在阿姆斯特丹应对机器人入侵。Mango 电影工作室制作的开源科幻短片，测试摄像机追踪与合成。',
      fmt: 'MP4 / 1080p',
      contentDesc: '未来阿姆斯特丹遭遇机器人入侵，战士与科学家试图用一段被遗忘的记忆挽回局面，融合实拍与 CG 合成。'
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
  // 字幕/弹幕
  const ccBtn = $('ccBtn');
  const danmakuBtn = $('danmakuBtn');
  const subtitle = $('subtitle');
  const danmakuLayer = $('danmakuLayer');
  const danmakuInputBar = $('danmakuInputBar');
  const danmakuInput = $('danmakuInput');
  const danmakuColor = $('danmakuColor');
  const danmakuSend = $('danmakuSend');
  // 三大概念功能
  const shopCursor = $('shopCursor');
  const detectBox = $('detectBox');
  const detectBoxLabel = $('detectBoxLabel');
  const detectBoxConf = $('detectBoxConf');
  const waveformCanvas = $('waveformCanvas');
  const playerWaveform = $('playerWaveform');
  const aiSearchInput = $('aiSearchInput');
  const aiSearchBtn = $('aiSearchBtn');
  const aiSearchTags = $('aiSearchTags');
  const aiSearchResult = $('aiSearchResult');
  const aiSearchHit = $('aiSearchHit');
  // 视频内容描述区
  const contentDescVideo = $('contentDescVideo');
  const descStep1 = $('descStep1');
  const descStep2 = $('descStep2');
  const descStep3 = $('descStep3');
  const aiSearchTime = $('aiSearchTime');

  // ===== 状态 =====
  let currentIndex = 0;
  let isLoop = false;
  let isShuffle = false;
  let isRepeatList = true;
  let hideControlsTimer = null;
  // 字幕/弹幕
  let subtitleEnabled = false;
  let danmakuEnabled = false;
  let userDanmakuQueue = []; // {time, text, color} 待发送的弹幕(基于时间触发)
  let danmakuLoopTimer = null;
  let lastSubtitleIdx = -1;

  // ===== 字幕数据（示例占位，按视频索引）=====
  // 用户说"即便没有效果"也要先加上，这里用示例字幕做演示。
  // 每条字幕 {time: 起始秒, text: 文本}，按 time 升序。
  const SUBTITLES = {
    0: [
      { time: 0, text: '♪ Big Buck Bunny · Blender Foundation ♪' },
      { time: 8, text: '森林深处，住着一只巨大的兔子' },
      { time: 22, text: '它享受着平静的午后时光' },
      { time: 40, text: '三只小啮齿动物正在策划恶作剧…' },
      { time: 70, text: '巨大的兔子不会任人捉弄' },
      { time: 95, text: '一场幽默而温柔的反击开始了' },
      { time: 130, text: '最终，森林恢复了宁静' },
      { time: 160, text: '— 短片结束 —' }
    ],
    1: [
      { time: 0, text: '♪ Elephants Dream · Blender Foundation ♪' },
      { time: 10, text: '两个角色走入一个奇异的机械世界' },
      { time: 35, text: 'Emo 与 Proog 在「机器」中前行' },
      { time: 80, text: '一切看似随机，却暗藏秩序' },
      { time: 140, text: '当机械开始回应，故事走向终章' },
      { time: 200, text: '— 短片结束 —' }
    ],
    2: [
      { time: 0, text: '♪ For Bigger Blazes · Google ♪' },
      { time: 3, text: '火焰的画面测试片段' },
      { time: 8, text: '— 短片结束 —' }
    ],
    3: [
      { time: 0, text: '♪ For Bigger Escapes · Google ♪' },
      { time: 3, text: '汽车逃亡场景测试片段' },
      { time: 8, text: '— 短片结束 —' }
    ],
    4: [
      { time: 0, text: '♪ Sintel · Blender Foundation ♪' },
      { time: 12, text: '少女 Sintel 与小飞龙建立友谊' },
      { time: 50, text: '飞龙长大后，被成年巨龙掠走' },
      { time: 120, text: 'Sintel 踏上漫长的寻龙之旅' },
      { time: 240, text: '终点是冰雪与命运的对峙' },
      { time: 320, text: '— 短片结束 —' }
    ],
    5: [
      { time: 0, text: '♪ Tears of Steel · Blender Institute ♪' },
      { time: 12, text: '阿姆斯特丹，机器人入侵' },
      { time: 50, text: '一群战士与科学家挺身而出' },
      { time: 120, text: '关键在于一段被遗忘的记忆' },
      { time: 240, text: '科学与勇气最终改变结局' },
      { time: 350, text: '— 短片结束 —' }
    ]
  };

  // ===== 弹幕示例数据（基于视频时间触发）=====
  const SAMPLE_DANMAKU = [
    { offset: 1, text: '前排支持！', color: 'yellow' },
    { offset: 4, text: '画质真不错', color: 'blue' },
    { offset: 8, text: '哈哈这个开头', color: 'pink' },
    { offset: 14, text: '经典之作必看', color: 'white' },
    { offset: 20, text: 'BGM 好听', color: 'purple' },
    { offset: 28, text: '这颜色绝了', color: 'green' },
    { offset: 36, text: '看了一遍又一遍', color: 'yellow' },
    { offset: 45, text: '666', color: 'blue' },
    { offset: 55, text: '细节满满', color: 'pink' },
    { offset: 65, text: '这转折可以', color: 'white' },
    { offset: 75, text: '泪目了', color: 'purple' },
    { offset: 85, text: '收藏了', color: 'green' }
  ];
  let firedSampleSet = new Set(); // 已触发的示例弹幕 key，避免重复

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

  // ===== 字幕：开关 / 同步 =====
  function toggleSubtitle() {
    subtitleEnabled = !subtitleEnabled;
    ccBtn.classList.toggle('cc-active', subtitleEnabled);
    showToast(subtitleEnabled ? '字幕开' : '字幕关');
    if (!subtitleEnabled) {
      subtitle.classList.remove('show');
      lastSubtitleIdx = -1;
    }
  }

  function updateSubtitle() {
    if (!subtitleEnabled) return;
    const subs = SUBTITLES[currentIndex] || [];
    if (!subs.length) {
      subtitle.classList.remove('show');
      return;
    }
    const t = video.currentTime;
    // 找到当前时间对应的字幕（最后一条 time <= t）
    let idx = -1;
    for (let i = subs.length - 1; i >= 0; i--) {
      if (subs[i].time <= t) { idx = i; break; }
    }
    if (idx !== lastSubtitleIdx) {
      lastSubtitleIdx = idx;
      if (idx >= 0) {
        subtitle.textContent = subs[idx].text;
        subtitle.classList.add('show');
      } else {
        subtitle.classList.remove('show');
      }
    }
  }

  // ===== 弹幕：开关 / 渲染 / 发送 =====
  function toggleDanmaku() {
    danmakuEnabled = !danmakuEnabled;
    danmakuBtn.classList.toggle('danmaku-active', danmakuEnabled);
    danmakuLayer.classList.toggle('hidden', !danmakuEnabled);
    danmakuInputBar.classList.toggle('show', danmakuEnabled);
    showToast(danmakuEnabled ? '弹幕开' : '弹幕关');
    if (danmakuEnabled) {
      startDanmakuLoop();
    } else {
      stopDanmakuLoop();
      // 清空当前弹幕
      danmakuLayer.innerHTML = '';
    }
  }

  function spawnDanmaku(text, color = 'white') {
    if (!danmakuEnabled || !text) return;
    const item = document.createElement('div');
    item.className = 'danmaku-item color-' + color;
    item.textContent = text;
    // 随机轨道（5 条），避免完全重叠
    const track = Math.floor(Math.random() * 5);
    item.style.top = (12 + track * 38) + 'px';
    item.style.right = '0';
    item.style.transform = 'translateX(100%)';
    danmakuLayer.appendChild(item);

    // 测量宽度后启动滚动
    const w = item.offsetWidth;
    const layerW = danmakuLayer.offsetWidth || playerWrap.offsetWidth;
    const distance = layerW + w + 20;
    // 速度：6~9 秒走完，文字越长稍微慢一点
    const duration = 6000 + Math.random() * 3000 + Math.min(w * 8, 2500);

    requestAnimationFrame(() => {
      item.style.transition = `transform ${duration}ms linear`;
      item.style.transform = `translateX(-${distance}px)`;
    });
    setTimeout(() => { if (item.parentNode) item.remove(); }, duration + 200);
  }

  function sendDanmaku() {
    const text = danmakuInput.value.trim();
    if (!text) return;
    const color = danmakuColor.value || 'white';
    spawnDanmaku(text, color);
    danmakuInput.value = '';
    danmakuInput.focus();
    showToast('弹幕已发送');
  }

  function startDanmakuLoop() {
    stopDanmakuLoop();
    danmakuLoopTimer = setInterval(() => {
      if (!danmakuEnabled || video.paused || video.ended) return;
      const t = video.currentTime;
      // 触发示例弹幕（按 offset 触发）
      SAMPLE_DANMAKU.forEach((d, i) => {
        const key = currentIndex + '-' + i;
        if (!firedSampleSet.has(key) && t >= d.offset && t < d.offset + 0.6) {
          firedSampleSet.add(key);
          spawnDanmaku(d.text, d.color);
        }
      });
      // 触发用户排队弹幕
      userDanmakuQueue = userDanmakuQueue.filter(d => {
        if (d.time <= t) {
          spawnDanmaku(d.text, d.color);
          return false;
        }
        return true;
      });
    }, 400);
  }

  function stopDanmakuLoop() {
    if (danmakuLoopTimer) {
      clearInterval(danmakuLoopTimer);
      danmakuLoopTimer = null;
    }
  }

  function resetDanmakuForNewVideo() {
    firedSampleSet.clear();
    userDanmakuQueue = [];
    danmakuLayer.innerHTML = '';
    lastSubtitleIdx = -1;
    if (subtitleEnabled) subtitle.classList.remove('show');
  }

  // ===== 功能1: 视频购物车（暂停时显示购物车图标，拖拽松开后在落点显示矩形识别框）=====
  function showShopCursor() {
    if (!video.paused) return;
    shopCursor.classList.add('show');
  }
  function hideShopCursor() {
    shopCursor.classList.remove('show', 'dragging');
  }
  // 在画面指定位置显示矩形识别框
  function showDetectBox(x, y) {
    const item = PLAYLIST[currentIndex];
    const objs = item.objects || [];
    if (!objs.length) {
      showToast('当前视频无测试数据');
      return;
    }
    // 模拟识别：根据落点位置选最接近的物体（真实场景需 AI 视觉识别）
    const hitIndex = Math.floor(Math.random() * objs.length);
    const obj = objs[hitIndex];
    // 矩形框尺寸（模拟检测框）
    const boxW = 100;
    const boxH = 120;
    // 限制在画面范围内
    const wrapRect = playerWrap.getBoundingClientRect();
    const maxX = wrapRect.width - boxW;
    const maxY = wrapRect.height - boxH;
    const left = Math.max(0, Math.min(x - boxW / 2, maxX));
    const top = Math.max(0, Math.min(y - boxH / 2, maxY));
    detectBox.style.left = left + 'px';
    detectBox.style.top = top + 'px';
    detectBox.style.width = boxW + 'px';
    detectBox.style.height = boxH + 'px';
    detectBoxLabel.textContent = obj.name;
    detectBoxConf.textContent = '置信度 ' + (85 + Math.floor(Math.random() * 14)) + '%';
    detectBox.hidden = false;
    showToast('识别到：' + obj.name);
  }
  function hideDetectBox() {
    detectBox.hidden = true;
  }
  // 购物车拖拽
  let shopDragState = { active: false, offsetX: 0, offsetY: 0 };
  shopCursor.addEventListener('mousedown', (e) => {
    shopDragState.active = true;
    const rect = shopCursor.getBoundingClientRect();
    shopDragState.offsetX = e.clientX - rect.left - rect.width / 2;
    shopDragState.offsetY = e.clientY - rect.top - rect.height / 2;
    shopCursor.classList.add('dragging');
    hideDetectBox();
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!shopDragState.active) return;
    const wrapRect = playerWrap.getBoundingClientRect();
    const x = e.clientX - wrapRect.left - shopDragState.offsetX;
    const y = e.clientY - wrapRect.top - shopDragState.offsetY;
    shopCursor.style.left = x + 'px';
    shopCursor.style.top = y + 'px';
    shopCursor.style.right = 'auto';
    shopCursor.style.transform = 'translate(0, 0)';
  });
  document.addEventListener('mouseup', (e) => {
    if (!shopDragState.active) return;
    shopDragState.active = false;
    shopCursor.classList.remove('dragging');
    // 计算松开位置相对于播放器的坐标
    const wrapRect = playerWrap.getBoundingClientRect();
    const dropX = e.clientX - wrapRect.left;
    const dropY = e.clientY - wrapRect.top;
    // 只在画面区域内才显示识别框
    if (dropX >= 0 && dropX <= wrapRect.width && dropY >= 0 && dropY <= wrapRect.height) {
      showDetectBox(dropX, dropY);
    }
  });
  // 点击画面其他位置时隐藏识别框
  playerWrap.addEventListener('click', (e) => {
    if (e.target === shopCursor || shopCursor.contains(e.target)) return;
    if (!shopDragState.active) hideDetectBox();
  });

  // ===== 功能2: 声纹波形绘制（高音量=红、中音量=蓝、低音量=绿）=====
  // 根据音量值返回对应颜色
  function getWaveColor(v) {
    if (v >= 0.7) return '#ef4444'; // 高音量：红色
    if (v >= 0.4) return '#3b82f6'; // 中音量：蓝色
    return '#22c55e'; // 低音量：绿色
  }
  function getWaveColorAlpha(v, played) {
    const c = getWaveColor(v);
    if (played) return c;
    // 未播放部分降低透明度
    return c.replace('rgb', 'rgba').replace(')', ',0.25)');
  }
  // 在指定 canvas 上绘制波形
  function drawWaveformOn(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;
    const item = PLAYLIST[currentIndex];
    const data = item.waveform || [];
    const warnings = item.audioWarnings || [];
    ctx.clearRect(0, 0, w, h);

    if (!data.length) {
      ctx.fillStyle = 'rgba(148,163,184,0.4)';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('该视频无声纹数据', w / 2, h / 2);
      return;
    }

    // 背景网格
    ctx.strokeStyle = 'rgba(148,163,184,0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (h / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 波形柱状图（按音量分级配色）
    const barW = w / data.length;
    const playProgress = video.duration ? (video.currentTime / video.duration) : 0;
    data.forEach((v, i) => {
      const barH = v * h * 0.85;
      const x = i * barW;
      const y = (h - barH) / 2;
      const played = (i / data.length) < playProgress;
      ctx.fillStyle = played ? getWaveColor(v) : getWaveColor(v) + '40';
      ctx.fillRect(x, y, Math.max(barW - 1, 1), barH);
    });

    // 预警点（红色竖线 + 顶部三角）
    if (video.duration) {
      warnings.forEach(t => {
        const x = (t / video.duration) * w;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(x - 5, 0);
        ctx.lineTo(x + 5, 0);
        ctx.lineTo(x, 6);
        ctx.closePath();
        ctx.fill();
      });
    }

    // 当前播放位置（白色竖线）
    if (video.duration) {
      const x = playProgress * w;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
  }
  // 同步绘制概念区和播放器内的声纹
  function drawWaveform() {
    drawWaveformOn(waveformCanvas);
    if (playerWaveform) drawWaveformOn(playerWaveform);
  }

  // ===== 功能3: AI 内容搜索 =====
  function renderAiTags() {
    const item = PLAYLIST[currentIndex];
    const tags = item.aiTags || [];
    aiSearchTags.innerHTML = '';
    tags.forEach((tag, i) => {
      const el = document.createElement('span');
      el.className = 'search-tag';
      el.textContent = tag;
      el.dataset.tag = tag;
      // 每个关键词映射一个模拟时间点（均匀分布）
      el.dataset.time = (i * (video.duration || 8) / tags.length).toFixed(1);
      el.addEventListener('click', () => {
        // 清除其他 matched
        document.querySelectorAll('.search-tag').forEach(t => t.classList.remove('matched'));
        el.classList.add('matched');
        const t = parseFloat(el.dataset.time);
        if (video.duration && t < video.duration) {
          video.currentTime = t;
        }
        aiSearchResult.hidden = false;
        aiSearchHit.textContent = tag;
        aiSearchTime.textContent = '⏱ ' + formatTime(t) + ' （点击跳转）';
        showToast('跳转到「' + tag + '」出现位置');
      });
      aiSearchTags.appendChild(el);
    });
    aiSearchResult.hidden = true;
  }

  // ===== 视频内容描述区（AI 提炼过程展示）=====
  // 每个视频的"内容描述 → 关键词 → 检索内容"三步数据
  function renderContentDesc() {
    const item = PLAYLIST[currentIndex];
    contentDescVideo.textContent = '当前视频：' + item.title;
    // Step 1: 视频内容描述
    descStep1.textContent = item.contentDesc || '（暂无内容描述）';
    // Step 2: 提炼关键词
    const keywords = item.aiTags || [];
    descStep2.innerHTML = '';
    keywords.slice(0, 8).forEach(k => {
      const el = document.createElement('span');
      el.className = 'mini-tag';
      el.textContent = k;
      descStep2.appendChild(el);
    });
    if (!keywords.length) descStep2.textContent = '（暂无关键词）';
    // Step 3: 可检索内容（前 5 个）
    descStep3.innerHTML = '';
    keywords.slice(0, 5).forEach(k => {
      const el = document.createElement('span');
      el.className = 'mini-tag';
      el.textContent = k;
      descStep3.appendChild(el);
    });
    if (!keywords.length) descStep3.textContent = '（暂无可检索内容）';
  }

  function aiSearch() {
    const q = aiSearchInput.value.trim();
    if (!q) return;
    const tags = document.querySelectorAll('.search-tag');
    let found = null;
    tags.forEach(t => {
      t.classList.remove('matched');
      if (t.dataset.tag.includes(q) || q.includes(t.dataset.tag)) {
        found = t;
      }
    });
    if (found) {
      found.classList.add('matched');
      const t = parseFloat(found.dataset.time);
      if (video.duration && t < video.duration) {
        video.currentTime = t;
      }
      aiSearchResult.hidden = false;
      aiSearchHit.textContent = found.dataset.tag;
      aiSearchTime.textContent = '⏱ ' + formatTime(t) + ' （点击跳转）';
      showToast('命中：' + found.dataset.tag);
    } else {
      aiSearchResult.hidden = false;
      aiSearchHit.textContent = '（无匹配）';
      aiSearchTime.textContent = '该视频未出现「' + q + '」相关内容';
      showToast('该视频未出现「' + q + '」');
    }
  }
  aiSearchBtn.addEventListener('click', aiSearch);
  aiSearchInput.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') aiSearch();
  });
  aiSearchTime.addEventListener('click', () => {
    const t = parseFloat(aiSearchTime.textContent.match(/[\d:]+/)?.[0]?.replace(/\./, ':') || 0);
    // 简单解析：从 dataset 里重新取
    const matched = document.querySelector('.search-tag.matched');
    if (matched && video.duration) {
      video.currentTime = parseFloat(matched.dataset.time);
      video.play().catch(() => {});
    }
  });

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

    // 重置字幕/弹幕状态（新视频切换时）
    resetDanmakuForNewVideo();
    // 重置购物车 + 商品卡片 + AI 搜索（新视频切换时）
    hideShopCursor();
    hideDetectBox();
    renderAiTags();
    drawWaveform();
    renderContentDesc();

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
  video.addEventListener('play', () => {
    renderBigPlay();
    hideShopCursor();
    hideDetectBox();
  });
  video.addEventListener('pause', () => {
    renderBigPlay();
    showShopCursor();
  });
  video.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(video.duration);
    updateProgress();
    renderAiTags();
    drawWaveform();
  });
  video.addEventListener('timeupdate', () => {
    updateProgress();
    updateBuffered();
    updateSubtitle();
    drawWaveform();
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
    // 输入框/选择框中不触发
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
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
      case 'KeyC':
        e.preventDefault();
        toggleSubtitle();
        break;
      case 'KeyD':
        e.preventDefault();
        toggleDanmaku();
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

  // ===== 字幕/弹幕按钮事件 =====
  ccBtn.addEventListener('click', toggleSubtitle);
  danmakuBtn.addEventListener('click', toggleDanmaku);
  danmakuSend.addEventListener('click', sendDanmaku);
  danmakuInput.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      sendDanmaku();
    }
  });

  // ===== 初始化 =====
  renderPlaylist();
  loadVideo(0, false);
  setVolume(1);

  // 窗口尺寸变化时重绘声纹波形
  window.addEventListener('resize', drawWaveform);

  // 首次显示控制层 + 首次绘制波形
  playerWrap.classList.add('paused');
  setTimeout(drawWaveform, 100);
})();
