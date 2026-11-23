// ============================================
// نادي شعب حضرموت - App Core JavaScript (SPA + Pro Features)
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // Show the logo-only opening screen on every app launch, then enter automatically.
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen) {
        document.body.classList.add('welcome-open');
        window.setTimeout(() => {
            welcomeScreen.classList.add('welcome-screen-leaving');
            document.body.classList.remove('welcome-open');
            window.setTimeout(() => { welcomeScreen.hidden = true; }, 380);
        }, 5000);
    }

    // Remove hard-coded preview content; official CMS data or its saved snapshot is shown instead.
    document.querySelector('.news-cards-container')?.replaceChildren();
    document.getElementById('storiesScrollContainer')?.replaceChildren();
    document.getElementById('sliderWrapper')?.replaceChildren();
    document.getElementById('notifList')?.replaceChildren();

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }

    // Keep the latest real club content available when the device is offline.
    const CLUB_CACHE_PREFIX = 'shaab_club_content_v2:';
    function readClubSnapshot(key) {
        try { const raw=localStorage.getItem(CLUB_CACHE_PREFIX+key); return raw ? JSON.parse(raw) : null; }
        catch(error) { return null; }
    }
    function saveClubSnapshot(key, data) {
        try { localStorage.setItem(CLUB_CACHE_PREFIX+key, JSON.stringify(data)); }
        catch(error) { console.warn('Unable to save offline club data:', key, error); }
    }

    // Warm images from every already-rendered app section during the logo intro.
    // Limit concurrency and total count to avoid overwhelming mobile connections.
    async function preloadAppImages() {
        const urls = Array.from(document.querySelectorAll('.app-page img[src], #storiesScrollContainer img[src], #sliderWrapper img[src]'))
            .map(img => {
                img.loading = 'eager';
                img.decoding = 'async';
                return img.currentSrc || img.src;
            })
            .filter((url, index, all) => url && !/^(data:|blob:)/i.test(url) && all.indexOf(url) === index)
            .slice(0, 80);
        let next = 0;
        const workers = Array.from({ length: 4 }, async () => {
            while (next < urls.length) {
                const url = urls[next++];
                await new Promise(resolve => {
                    const image = new Image();
                    image.onload = image.onerror = () => resolve();
                    image.src = url;
                    if (image.complete) resolve();
                });
            }
        });
        await Promise.allSettled(workers);
    }

    // ============================================
    // 1. DATA STORE (Live Club Content Only)
    // ============================================

    let PLAYERS_DATA = [];

    let STAFF_DATA = [];

    let MATCHES_UPCOMING = [];

    let MATCHES_RESULTS = [];

    let STANDINGS_DATA = [];

    let TRANSFERS_DATA = {in:[],out:[],renew:[]};

    let MEDIA_DATA = {photos:[],videos:[]};

    let ANTHEMS_DATA = [];

    let NEWS_ALL = [];

    let STORIES_DATA = [];

    // ============================================
    // 2. WEB AUDIO API SYNTHESIZER (Real Sound Effects!)
    // ============================================

    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtx;
    }

    function playTone(freq, type = 'sine', duration = 0.15) {
        try {
            const ctx = getAudioContext();
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {}
    }

    // Sound: Stadium Horn & Fan Anthem Rhythm
    function playFanCheerSound() {
        playTone(523.25, 'triangle', 0.2); // C5
        setTimeout(() => playTone(659.25, 'triangle', 0.25), 180); // E5
        setTimeout(() => playTone(783.99, 'triangle', 0.4), 380); // G5
    }

    function playAnthemTune() {
        const notes = [440, 554, 659, 880, 659, 880];
        notes.forEach((n, i) => {
            setTimeout(() => playTone(n, 'sine', 0.3), i * 220);
        });
    }

    // ============================================
    // 3. CONFETTI CELEBRATION ENGINE
    // ============================================

    const canvas = document.getElementById('confettiCanvas');
    let confettiParticles = [];
    let confettiAnimationId = null;

    function fireConfetti() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#DB1E24', '#FFD700', '#FFFFFF', '#B5121B', '#FF3038'];
        confettiParticles = [];

        for (let i = 0; i < 90; i++) {
            confettiParticles.push({
                x: canvas.width / 2,
                y: canvas.height * 0.4,
                r: Math.random() * 6 + 4,
                d: Math.random() * 60,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
                tiltAngle: 0,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.7) * 16
            });
        }

        if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);

        let frames = 0;
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frames++;

            confettiParticles.forEach(p => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2 + p.vy;
                p.x += Math.sin(p.d) + p.vx;
                p.vy += 0.2; // Gravity
                p.tilt = Math.sin(p.tiltAngle) * 12;

                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
                ctx.stroke();
            });

            if (frames < 140) {
                confettiAnimationId = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        render();
    }

    // ============================================
    // 4. SPA ROUTING & NAVIGATION
    // ============================================

    const allPages = document.querySelectorAll('.app-page');
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');

    const MANAGED_SECTION_PAGES = {
        basketball: 'basketballPage', volleyball: 'volleyballPage', handball: 'handballPage',
        tennis: 'tennisPage', taekwondo: 'taekwondoPage', athletics: 'athleticsPage',
        otherSports: 'otherSportsPage', board: 'boardPage', presidents: 'presidentsPage',
        membership: 'membershipPage', foundation: 'foundationPage', contact: 'contactPage'
    };
    const MANAGED_SECTION_TITLES = {
        basketball:'كرة السلة',volleyball:'كرة الطائرة',handball:'كرة اليد',tennis:'التنس',
        taekwondo:'التايكواندو',athletics:'ألعاب القوى',otherSports:'ألعاب أخرى',
        board:'مجلس الإدارة',presidents:'رؤساء النادي',membership:'عضوية النادي',
        foundation:'المؤسسة المجتمعية',contact:'تواصل معنا'
    };
    const escapeManagedText = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    const managedSectionPromises = new Map();
    const managedSectionReady = new Set();
    function renderManagedSection(key, payload) {
        const target = document.getElementById('managedContent-' + key);
        if (!target || !payload || !Array.isArray(payload.items)) return;
        if (!payload.items.length) {
            target.innerHTML = '<div class="managed-empty">لا توجد مواد منشورة في قسم ' + escapeManagedText(MANAGED_SECTION_TITLES[key]) + ' حتى الآن.</div>';
            return;
        }
        target.innerHTML = payload.items.map(item => {
            const title = escapeManagedText(item.title);
            const body = escapeManagedText(item.content);
            const image = item.image_url ? '<img src="' + escapeManagedText(item.image_url) + '" alt="' + title + '" loading="eager" decoding="async">' : '';
            let media = '';
            if (item.media_url) {
                if (/\\.(mp4|webm|mov)(\\?|$)/i.test(item.media_url)) media = '<video controls playsinline preload="metadata" src="' + escapeManagedText(item.media_url) + '"></video>';
                else media = '<a class="managed-content-link" href="' + escapeManagedText(item.media_url) + '" target="_blank" rel="noopener">عرض الملف المرفق</a>';
            }
            const price = item.price ? '<span class="managed-content-price">' + escapeManagedText(item.price) + '</span>' : '';
            return '<article class="managed-content-card">' + image + media + '<div class="managed-content-body"><h3>' + title + '</h3>' + (body ? '<p>' + body + '</p>' : '') + price + '</div></article>';
        }).join('');
    }
    async function loadManagedSection(key) {
        const target = document.getElementById('managedContent-' + key);
        if (!target) return;
        const apiPath = '/api/sections?section=' + encodeURIComponent(key);
        const cached = readClubSnapshot(apiPath);
        if (cached) renderManagedSection(key, cached);
        if (managedSectionReady.has(key)) return;
        if (managedSectionPromises.has(key)) return managedSectionPromises.get(key);
        if (!cached) target.innerHTML = '<div class="managed-loading">جارٍ تجهيز محتوى القسم...</div>';
        const task = (async () => {
            try {
                const payload = await clubGet(apiPath);
                if (!payload.success || !Array.isArray(payload.items)) throw new Error(payload.message || 'تعذر تحميل المحتوى');
                renderManagedSection(key, payload);
                managedSectionReady.add(key);
            } catch (error) {
                if (!cached) target.innerHTML = '<div class="managed-error">' + escapeManagedText(error.message || 'تعذر تحميل القسم حالياً') + '</div>';
            } finally {
                managedSectionPromises.delete(key);
            }
        })();
        managedSectionPromises.set(key, task);
        return task;
    }

    let currentAppPage = document.querySelector(".page.active")?.id || "homePage";
    try { history.replaceState({ appPage: currentAppPage }, "", location.href); } catch (e) {}

    function navigateToPage(pageId, fromBrowserBack = false) {
        const targetPage = document.getElementById(pageId);
        if (!targetPage) return;
        if (!fromBrowserBack && pageId !== currentAppPage) {
            try { history.pushState({ appPage: pageId }, "", location.href); } catch (e) {}
        }
        currentAppPage = pageId;
        allPages.forEach(p => p.classList.remove('active'));

        targetPage.classList.add('active');
        targetPage.scrollTop = 0;
        if (pageId === "fansPage") renderFansPage();
        if (pageId === "standingsPage" && !publicTournamentLoadStarted) {
            publicTournamentLoadStarted = true;
            loadPublicTournaments();
        }
        const managedKey = Object.keys(MANAGED_SECTION_PAGES).find(key => MANAGED_SECTION_PAGES[key] === pageId);
        if (managedKey) loadManagedSection(managedKey);

        bottomNavItems.forEach(item => {
            const dest = item.getAttribute('data-navigate');
            if (dest === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        closeNotifications();
        closeMenu();
        closeAllModals();
    }

    window.addEventListener("popstate", function(event) {
        // Android hardware Back from a Reel always returns to the app home page,
        // regardless of which section was open before the Reel viewer.
        const storyViewer = document.getElementById("storyViewerModal");
        if (storyViewer?.classList.contains("active")) {
            closeStoryViewer();
            navigateToPage("homePage", true);
            return;
        }
        const galleryViewer = document.getElementById("newsGalleryLightbox");
        if (galleryViewer?.classList.contains("active")) {
            galleryViewer.classList.remove("active");
            return;
        }
        const articleOverlay = document.getElementById("articleModalOverlay");
        if (articleOverlay?.classList.contains("active")) {
            closeAllModals();
            window.__activeNewsArticle = null;
            return;
        }
        // Android/browser Back from any section returns directly to Home.
        // Do not restore the previously visited section from the hamburger menu history.
        if (currentAppPage !== "homePage") {
            navigateToPage("homePage", true);
        }
        // Keep a Home entry on the history stack so Back from Home does not
        // navigate out to a stale section or an external page.
        try { history.pushState({ appPage: "homePage" }, "", location.href); } catch (e) {}
    });

    // Native Android Back bridge: one consistent rule for every app section and overlay.
    window.handleNativeBackFromApp = function() {
        const storyViewer = document.getElementById("storyViewerModal");
        if (storyViewer?.classList.contains("active")) {
            closeStoryViewer();
            navigateToPage("homePage", true);
            return true;
        }

        const galleryViewer = document.getElementById("newsGalleryLightbox");
        if (galleryViewer?.classList.contains("active")) {
            galleryViewer.classList.remove("active");
            return true;
        }

        const articleOverlay = document.getElementById("articleModalOverlay");
        const photoLightbox = document.getElementById("photoLightbox");
        const hasOpenModal = !!(
            articleOverlay?.classList.contains("active") ||
            photoLightbox?.classList.contains("active") ||
            document.querySelector(".app-modal-sheet.open, .modal-overlay.active, .modal.active, .overlay.active, .drawer.open")
        );
        if (hasOpenModal) {
            closeAllModals();
            window.__activeNewsArticle = null;
            return true;
        }

        const menu = document.getElementById("sideMenuOverlay");
        const notifications = document.getElementById("notifOverlay");
        if (menu?.classList.contains("active") || notifications?.classList.contains("active")) {
            closeMenu();
            closeNotifications();
            return true;
        }

        // Read the actually visible page instead of relying only on cached navigation state.
        const visiblePage = document.querySelector(".app-page.active");
        const activePageId = visiblePage?.id || currentAppPage;
        if (activePageId && activePageId !== "homePage") {
            navigateToPage("homePage", true);
            return true;
        }

        // Keep the cached state synchronized if the DOM was changed by a section controller.
        currentAppPage = "homePage";
        return false;
    };

    document.querySelectorAll('[data-navigate]').forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-navigate');
            if (target) {
                playTone(480, 'sine', 0.08);
                navigateToPage(target);
            }
        });
    });

    document.querySelectorAll('[data-back]').forEach(btn => {
        btn.addEventListener('click', function() {
            playTone(400, 'sine', 0.08);
            navigateToPage('homePage');
        });
    });

    // ============================================
    // 5. STORIES / REELS CONTROLLER
    // ============================================

    function bindStoryEvents() {
        document.querySelectorAll('.story-circle-item').forEach(el => {
            el.onclick = function() {
                const idx = parseInt(this.getAttribute('data-story-idx'), 10);
                this.classList.add('viewed');
                openStoryViewer(idx);
            };
        });
    }

    function renderStories() {
        const container = document.getElementById('storiesScrollContainer');
        if (!container) return;

        // Show exactly five Reels on the home screen; keep the full data for the viewer.
        if (!container.children || container.children.length === 0) {
            container.innerHTML = STORIES_DATA.slice(0, 5).map((s, idx) => `
                <div class="story-circle-item" data-story-idx="${idx}">
                    <div class="story-avatar-ring">
                        <div class="story-avatar-img-wrap">
                            <img src="${s.thumb}" alt="${s.title}" class="story-avatar-img" loading="lazy">
                        </div>
                        <span class="story-badge-pill">${s.badge}</span>
                    </div>
                    <span class="story-circle-label">${s.title}</span>
                </div>
            `).join('');
        }

        // Also trim any pre-rendered sixth item without deleting it from CMS or STORIES_DATA.
        Array.from(container.children).slice(5).forEach(item => item.remove());
        bindStoryEvents();
    }
    renderStories();

    // Resolve media paths returned by the CMS against the club API host.
    // Older reel records may contain /api/media/... rather than an absolute URL.
    function resolveClubMediaUrl(value) {
        const raw = String(value || '').trim();
        if (!raw) return '';
        if (/^https?:\/\//i.test(raw) || /^data:/i.test(raw) || /^blob:/i.test(raw)) return raw;
        if (raw.startsWith('//')) return 'https:' + raw;
        return CLUB_API_BASE.replace(/\/$/, '') + '/' + raw.replace(/^\//, '');
    }

    // Load club-managed Reels from the club CMS; keep the built-in preview stories as fallback.
    async function loadClubReels() {
        try {
            const payload = await clubGet('/api/reels');
            if (!payload.success || !Array.isArray(payload.reels)) return;
            STORIES_DATA = payload.reels.map((group, index) => {
                const stories = (group.stories || []).map((item, storyIndex) => ({
                    id: item.id,
                    title: group.title || ('يوميات النوارس ' + (index + 1)),
                    time: 'من يوميات النادي',
                    thumb: resolveClubMediaUrl(item.thumbnail_url || item.media_url),
                    fullImg: resolveClubMediaUrl(item.media_url),
                    mediaUrl: resolveClubMediaUrl(item.media_url),
                    mediaType: item.media_type || 'image',
                    caption: item.caption || group.title || ('الحالة ' + (storyIndex + 1))
                }));
                return {
                    id: group.id,
                    title: group.title || ('يوميات النوارس ' + (index + 1)),
                    badge: stories.length + ' حالة',
                    thumb: stories[0]?.thumb || 'images/logo.png',
                    stories
                };
            }).filter(group => group.stories.length);
            const container = document.getElementById('storiesScrollContainer');
            if (container) {
                container.innerHTML = '';
                renderStories();
            }
        } catch (error) {
            console.warn('Club Reels API unavailable; using built-in stories.', error);
        }
    }
    loadClubReels();

    let currentStoryIdx = 0;
    let currentStoryItems = [];
    let storyTimer = null;
    let storyProgressPct = 0;

    function openStoryViewer(idx) {
        currentStoryIdx = 0;
        const group = STORIES_DATA[idx];
        currentStoryItems = group?.stories?.length ? group.stories : (group ? [group] : []);
        const modal = document.getElementById('storyViewerModal');
        if (!modal) return;

        modal.classList.add('active');
        playTone(550, 'sine', 0.1);
        renderStoryProgressBars();
        loadStory(0);
    }

    function renderStoryProgressBars() {
        const wrap = document.getElementById('storyProgressBars');
        if (!wrap) return;

        wrap.innerHTML = currentStoryItems.map((_, i) => `
            <div class="story-progress-seg ${i < currentStoryIdx ? 'filled' : ''}" id="storySeg_${i}">
                <div class="story-progress-seg-fill" id="storySegFill_${i}" style="width: ${i < currentStoryIdx ? '100%' : '0%'}"></div>
            </div>
        `).join('');
    }

    function loadStory(idx) {
        currentStoryIdx = idx;
        const s = currentStoryItems[idx];
        if (!s) {
            closeStoryViewer();
            return;
        }

        const storyImage = document.getElementById('storyMediaImage');
        const storyVideo = document.getElementById('storyMediaVideo');
        const storyBackdrop = document.getElementById('storyMediaBackdrop');
        loadStoryLikeState(s.id);
        const mediaUrl = s.mediaUrl || s.fullImg;
        if (storyBackdrop) {
            storyBackdrop.src = s.thumb || mediaUrl;
            storyBackdrop.style.display = 'block';
        }
        if (storyVideo) {
            storyVideo.pause();
            storyVideo.onended = null;
        }
        if (s.mediaType === 'video' && storyVideo) {
            document.getElementById('storyTapPrev').style.display = 'none';
            document.getElementById('storyTapNext').style.display = 'none';
            storyImage.style.display = 'none';
            storyVideo.style.display = 'block';
            storyVideo.src = mediaUrl;
            storyVideo.load();
            storyVideo.play().catch(() => {});
            storyVideo.onended = () => {
                if (currentStoryIdx + 1 < currentStoryItems.length) loadStory(currentStoryIdx + 1);
                else closeStoryViewer();
            };
        } else {
            document.getElementById('storyTapPrev').style.display = '';
            document.getElementById('storyTapNext').style.display = '';
            if (storyVideo) {
                storyVideo.pause();
                storyVideo.removeAttribute('src');
                storyVideo.load();
                storyVideo.style.display = 'none';
            }
            storyImage.style.display = 'block';
            storyImage.src = mediaUrl;
        }
        document.getElementById('storyCaptionText').textContent = s.caption;
        document.getElementById('storyTimeLabel').textContent = s.time;

        for (let i = 0; i < currentStoryItems.length; i++) {
            const seg = document.getElementById(`storySeg_${i}`);
            const fill = document.getElementById(`storySegFill_${i}`);
            if (i < idx) {
                if (seg) seg.className = 'story-progress-seg filled';
                if (fill) fill.style.width = '100%';
            } else if (i === idx) {
                if (seg) seg.className = 'story-progress-seg';
                if (fill) fill.style.width = '0%';
            } else {
                if (seg) seg.className = 'story-progress-seg';
                if (fill) fill.style.width = '0%';
            }
        }

        if (s.mediaType === 'video') {
            clearInterval(storyTimer);
            const fill = document.getElementById(`storySegFill_${idx}`);
            if (fill) fill.style.width = '0%';
        } else {
            startStoryProgress(idx);
        }
    }

    function startStoryProgress(idx) {
        clearInterval(storyTimer);
        storyProgressPct = 0;

        storyTimer = setInterval(() => {
            storyProgressPct += 2;
            const fill = document.getElementById(`storySegFill_${idx}`);
            if (fill) fill.style.width = `${storyProgressPct}%`;

            if (storyProgressPct >= 100) {
                clearInterval(storyTimer);
                if (currentStoryIdx + 1 < currentStoryItems.length) {
                    loadStory(currentStoryIdx + 1);
                } else {
                    closeStoryViewer();
                }
            }
        }, 100);
    }

    function closeStoryViewer() {
        clearInterval(storyTimer);
        const video = document.getElementById('storyMediaVideo');
        if (video) { video.pause(); video.onended = null; }
        const modal = document.getElementById('storyViewerModal');
        if (modal) modal.classList.remove('active');
    }

    // Native Android Back handling: consume Back while a Reel is open,
    // close the viewer, and always return to the home page.
    window.handleNativeBackFromReel = function() {
        const modal = document.getElementById('storyViewerModal');
        if (!modal?.classList.contains('active')) return false;
        closeStoryViewer();
        navigateToPage('homePage', true);
        return true;
    };

    document.getElementById('closeStoryViewerBtn')?.addEventListener('click', closeStoryViewer);

    document.getElementById('storyTapNext')?.addEventListener('click', () => {
        clearInterval(storyTimer);
        if (currentStoryIdx + 1 < currentStoryItems.length) {
            loadStory(currentStoryIdx + 1);
        } else {
            closeStoryViewer();
        }
    });

    document.getElementById('storyTapPrev')?.addEventListener('click', () => {
        clearInterval(storyTimer);
        if (currentStoryIdx > 0) {
            loadStory(currentStoryIdx - 1);
        } else {
            loadStory(0);
        }
    });

    const REEL_VISITOR_KEY = 'shaab_reel_visitor_v1';
    const REEL_LIKES_CACHE_KEY = 'shaab_reel_likes_cache_v1';
    const reelLikeQueues = new Map();
    const reelLikeVersions = new Map();
    let reelLikeState = { storyId: 0, count: 0, liked: false, loading: false };
    function getReelVisitorKey() {
        try {
            let key = localStorage.getItem(REEL_VISITOR_KEY);
            if (!key) {
                key = window.crypto?.randomUUID?.() || ('visitor-' + Date.now() + '-' + Math.random().toString(36).slice(2));
                localStorage.setItem(REEL_VISITOR_KEY, key);
            }
            return key;
        } catch (error) {
            return 'visitor-' + (window.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
        }
    }
    function getCachedReelLikes() {
        try { return JSON.parse(localStorage.getItem(REEL_LIKES_CACHE_KEY) || '{}'); }
        catch (error) { return {}; }
    }
    function cacheReelLike(storyId, liked, count) {
        try {
            const cache = getCachedReelLikes();
            cache[String(storyId)] = { liked: !!liked, count: Math.max(0, Number(count) || 0) };
            localStorage.setItem(REEL_LIKES_CACHE_KEY, JSON.stringify(cache));
        } catch (error) {}
    }
    function paintStoryLikeButton() {
        const button = document.getElementById('storyLikeBtn');
        if (!button) return;
        const currentId = Number(currentStoryItems[currentStoryIdx]?.id || 0);
        const valid = Number.isInteger(currentId) && currentId > 0;
        button.style.display = valid ? '' : 'none';
        const liked = reelLikeState.storyId === currentId && reelLikeState.liked;
        button.classList.toggle('liked', liked);
        button.setAttribute('aria-pressed', liked ? 'true' : 'false');
        button.disabled = !valid;
        const icon = button.querySelector('i');
        if (icon) icon.className = liked ? 'fas fa-heart' : 'far fa-heart';
        const count = button.querySelector('.story-like-count');
        if (count) count.textContent = reelLikeState.storyId === currentId ? String(reelLikeState.count) : '0';
    }
    async function loadStoryLikeState(storyId) {
        const id = Number(storyId || 0);
        const cached = getCachedReelLikes()[String(id)] || {};
        reelLikeState = { storyId: id, count: Math.max(0, Number(cached.count) || 0), liked: !!cached.liked, loading: false };
        const versionAtStart = reelLikeVersions.get(id) || 0;
        paintStoryLikeButton();
        if (!Number.isInteger(id) || id < 1) return;
        try {
            const visitorKey = encodeURIComponent(getReelVisitorKey());
            const response = await fetch(CLUB_API_BASE + '/api/reel-likes?story_id=' + id + '&visitor_key=' + visitorKey, { cache: 'no-store' });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || data.success === false) throw new Error(data.message || 'تعذر تحميل الإعجابات');
            if (reelLikeState.storyId !== id || (reelLikeVersions.get(id) || 0) !== versionAtStart) return;
            reelLikeState = { storyId: id, count: Number(data.count || 0), liked: !!data.liked, loading: false };
            cacheReelLike(id, reelLikeState.liked, reelLikeState.count);
        } catch (error) {
            console.warn('Reel likes unavailable', error);
        }
        paintStoryLikeButton();
    }
    function animateStoryLike() {
        playFanCheerSound();
        const container = document.getElementById('floatingHeartsContainer');
        if (!container) return;
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const heart = document.createElement('i');
                heart.className = 'fas fa-heart floating-heart';
                heart.style.left = `${50 + (Math.random() * 60 - 30)}px`;
                container.appendChild(heart);
                setTimeout(() => heart.remove(), 1500);
            }, i * 120);
        }
    }
    async function saveReelLikeState(storyId, liked, version) {
        const previous = reelLikeQueues.get(storyId) || Promise.resolve();
        const next = previous.catch(() => {}).then(async () => {
            const response = await fetch(CLUB_API_BASE + '/api/reel-likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ story_id: storyId, visitor_key: getReelVisitorKey(), liked }),
                cache: 'no-store'
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || data.success === false) throw new Error(data.message || 'تعذر حفظ الإعجاب');
            if ((reelLikeVersions.get(storyId) || 0) === version && reelLikeState.storyId === storyId) {
                reelLikeState = { storyId, count: Number(data.count || 0), liked: !!data.liked, loading: false };
                cacheReelLike(storyId, reelLikeState.liked, reelLikeState.count);
                paintStoryLikeButton();
            }
        });
        reelLikeQueues.set(storyId, next);
        try { await next; }
        catch (error) {
            if ((reelLikeVersions.get(storyId) || 0) === version && reelLikeState.storyId === storyId) {
                showToast('تعذر حفظ الإعجاب، تحقق من اتصالك');
            }
            console.warn('Reel like save failed', error);
        } finally {
            if (reelLikeQueues.get(storyId) === next) reelLikeQueues.delete(storyId);
        }
    }
    document.getElementById('storyLikeBtn')?.addEventListener('click', function() {
        const storyId = Number(currentStoryItems[currentStoryIdx]?.id || 0);
        if (!Number.isInteger(storyId) || storyId < 1 || reelLikeState.storyId !== storyId) return;
        const liked = !reelLikeState.liked;
        const nextCount = Math.max(0, reelLikeState.count + (liked ? 1 : -1));
        const version = (reelLikeVersions.get(storyId) || 0) + 1;
        reelLikeVersions.set(storyId, version);
        reelLikeState = { storyId, count: nextCount, liked, loading: false };
        cacheReelLike(storyId, liked, nextCount);
        paintStoryLikeButton();
        if (liked) {
            animateStoryLike();
            showToast('أعجبتك هذه الحالة ❤️');
        } else {
            showToast('تم إلغاء الإعجاب');
        }
        saveReelLikeState(storyId, liked, version);
    });

    document.getElementById('storyReplyInput')?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            playTone(600, 'sine', 0.15);
            showToast('تم إرسال رسالتك للنادي بنجاح! 📨');
            this.value = '';
        }
    });

    document.getElementById('storyShareBtn')?.addEventListener('click', function() {
        showToast('تم نسخ رابط القصة للمشاركة 📋');
    });

    // ============================================
    // 6. INTERACTIVE MODALS
    // ============================================

    function closeAllModals() {
        document.querySelectorAll('.app-modal-sheet').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.modal-overlay').forEach(o => o.classList.remove('active'));
        document.getElementById('photoLightbox')?.classList.remove('active');
        closeStoryViewer();
    }

    // --- 1. Player Detail Modal ---
    window.openPlayerModal = function(playerId) {
        const player = PLAYERS_DATA.find(p => p.id === playerId);
        if (!player) return;

        playTone(550, 'sine', 0.12);

        document.getElementById('modalPlayerTitle').textContent = `بطاقة اللاعب #${player.num}`;
        const body = document.getElementById('playerModalBody');
        body.innerHTML = `
            <div class="player-hero-box">
                <div class="player-hero-avatar">
                    <img src="${player.img}" alt="${player.name}">
                    <span class="player-hero-num-badge">${player.num}</span>
                </div>
                <div class="player-hero-info">
                    <h4>${player.name}</h4>
                    <p class="player-hero-pos">${player.posName}</p>
                    <div class="player-meta-tags">
                        <span class="player-meta-tag"><i class="fas fa-flag"></i> ${player.nationality || 'يمني'}</span>
                        <span class="player-meta-tag"><i class="fas fa-calendar"></i> ${player.age} سنة</span>
                        <span class="player-meta-tag"><i class="fas fa-ruler-vertical"></i> ${player.height}</span>
                    </div>
                </div>
            </div>

            <div class="player-stats-grid">
                <div class="player-stat-bubble">
                    <strong>${player.matches}</strong>
                    <span>المباريات</span>
                </div>
                <div class="player-stat-bubble">
                    <strong>${player.pos === 'gk' ? player.cleanSheets : (player.goals || 0)}</strong>
                    <span>${player.pos === 'gk' ? 'كلين شيت' : 'الأهداف'}</span>
                </div>
                <div class="player-stat-bubble">
                    <strong>${player.pos === 'gk' ? (player.saves || 0) : (player.assists || player.tackles || 0)}</strong>
                    <span>${player.pos === 'gk' ? 'تصديات' : (player.assists > 0 ? 'تمريرات حاسمة' : 'افتكاكات')}</span>
                </div>
                <div class="player-stat-bubble">
                    <strong>${player.readiness ?? 90}%</strong>
                    <span>الجاهزية</span>
                </div>
            </div>

            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:14px; padding:12px 14px; margin-bottom:16px;">
                <h5 style="font-size:12px; font-weight:800; color:var(--primary-red); margin-bottom:6px;"><i class="fas fa-id-card"></i> نبذة عن اللاعب</h5>
                <p style="font-size:11.5px; line-height:1.6; color:var(--text-gray);">${player.bio}</p>
            </div>

            <div class="fan-cheer-section">
                <h4 style="font-size:13.5px; font-weight:800;">تشجيع جماهير النوارس 👏</h4>
                <p style="font-size:11px; opacity:0.9; margin-top:2px;">أرسل هتافك وتحيتك للاعب لدعمه في المباراة القادمة!</p>
                <button class="fan-cheer-btn" id="fanCheerActionBtn">
                    <i class="fas fa-hands-clapping"></i> <span id="cheerCountLabel">${player.cheers}</span> تشجيع
                </button>
            </div>
        `;

        document.getElementById('playerModalOverlay').classList.add('active');
        document.getElementById('playerModalSheet').classList.add('open');

        // Cheering button click
        document.getElementById('fanCheerActionBtn').addEventListener('click', function() {
            player.cheers++;
            document.getElementById('cheerCountLabel').textContent = player.cheers.toLocaleString();
            playFanCheerSound();
            fireConfetti();
            showToast(`أرسلت تحية وتشجيع للنجم ${player.name} 🔥`);
        });
    };

    document.getElementById('closePlayerModalBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('playerModalOverlay')?.addEventListener('click', closeAllModals);

    // --- 2. Match Center & E-Ticket Modal ---
    window.openMatchModal = function(matchId) {
        playTone(520, 'sine', 0.12);
        const body = document.getElementById('matchModalBody');
        if (!body) return;
        const match = MATCHES_UPCOMING.find(item => Number(item.id) === Number(matchId)) || MATCHES_UPCOMING[0] || MATCHES_RESULTS[0];
        if (!match) { body.innerHTML = '<p style="text-align:center;padding:24px">لا توجد تفاصيل متاحة لهذه المباراة حالياً.</p>'; }
        else {
            const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
            const safeImage = value => /^(https?:\/\/|\/api\/media\/)/i.test(String(value || '').trim()) ? String(value).trim() : '';
            const isClubHome = !!match.isHome;
            const clubLogo = safeImage(isClubHome ? match.homeLogo : match.opponentLogo) || 'images/logo.png';
            const opponentLogo = safeImage(isClubHome ? match.opponentLogo : match.homeLogo);
            const clubTeam = isClubHome ? match.home : match.away;
            const opponentTeam = isClubHome ? match.away : match.home;
            const lineupEntries = Array.isArray(match.lineup) ? match.lineup : [];
            const selected = lineupEntries.map(entry => {const id=typeof entry==='object'?entry.id:entry;const player=PLAYERS_DATA.find(item=>Number(item.id)===Number(id));return player?{...player,lineupSlot:typeof entry==='object'?(entry.slot||'cm'):'cm'}:null;}).filter(Boolean);
            const groups = [{key:'gk',label:'حراسة المرمى',slots:['gk']},{key:'def',label:'خط الدفاع',slots:['rb','rcb','cb','lcb','lb']},{key:'mid',label:'خط الوسط',slots:['rdm','dm','ldm','rm','cm','lm','am']},{key:'att',label:'خط الهجوم',slots:['rw','ss','st','lw']}];
            const playersByLine = groups.map(group => selected.filter(player => group.slots.includes(player.lineupSlot)));
            const lineupHtml = selected.length ? `
                <section style="margin:16px 0">
                    <h3 style="font-size:15px;font-weight:900;margin:0 0 10px;color:var(--text-dark)">تشكيلة شعب حضرموت <span style="color:var(--primary-red)">(${esc(match.formation || 'الخطة غير محددة')})</span></h3>
                    <div style="background:linear-gradient(180deg,#218653,#12633d);border:3px solid #e9f5ee;border-radius:16px;padding:14px 8px;position:relative;overflow:hidden">
                        <div style="position:absolute;inset:8px;border:1px solid rgba(255,255,255,.55);border-radius:9px;pointer-events:none"></div>
                        <div style="position:absolute;left:0;right:0;top:50%;border-top:1px solid rgba(255,255,255,.55)"></div>
                        <div style="position:absolute;width:70px;height:70px;border:1px solid rgba(255,255,255,.55);border-radius:50%;left:calc(50% - 35px);top:calc(50% - 35px)"></div>
                        <div style="position:relative;display:flex;flex-direction:column;gap:16px;align-items:center">
                            ${playersByLine.slice().reverse().map((players,index)=>players.length?`<div style="width:100%;display:flex;justify-content:space-evenly;align-items:center;gap:5px;flex-wrap:wrap">${players.map(player=>`<div style="width:64px;text-align:center;color:#fff;z-index:1"><div style="width:43px;height:43px;margin:auto;border-radius:50%;border:2px solid #fff;background:#fff;overflow:hidden;display:flex;align-items:center;justify-content:center">${safeImage(player.img)?`<img src="${esc(safeImage(player.img))}" alt="" style="width:100%;height:100%;object-fit:cover">`:'<i class="fas fa-user" style="color:#777"></i>'}</div><b style="display:block;font-size:11px;background:#fff;color:#c51e2b;border-radius:12px;width:23px;margin:-5px auto 2px;position:relative">${esc(player.num || '—')}</b><span style="display:block;font-size:9px;line-height:1.35;text-shadow:0 1px 2px #12452e">${esc(player.name)}</span></div>`).join('')}</div>`:'').join('')}
                        </div>
                    </div>
                </section>` : '<div style="padding:16px;border:1px dashed #ddd;border-radius:12px;text-align:center;color:#777;margin:14px 0">لم تعتمد الإدارة تشكيلة هذه المباراة بعد.</div>';
            body.innerHTML = `
                <div style="background:linear-gradient(135deg,#b91625,#e52c38);color:#fff;border-radius:16px;padding:18px 12px;text-align:center">
                    <div style="font-size:12px;font-weight:800;opacity:.9;margin-bottom:12px">${esc(match.round || 'مباراة نادي شعب حضرموت')}</div>
                    <div style="display:flex;align-items:center;justify-content:space-around;gap:8px">
                        <div style="flex:1"><img src="${esc(clubLogo)}" alt="" style="width:55px;height:55px;object-fit:contain;background:#fff;border-radius:50%;padding:5px"><b style="display:block;font-size:12px;margin-top:7px">${esc(clubTeam || 'شعب حضرموت')}</b></div>
                        <strong style="font-size:19px">VS</strong>
                        <div style="flex:1"><img src="${esc(opponentLogo)}" alt="" onerror="this.style.display='none'" style="width:55px;height:55px;object-fit:contain;background:#fff;border-radius:50%;padding:5px"><b style="display:block;font-size:12px;margin-top:7px">${esc(opponentTeam || match.opponent || 'المنافس')}</b></div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:14px 0">
                    <div style="background:#f7f7f7;border-radius:10px;padding:11px;text-align:center"><small style="color:#888">التاريخ</small><b style="display:block;font-size:12px;margin-top:4px">${esc(match.date || '—')}</b></div>
                    <div style="background:#f7f7f7;border-radius:10px;padding:11px;text-align:center"><small style="color:#888">وقت المباراة</small><b style="display:block;font-size:12px;margin-top:4px">${esc(match.time || 'لم يحدد')}</b></div>
                    <div style="background:#f7f7f7;border-radius:10px;padding:11px;text-align:center;grid-column:1/-1"><small style="color:#888">ملعب المباراة</small><b style="display:block;font-size:12px;margin-top:4px">${esc(match.stadium || 'لم يحدد')}</b></div>
                </div>
                ${lineupHtml}
                ${match.managed ? `<div class="fan-prediction-box" data-prediction-match="${Number(match.id)}"><div class="fan-prediction-title"><i class="fas fa-bullseye"></i> توقع نتيجة المباراة</div><div class="fan-prediction-actions"><button type="button" data-fan-predict="win" data-match-id="${Number(match.id)}">فوز شعب حضرموت</button><button type="button" data-fan-predict="draw" data-match-id="${Number(match.id)}">تعادل</button><button type="button" data-fan-predict="loss" data-match-id="${Number(match.id)}">خسارة شعب حضرموت</button></div><p class="fan-prediction-status">سجل دخولك للمشاركة في التوقعات</p></div>` : ''}
            `;
        }
        document.getElementById('matchModalOverlay')?.classList.add('active');
        document.getElementById('matchModalSheet')?.classList.add('open');
        if (window.__fanApiReady) refreshPredictionsUI();
    };

    document.getElementById('closeMatchModalBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('matchModalOverlay')?.addEventListener('click', closeAllModals);

    // --- 3. News Article Modal ---
    window.openArticleModal = function(newsId) {
        const article = NEWS_ALL.find(n => n.id === newsId) || NEWS_ALL[0];
        playTone(450, 'sine', 0.1);

        const body = document.getElementById('articleModalBody');
        body.innerHTML = `
            <div style="border-radius:16px; overflow:hidden; margin-bottom:14px; max-height:220px;">
                <img src="${article.img}" alt="${article.title}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                <span class="slide-category" style="font-size:10px; margin:0;">${article.cat}</span>
                <span style="font-size:11px; color:var(--text-light);"><i class="far fa-clock"></i> ${article.date}</span>
                <span style="font-size:11px; color:var(--text-light);"><i class="fas fa-book-open"></i> ${article.readTime}</span>
            </div>
            <h3 style="font-size:16px; font-weight:800; color:var(--text-dark); line-height:1.5; margin-bottom:12px;">
                ${article.title}
            </h3>
            <div style="font-size:12px; color:var(--primary-red); font-weight:700; margin-bottom:12px;">
                بقلم: ${article.author}
            </div>
            <div style="font-size:12.5px; line-height:1.8; color:var(--text-gray); white-space:pre-line;">
                ${article.content}
            </div>
            ${article.images && article.images.length ? `
                <section class="news-attached-gallery" aria-label="معرض الصور المصاحبة">
                    <h4><i class="fas fa-images"></i> معرض الصور المصاحبة</h4>
                    <div class="news-attached-gallery-grid">
                        ${article.images.map((url, index) => `<button type="button" class="news-attached-gallery-item" data-gallery-image="${index}" aria-label="عرض الصورة ${index + 1}"><img src="${url}" alt="صورة مصاحبة للخبر ${index + 1}" loading="lazy"></button>`).join('')}
                    </div>
                </section>
            ` : ''}
            <div style="margin-top:20px; padding-top:14px; border-top:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                <button onclick="navigator.clipboard.writeText(window.location.href); showToast('تم نسخ رابط المقال للمشاركة');" style="background:var(--card-bg); border:1px solid var(--border-color); padding:8px 16px; border-radius:20px; font-size:12px; font-family:'Cairo'; font-weight:700; cursor:pointer;">
                    <i class="fas fa-share-nodes text-red"></i> مشاركة الخبر
                </button>
                <span style="font-size:11px; color:var(--text-light);">المركز الإعلامي الرسمي</span>
            </div>
        `;

        // Every article opening starts at the beginning, even when the same article was read before.
        const articleSheet = document.getElementById('articleModalSheet');
        body.scrollTop = 0;
        if (articleSheet) articleSheet.scrollTop = 0;

        const articleOverlay = document.getElementById('articleModalOverlay');
        if (!articleOverlay.classList.contains('active')) {
            history.pushState({ ...(history.state || {}), appPage: currentAppPage, newsArticle: true }, "", location.href);
        }
        window.__activeNewsArticle = article;
        const commentsSection = document.createElement('section');
        commentsSection.id = 'newsCommentsSection';
        commentsSection.style.cssText = 'margin-top:22px;padding-top:16px;border-top:1px solid var(--border-color)';
        body.appendChild(commentsSection);
        loadNewsComments(Number(article.id));
        articleOverlay.classList.add('active');
        articleSheet.classList.add('open');
        // Reset once more after the sheet becomes visible to avoid restoring its previous scroll position.
        requestAnimationFrame(() => {
            body.scrollTop = 0;
            articleSheet.scrollTop = 0;
        });
    };

    function openNewsGalleryImage(url) {
        if (!url) return;
        let viewer = document.getElementById("newsGalleryLightbox");
        if (!viewer) {
            viewer = document.createElement("div");
            viewer.id = "newsGalleryLightbox";
            viewer.className = "news-gallery-lightbox";
            viewer.innerHTML = '<button type="button" class="news-gallery-close" aria-label="إغلاق">×</button><img alt="صورة الخبر">';
            document.body.appendChild(viewer);
            viewer.addEventListener("click", event => { if (event.target === viewer || event.target.closest(".news-gallery-close")) history.back(); });
        }
        viewer.querySelector("img").src = url;
        viewer.classList.add("active");
        history.pushState({ ...(history.state || {}), appPage: currentAppPage, newsArticle: true, newsGallery: true }, "", location.href);
    }
    document.getElementById("articleModalSheet")?.addEventListener("click", event => {
        const button = event.target.closest("[data-gallery-image]");
        if (!button) return;
        const image = window.__activeNewsArticle?.images?.[Number(button.dataset.galleryImage)];
        openNewsGalleryImage(image);
    });
    function closeArticleModalWithHistory() {
        if (document.getElementById('articleModalOverlay')?.classList.contains('active') && history.state?.newsArticle) {
            history.back();
        } else {
            closeAllModals();
            window.__activeNewsArticle = null;
        }
    }
    document.getElementById('closeArticleModalBtn')?.addEventListener('click', closeArticleModalWithHistory);
    document.getElementById('articleModalOverlay')?.addEventListener('click', closeArticleModalWithHistory);

    // --- 4. Club Store & Jersey Customizer ---
    window.openStoreModal = function() {
        playTone(500, 'sine', 0.1);
        document.getElementById('storeModalOverlay').classList.add('active');
        document.getElementById('storeModalSheet').classList.add('open');
        loadClubStore();
    };

    document.getElementById('openStoreMenuItem')?.addEventListener('click', () => {
        closeMenu();
        openStoreModal();
    });

    document.getElementById('closeStoreModalBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('storeModalOverlay')?.addEventListener('click', closeAllModals);

    // Jersey Customizer inputs
    const jerseyNameInput = document.getElementById('customJerseyNameInput');
    const jerseyNumInput = document.getElementById('customJerseyNumberInput');
    const jerseyNameDisplay = document.getElementById('jerseyNameDisplay');
    const jerseyNumDisplay = document.getElementById('jerseyNumberDisplay');

    if (jerseyNameInput && jerseyNameDisplay) {
        jerseyNameInput.addEventListener('input', function() {
            jerseyNameDisplay.textContent = this.value || 'أيمن';
        });
    }

    if (jerseyNumInput && jerseyNumDisplay) {
        jerseyNumInput.addEventListener('input', function() {
            jerseyNumDisplay.textContent = this.value || '10';
        });
    }

    // Size Pills Selection
    document.querySelectorAll('.size-pill-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-pill-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            playTone(450, 'sine', 0.05);
        });
    });

    // Order Jersey Action
    document.getElementById('orderJerseyBtn')?.addEventListener('click', function() {
        const name = jerseyNameDisplay.textContent;
        const num = jerseyNumDisplay.textContent;
        playTone(600, 'sine', 0.2);
        fireConfetti();
        showToast(`تم استلام طلب قميص النوارس باسم: ${name} (#${num}) بنجاح! 👕🎉`);
    });

    // --- 5. Shared photo likes (stored in the club database per fan account) ---
    let activeMediaLikeState = { mediaId: 0, count: 0, liked: false, loading: false };
    function paintMediaLikeButton() {
        const button = document.getElementById('lightboxLikeBtn');
        if (!button) return;
        button.classList.toggle('liked', !!activeMediaLikeState.liked);
        button.disabled = !!activeMediaLikeState.loading;
        button.setAttribute('aria-pressed', activeMediaLikeState.liked ? 'true' : 'false');
        button.innerHTML = (activeMediaLikeState.liked
            ? '<i class="fas fa-heart"></i><span>أعجبني</span>'
            : '<i class="far fa-heart"></i><span>إعجاب</span>') +
            '<span class="lightbox-like-count" aria-label="عدد الإعجابات">' + Number(activeMediaLikeState.count || 0) + '</span>';
    }
    async function loadGalleryLikeCounts() {
        const container = document.getElementById('mediaGalleryContainer');
        if (!container) return;
        try {
            const response = await fetch(CLUB_API_BASE + '/api/media-likes', { cache: 'no-store' });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || data.success === false) throw new Error(data.message || 'تعذر تحميل أعداد الإعجابات');
            const counts = new Map((data.counts || []).map(row => [Number(row.media_id), Number(row.count || 0)]));
            container.querySelectorAll('.media-like-count[data-media-id]').forEach(node => {
                const value = node.querySelector('.media-like-count-value');
                if (value) value.textContent = String(counts.get(Number(node.dataset.mediaId)) || 0);
            });
        } catch (error) {
            console.warn('Gallery likes unavailable', error);
        }
    }
    function updateGalleryLikeCount(mediaId, count) {
        const node = document.querySelector('.media-like-count[data-media-id="' + Number(mediaId) + '"] .media-like-count-value');
        if (node) node.textContent = String(Number(count || 0));
    }
    async function loadMediaLikeState(mediaId) {
        if (!Number.isInteger(Number(mediaId)) || Number(mediaId) < 1) {
            activeMediaLikeState = { mediaId: 0, count: 0, liked: false, loading: false };
            paintMediaLikeButton();
            return;
        }
        const requestedId = Number(mediaId);
        activeMediaLikeState = { mediaId: requestedId, count: 0, liked: false, loading: true };
        paintMediaLikeButton();
        try {
            const response = await fetch(CLUB_API_BASE + '/api/media-likes?media_id=' + requestedId, {
                headers: localStorage.getItem(FAN_TOKEN_KEY)
                    ? { Authorization: 'Bearer ' + localStorage.getItem(FAN_TOKEN_KEY) } : {},
                cache: 'no-store'
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || data.success === false) throw new Error(data.message || 'تعذر تحميل الإعجابات');
            if (activeMediaLikeState.mediaId !== requestedId) return;
            activeMediaLikeState = { mediaId: requestedId, count: Number(data.count || 0), liked: !!data.liked, loading: false };
        } catch (error) {
            if (activeMediaLikeState.mediaId === requestedId) activeMediaLikeState.loading = false;
            console.warn('Shared media likes unavailable', error);
        }
        paintMediaLikeButton();
    }
    window.openLightbox = function(imgSrc, caption, mediaId) {
        const lb = document.getElementById('photoLightbox');
        if (!lb || !imgSrc) return;
        document.getElementById('lightboxImage').src = imgSrc;
        document.getElementById('lightboxCaption').textContent = caption || '';
        lb.dataset.mediaSrc = imgSrc;
        lb.dataset.mediaId = String(mediaId || '');
        lb.classList.add('active');
        loadMediaLikeState(mediaId);
    };

    document.getElementById('lightboxLikeBtn')?.addEventListener('click', async function() {
        const lb = document.getElementById('photoLightbox');
        const mediaId = Number(lb?.dataset.mediaId || 0);
        if (!mediaId || activeMediaLikeState.loading) return;
        const token = localStorage.getItem(FAN_TOKEN_KEY);
        if (!token) {
            showToast('سجّل الدخول بحساب المشجع أولاً للإعجاب ❤️');
            navigateToPage('fansPage');
            return;
        }
        const button = this;
        const desiredLiked = !activeMediaLikeState.liked;
        button.disabled = true;
        try {
            const data = await fanApi('/api/media-likes', {
                method: 'POST',
                body: JSON.stringify({ media_id: mediaId, liked: desiredLiked })
            });
            if (Number(lb.dataset.mediaId) !== mediaId) return;
            activeMediaLikeState = { mediaId, count: Number(data.count || 0), liked: !!data.liked, loading: false };
            paintMediaLikeButton();
            updateGalleryLikeCount(mediaId, data.count);
            showToast(data.liked ? 'أعجبتك الصورة ❤️' : 'تم إلغاء الإعجاب');
        } catch (error) {
            button.disabled = false;
            showToast(error.status === 401 ? 'انتهت جلستك، سجّل الدخول مرة أخرى' : (error.message || 'تعذر تسجيل الإعجاب'));
            if (error.status === 401) navigateToPage('fansPage');
        }
    });

    document.getElementById('closeLightboxBtn')?.addEventListener('click', () => {
        document.getElementById('photoLightbox')?.classList.remove('active');
    });
    document.getElementById('photoLightbox')?.addEventListener('click', function(event) {
        if (event.target === this) this.classList.remove('active');
    });

    // ============================================
    // 6. RENDER VIEWS DYNAMICALLY
    // ============================================

    // Render Players
    function renderPlayers(category = 'all') {
        const container = document.getElementById('playersContainer');
        if (!container) return;

        if (category === 'staff') {
            container.innerHTML = STAFF_DATA.map(st => `
                <div class="staff-card">
                    <img src="${st.img}" alt="${st.name}" class="staff-img" loading="lazy">
                    <div class="staff-info">
                        <h4>${st.name}</h4>
                        <p>${st.role}</p>
                    </div>
                </div>
            `).join('');
            return;
        }

        const filtered = category === 'all' 
            ? PLAYERS_DATA 
            : PLAYERS_DATA.filter(p => p.pos === category);

        container.innerHTML = filtered.map(p => `
            <div class="player-card" onclick="openPlayerModal(${p.id})">
                <div class="player-card-img-wrap">
                    <img src="${p.img}" alt="${p.name}" loading="lazy">
                    <span class="player-number">${p.num}</span>
                    <span class="player-position-badge">${p.posName}</span>
                </div>
                <div class="player-info">
                    <h4>${p.name}</h4>
                    <p>العمر: ${p.age} سنة</p>
                    <div class="player-stats-row">
                        <div class="player-stat-col">
                            <span>المباريات</span>
                            <strong>${p.matches}</strong>
                        </div>
                        <div class="player-stat-col">
                            <span>${p.pos === 'gk' ? 'شباك نظيفة' : 'الأهداف'}</span>
                            <strong>${p.pos === 'gk' ? p.cleanSheets : (p.goals || 0)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    renderPlayers('all');

    document.querySelectorAll('[data-player-cat]').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('[data-player-cat]').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderPlayers(this.getAttribute('data-player-cat'));
        });
    });

    // Render Matches
    function renderMatches(type = 'upcoming') {
        const container = document.getElementById('matchesContainer');
        const standingsPanel = document.getElementById('matchesStandingsPanel');
        if (!container) return;
        const showStandings = type === 'standings';
        container.style.display = showStandings ? 'none' : '';
        if (standingsPanel) standingsPanel.hidden = !showStandings;
        if (showStandings) { renderStandings(); return; }

        if (type === 'upcoming') {
            const safeMatchText = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
            const matchLogo = (url, name, isClub) => {
                const raw = String(url || (isClub ? 'images/logo.png' : '')).trim();
                const safe = (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/api/media/') || raw.startsWith('images/')) ? raw : '';
                return safe
                    ? `<img src="${safeMatchText(safe)}" alt="${safeMatchText(name)}" class="match-team-logo-img" loading="eager" fetchpriority="high" decoding="sync" onerror="this.outerHTML='<i class=&quot;fas fa-shield-halved&quot;></i>'">`
                    : '<i class="fas fa-shield-halved"></i>';
            };
            container.innerHTML = MATCHES_UPCOMING.map(m => {
                const homeIsClub = !!m.isHome;
                const homeLogo = homeIsClub ? (m.homeLogo || 'images/logo.png') : m.opponentLogo;
                const awayLogo = homeIsClub ? m.opponentLogo : (m.homeLogo || 'images/logo.png');
                return `
                <div class="match-card-full" onclick="if(!event.target.closest('.fan-prediction-box')) openMatchModal(${Number(m.id)})">
                    <div class="match-competition-tag">
                        <span><i class="fas fa-trophy"></i> ${safeMatchText(m.round)}</span>
                        <span class="time-badge">${safeMatchText(m.time)}</span>
                    </div>
                    <div class="match-teams-row">
                        <div class="m-team">
                            <div class="m-team-logo">${matchLogo(homeLogo, m.home, homeIsClub)}</div>
                            <span>${safeMatchText(m.home)}</span>
                        </div>
                        <div class="m-center-score">
                            <span class="vs-text">VS</span>
                        </div>
                        <div class="m-team">
                            <div class="m-team-logo">${matchLogo(awayLogo, m.away, !homeIsClub)}</div>
                            <span>${safeMatchText(m.away)}</span>
                        </div>
                    </div>
                    <div class="match-venue">
                        <i class="far fa-calendar"></i> ${safeMatchText(m.date)} | <i class="fas fa-location-dot"></i> ${safeMatchText(m.stadium)}
                    </div>
                    ${m.managed ? `<div class="fan-prediction-box" data-prediction-match="${Number(m.id)}"><div class="fan-prediction-title"><i class="fas fa-bullseye"></i> توقع نتيجة المباراة</div><div class="fan-prediction-actions"><button type="button" data-fan-predict="win" data-match-id="${Number(m.id)}">فوز شعب حضرموت</button><button type="button" data-fan-predict="draw" data-match-id="${Number(m.id)}">تعادل</button><button type="button" data-fan-predict="loss" data-match-id="${Number(m.id)}">خسارة شعب حضرموت</button></div><p class="fan-prediction-status">سجل دخولك للمشاركة في التوقعات</p></div>` : ''}
                </div>`;
            }).join('');
        } else {
            container.innerHTML = MATCHES_RESULTS.map(m => `
                <div class="match-card-full">
                    <div class="match-competition-tag">
                        <span><i class="fas fa-trophy"></i> ${m.round}</span>
                        <span>${m.date}</span>
                    </div>
                    <div class="match-teams-row">
                        <div class="m-team">
                            <div class="m-team-logo"><i class="fas fa-shield-halved"></i></div>
                            <span>${m.home}</span>
                        </div>
                        <div class="m-center-score">
                            <span class="score-badge">${m.score}</span>
                        </div>
                        <div class="m-team">
                            <div class="m-team-logo"><i class="fas fa-shield-halved"></i></div>
                            <span>${m.away}</span>
                        </div>
                    </div>
                    <div class="match-venue" style="color:var(--primary-red); font-weight:700;">
                        ⚽ مسجلو الأهداف: ${m.scorers}
                    </div>
                </div>
            `).join('');
        }
    }
    renderMatches('upcoming');

    document.querySelectorAll('[data-match-tab]').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('[data-match-tab]').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderMatches(this.getAttribute('data-match-tab'));
            if (window.__fanApiReady) refreshPredictionsUI();
        });
    });

    // Render Standings
    function renderStandings() {
        const tbody = document.getElementById('standingsBody');
        if (!tbody) return;

        const rowsHtml = STANDINGS_DATA.map(row => `
            <tr class="${row.isShaab ? 'highlight-shaab' : ''}">
                <td><strong>${row.rank}</strong></td>
                <td class="text-right">${row.logo && (row.logo.startsWith("https://") || row.logo.startsWith("http://") || row.logo.startsWith("/api/media/")) ? `<img src="${row.logo.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" alt="" style="width:30px;height:30px;object-fit:contain;vertical-align:middle;margin-left:8px" loading="lazy">` : ''}<strong>${row.team}</strong> ${row.isShaab ? '⭐' : ''}</td>
                <td>${row.played}</td>
                <td>${row.won}</td>
                <td>${row.draw}</td>
                <td>${row.lost}</td>
                <td>${row.diff}</td>
                <td><strong>${row.points}</strong></td>
            </tr>
        `).join('');
        document.querySelectorAll('#standingsBody, #matchesStandingsBody').forEach(body => { body.innerHTML = rowsHtml; });
    }
    renderStandings();

    // Render Transfers
    function renderTransfers(type = 'in') {
        const container = document.getElementById('transfersContainer');
        if (!container) return;

        const list = TRANSFERS_DATA[type] || [];
        container.innerHTML = list.map(t => `
            <div class="transfer-card">
                <img src="${t.img}" alt="${t.name}" class="transfer-avatar" loading="lazy">
                <div class="transfer-details">
                    <h4>${t.name}</h4>
                    <span class="transfer-type ${type === 'in' ? 'trans-in' : type === 'out' ? 'trans-out' : 'trans-renew'}">${t.type}</span>
                    <div class="transfer-club-flow">
                        <span>${t.from ? t.from + ' ➔ ' : ''}${t.to || 'شعب حضرموت'}</span>
                        <span>• ${t.val}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    renderTransfers('in');

    document.querySelectorAll('[data-trans-tab]').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('[data-trans-tab]').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderTransfers(this.getAttribute('data-trans-tab'));
        });
    });

    // Render Media
    function renderMedia(type = 'photos') {
        const container = document.getElementById('mediaGalleryContainer');
        if (!container) return;
        const list = MEDIA_DATA[type] || [];
        container.innerHTML = list.map((item, index) => {
            const title = String(item.title || '');
            const url = String(item.media_url || item.img || '');
            const safeTitle = title.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
            const safeUrl = url.replace(/[\\"']/g, '');
            const safePoster = String(item.img || '').replace(/[\\"']/g, '');
            const media = type === 'videos'
                ? '<video controls playsinline preload="metadata" poster="' + safePoster + '" src="' + safeUrl + '" style="width:100%;height:100%;object-fit:cover"></video>'
                : '<img class="media-photo-open" data-photo-index="' + index + '" src="' + safeUrl + '" alt="' + safeTitle + '" loading="lazy" role="button" tabindex="0" aria-label="فتح الصورة: ' + safeTitle + '">';
            const likeBadge = type === 'photos' ? '<span class="media-like-count" data-media-id="' + Number(item.id || 0) + '" aria-label="عدد القلوب"><i class="fas fa-heart"></i><span class="media-like-count-value">0</span></span>' : '';
            return '<div class="media-item-box"><div class="media-item-thumb">' + media + likeBadge + '</div><div class="media-item-title">' + safeTitle + '</div></div>';
        }).join('');
        if (type === 'photos') loadGalleryLikeCounts();
    }
    renderMedia('photos');

    document.querySelectorAll('[data-media-tab]').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('[data-media-tab]').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderMedia(this.getAttribute('data-media-tab'));
        });
    });

    // Open a photo in the full-screen viewer when its thumbnail is tapped.
    const mediaGallery = document.getElementById('mediaGalleryContainer');
    mediaGallery?.addEventListener('click', function(event) {
        const photo = event.target.closest('.media-photo-open');
        if (!photo) return;
        const item = (MEDIA_DATA.photos || [])[Number(photo.dataset.photoIndex)];
        if (item) openLightbox(item.media_url || item.img || '', item.title || '', item.id);
    });
    mediaGallery?.addEventListener('keydown', function(event) {
        if ((event.key !== 'Enter' && event.key !== ' ') || !event.target.matches('.media-photo-open')) return;
        event.preventDefault();
        const item = (MEDIA_DATA.photos || [])[Number(event.target.dataset.photoIndex)];
        if (item) openLightbox(item.media_url || item.img || '', item.title || '', item.id);
    });

    // Render Anthems
    function renderAnthems() {
        const list = document.getElementById('anthemsList');
        if (!list) return;

        list.innerHTML = ANTHEMS_DATA.map((a, i) => `
            <div class="chant-row ${i === 0 ? 'active' : ''}" data-anthem-index="${i}">
                <div class="chant-title"><i class="fas fa-music text-red" style="margin-left:6px;"></i> ${a.title}</div>
                <div class="chant-duration">${a.duration}</div>
            </div>
        `).join('');

        document.querySelectorAll('.chant-row').forEach(row => {
            row.addEventListener('click', function() {
                document.querySelectorAll('.chant-row').forEach(r => r.classList.remove('active'));
                this.classList.add('active');
                const idx = parseInt(this.getAttribute('data-anthem-index'), 10);
                loadAnthem(idx);
            });
        });
    }
    renderAnthems();

    // Audio Player State
    let currentAnthemIdx = 0;
    let isPlaying = false;
    let audioTimer = null;
    let audioSecs = 72; // 1:12

    let clubAudioPlayer = null;
    function loadAnthem(index) {
        if (!ANTHEMS_DATA.length) return;
        currentAnthemIdx = (index + ANTHEMS_DATA.length) % ANTHEMS_DATA.length;
        const song = ANTHEMS_DATA[currentAnthemIdx];
        document.getElementById('currentAnthemTitle').textContent = song.title || 'نشيد النادي';
        document.getElementById('currentAnthemArtist').textContent = song.artist || song.description || 'أناشيد نادي شعب حضرموت';
        document.getElementById('totalTimeDisplay').textContent = song.duration || '—:—';
        if (clubAudioPlayer) { clubAudioPlayer.pause(); clubAudioPlayer.onended = null; }
        clubAudioPlayer = song.audio_url ? new Audio(song.audio_url) : null;
        if (clubAudioPlayer) {
            clubAudioPlayer.preload = 'metadata';
            clubAudioPlayer.addEventListener('loadedmetadata', () => {
                const d = clubAudioPlayer.duration;
                if (Number.isFinite(d)) document.getElementById('totalTimeDisplay').textContent = Math.floor(d/60)+':' + String(Math.floor(d%60)).padStart(2,'0');
            });
            clubAudioPlayer.onended = () => loadAnthem((currentAnthemIdx + 1) % ANTHEMS_DATA.length);
        }
        audioSecs = 0;
        updateAudioTimeUI();
        playAnthem();
    }
    function playAnthem() {
        isPlaying = true;
        document.getElementById('playIcon').className = 'fas fa-pause';
        document.getElementById('discIcon').classList.add('rotating');
        if (clubAudioPlayer) clubAudioPlayer.play().catch(() => { showToast('تعذر تشغيل الملف الصوتي. تحقق من اتصال الإنترنت.'); });
        else playAnthemTune();
        clearInterval(audioTimer);
        audioTimer = setInterval(() => {
            audioSecs = clubAudioPlayer ? Math.floor(clubAudioPlayer.currentTime || 0) : audioSecs + 1;
            updateAudioTimeUI();
            if (!clubAudioPlayer && audioSecs % 8 === 0) playTone(440, 'triangle', 0.1);
        }, 1000);
    }

    function pauseAnthem() {
        isPlaying = false;
        document.getElementById('playIcon').className = 'fas fa-play';
        document.getElementById('discIcon').classList.remove('rotating');
        clearInterval(audioTimer);
        if (clubAudioPlayer) clubAudioPlayer.pause();
    }

    function updateAudioTimeUI() {
        const mins = Math.floor(audioSecs / 60);
        const secs = audioSecs % 60;
        const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        document.getElementById('currentTimeDisplay').textContent = formatted;

        const pct = Math.min((audioSecs / 195) * 100, 100);
        document.getElementById('audioProgressFill').style.width = pct + '%';
    }

    document.getElementById('playPauseBtn')?.addEventListener('click', () => {
        if (isPlaying) pauseAnthem();
        else playAnthem();
    });

    document.getElementById('nextTrackBtn')?.addEventListener('click', () => {
        let nxt = (currentAnthemIdx + 1) % ANTHEMS_DATA.length;
        loadAnthem(nxt);
    });

    document.getElementById('prevTrackBtn')?.addEventListener('click', () => {
        let prv = (currentAnthemIdx - 1 + ANTHEMS_DATA.length) % ANTHEMS_DATA.length;
        loadAnthem(prv);
    });

    // Render All News
    function renderAllNews(query = '') {
        const container = document.getElementById('newsAllContainer');
        if (!container) return;

        const filtered = query.trim() 
            ? NEWS_ALL.filter(n => n.title.includes(query) || n.cat.includes(query))
            : NEWS_ALL;

        container.innerHTML = filtered.length ? filtered.map(n => `
            <div class="news-card" onclick="openArticleModal(${n.id})">
                <div class="news-card-image">
                    <img src="${n.img}" alt="${n.title}" loading="lazy">
                </div>
                <div class="news-card-content">
                    <span class="slide-category" style="margin-bottom:4px; font-size:9.5px; padding:2px 8px;">${n.cat}</span>
                    <h4>${n.title}</h4>
                    <div class="news-date"><i class="far fa-clock"></i><span>${n.date}</span></div>
                </div>
            </div>
        `).join('') : '<div class="empty-state">لا توجد أخبار محفوظة للعرض دون اتصال.</div>';
    }
    renderAllNews();

    document.getElementById('newsSearchInput')?.addEventListener('input', function() {
        renderAllNews(this.value);
    });

    // Homepage News Cards Click
    document.querySelectorAll('.news-cards-container .news-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-news-id'), 10) || 1;
            openArticleModal(id);
        });
    });

    // Match banner click leads to match center modal
    document.getElementById('matchBannerCard')?.addEventListener('click', openMatchModal);

    // ============================================
    // 7. SLIDER FUNCTIONALITY
    // ============================================
    let currentSlide = 0;
    let slideInterval;
    const sliderWrapper = document.getElementById('sliderWrapper');
    const sliderDots = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const getSlides = () => Array.from(sliderWrapper?.querySelectorAll('.slide') || []);
    const getDots = () => Array.from(sliderDots?.querySelectorAll('.dot') || []);

    function goToSlide(index) {
        const slides = getSlides();
        if (!slides.length) return;
        index = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
        getDots().forEach((dot, i) => dot.classList.toggle('active', i === index));
        currentSlide = index;
    }
    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }
    function startAutoSlide() {
        stopAutoSlide();
        if (getSlides().length > 1) slideInterval = setInterval(nextSlide, 4500);
    }
    function stopAutoSlide() {
        if (slideInterval) { clearInterval(slideInterval); slideInterval = null; }
    }
    nextBtn?.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
    prevBtn?.addEventListener('click', () => { prevSlide(); startAutoSlide(); });
    sliderDots?.addEventListener('click', event => {
        const dot = event.target.closest('.dot');
        if (!dot) return;
        goToSlide(Number(dot.dataset.slideIndex));
        startAutoSlide();
    });
    sliderWrapper?.addEventListener('click', event => {
        const slide = event.target.closest('.slide[data-cms-slide]');
        if (!slide) return;
        const item = (window.__clubCarouselItems || []).find(row => String(row.id) === String(slide.dataset.cmsSlide));
        if (item) window.openCarouselArticle?.(item);
    });
    const sliderContainer = document.getElementById('newsSlider');
    let touchStartX = 0;
    sliderContainer?.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0]?.clientX || 0; }, {passive:true});
    sliderContainer?.addEventListener('touchend', event => {
        const delta = (event.changedTouches[0]?.clientX || 0) - touchStartX;
        if (Math.abs(delta) > 45) { delta < 0 ? nextSlide() : prevSlide(); startAutoSlide(); }
    }, {passive:true});
    startAutoSlide();

    // ============================================
    // 8. SIDE MENU & NOTIFICATIONS DRAWER
    // ============================================
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const sideMenuOverlay = document.getElementById('sideMenuOverlay');

    function openMenu() {
        sideMenu.classList.add('open');
        sideMenuOverlay.classList.add('active');
    }

    function closeMenu() {
        sideMenu.classList.remove('open');
        sideMenuOverlay.classList.remove('active');
    }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (sideMenuOverlay) sideMenuOverlay.addEventListener('click', closeMenu);

    // Notifications Panel
    const notifNavBtn = document.getElementById('notifNavBtn');
    const notifPanel = document.getElementById('notifPanel');
    const notifOverlay = document.getElementById('notifOverlay');
    const notifCloseBtn = document.getElementById('notifCloseBtn');
    const markAllReadBtn = document.getElementById('markAllRead');
    const notifBadge = document.getElementById('notifBadge');

    function openNotifications() {
        notifPanel.classList.add('open');
        notifOverlay.classList.add('active');
    }

    function closeNotifications() {
        notifPanel.classList.remove('open');
        notifOverlay.classList.remove('active');
    }

    if (notifNavBtn) {
        notifNavBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openNotifications();
        });
    }

    if (notifCloseBtn) notifCloseBtn.addEventListener('click', closeNotifications);
    if (notifOverlay) notifOverlay.addEventListener('click', closeNotifications);

    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            document.querySelectorAll('.notif-item.unread').forEach(item => {
                item.classList.remove('unread');
                const dot = item.querySelector('.unread-dot');
                if (dot) dot.remove();
            });
            if (notifBadge) notifBadge.style.display = 'none';
            playTone(600, 'sine', 0.15);
            showToast('تم تحديد جميع الإشعارات كمقروءة');
        });
    }

    // ============================================
    // 9. SETTINGS (Dark Mode, Clock, Share)
    // ============================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        if (localStorage.getItem('shaab_dark_mode') === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }

        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('shaab_dark_mode', 'true');
                showToast('تم تفعيل الوضع الليلي 🌙');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('shaab_dark_mode', 'false');
                showToast('تم تفعيل الوضع النهاري ☀️');
            }
        });
    }

    document.getElementById('shareAppBtn')?.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'تطبيق نادي شعب حضرموت',
                text: 'حمّل تطبيق نادي شعب حضرموت الرسمي وتابع كل جديد النوارس!',
                url: window.location.href
            }).catch(() => {});
        } else {
            showToast('تم نسخ رابط التطبيق للمشاركة 📋');
        }
    });

    document.getElementById('rateAppBtn')?.addEventListener('click', () => {
        fireConfetti();
        showToast('شكراً لدعمك نادي شعب حضرموت ⭐⭐⭐⭐⭐');
    });

    function updateClock() {
        const clockEl = document.getElementById('liveClock');
        if (!clockEl) return;
        const now = new Date();
        let hours = now.getHours();
        let mins = now.getMinutes();
        hours = hours % 12 || 12;
        clockEl.textContent = `${hours}:${mins < 10 ? '0' : ''}${mins}`;
    }
    updateClock();
    setInterval(updateClock, 30000);

    // ============================================
    // 11. TOAST NOTIFICATION UTILITY
    // ============================================
    window.showToast = function(text) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-info-circle"></i> <span>${text}</span>`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2200);
    };


    // =========================================================
    // Live Club CMS integration: load every managed section once
    // and preserve the existing app layout and local fallbacks.
    // =========================================================
    const CLUB_API_BASE = 'https://shaab-hadramout.pages.dev';
    // =========================================================
    // FAN ACCOUNT AREA: independent public fan accounts.
    // =========================================================
    const FAN_TOKEN_KEY = 'shaab_fan_session_v1';
    const FAN_API_BASE = CLUB_API_BASE;
    const fanAuthRoot = document.getElementById('fanAuthContent');
    let fanCurrentUser = null;
    let fanAuthMode = 'login';
    let fanGoogleClientId = '';
    let fanGoogleScriptPromise = null;
    let fanGoogleButtonRendered = false;


    async function loadNewsComments(newsId) {
        const host = document.getElementById('newsCommentsSection');
        if (!host || !Number.isInteger(Number(newsId)) || Number(newsId) < 1) return;
        const id = Number(newsId);
        host.innerHTML = '<div style="padding:14px;text-align:center;color:var(--text-light)">جارٍ تحميل التعليقات...</div>';
        try {
            const response = await fetch(CLUB_API_BASE + '/api/news-comments?news_id=' + id, { cache: 'no-store' });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.success) throw new Error(data.message || 'تعذر تحميل التعليقات');
            if (String(window.__activeNewsArticle?.id) !== String(id)) return;
            const comments = Array.isArray(data.comments) ? data.comments : [];
            const token = localStorage.getItem(FAN_TOKEN_KEY);
            host.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
                    <h4 style="margin:0;font-size:15px;font-weight:800;color:var(--text-dark)"><i class="far fa-comments" style="color:var(--primary-red)"></i> التعليقات</h4>
                    <span style="font-size:11px;color:var(--text-light)">${comments.length} تعليق</span>
                </div>
                <div class="news-comments-list">
                    ${comments.length ? comments.map(comment => `
                        <div style="display:flex;gap:10px;padding:11px 0;border-bottom:1px solid var(--border-color)">
                            <div style="width:34px;height:34px;flex:0 0 34px;border-radius:50%;background:rgba(181,18,27,.09);color:var(--primary-red);display:grid;place-items:center"><i class="fas fa-user"></i></div>
                            <div style="min-width:0;flex:1">
                                <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
                                    <strong style="font-size:12px;color:var(--text-dark)">${fanEscape(comment.member_name)}</strong>
                                    <small style="font-size:10px;color:var(--text-light)">${fanEscape(comment.created_at || '')}</small>
                                </div>
                                <p style="font-size:12px;line-height:1.8;color:var(--text-gray);white-space:pre-wrap;overflow-wrap:anywhere;margin:4px 0 0">${fanEscape(comment.comment)}</p>
                            </div>
                        </div>`).join('') : '<p style="text-align:center;padding:16px;color:var(--text-light);font-size:12px">كن أول من يعلّق على هذا الخبر</p>'}
                </div>
                ${token ? `
                    <form id="newsCommentForm" style="margin-top:14px;display:flex;gap:8px;align-items:flex-end">
                        <textarea name="comment" maxlength="1000" required placeholder="اكتب تعليقك..." rows="2" style="flex:1;min-width:0;resize:vertical;border:1px solid var(--border-color);border-radius:12px;padding:10px;font:inherit;font-size:12px;background:var(--card-bg);color:var(--text-dark)"></textarea>
                        <button type="submit" style="border:0;border-radius:12px;background:var(--primary-red);color:#fff;padding:11px 14px;font:inherit;font-size:12px;font-weight:800"><i class="fas fa-paper-plane"></i> إرسال</button>
                    </form>
                    <small style="display:block;margin-top:7px;color:var(--text-light);font-size:10px">سيظهر تعليقك باسم حسابك المسجل.</small>
                ` : `
                    <button type="button" data-news-comment-login style="width:100%;margin-top:12px;border:1px solid var(--primary-red);border-radius:12px;background:transparent;color:var(--primary-red);padding:11px;font:inherit;font-size:12px;font-weight:800"><i class="fas fa-user-lock"></i> سجّل الدخول لتتمكن من التعليق</button>
                `}
            `;
        } catch (error) {
            host.innerHTML = '<p style="padding:12px;text-align:center;color:var(--text-light);font-size:12px">تعذر تحميل التعليقات حالياً.</p>';
        }
    }

    const newsCommentsHost = document.getElementById('articleModalBody');
    newsCommentsHost?.addEventListener('click', event => {
        if (event.target.closest('[data-news-comment-login]')) {
            try { history.replaceState({ appPage: currentAppPage }, '', location.href); } catch (error) {}
            closeAllModals();
            window.__activeNewsArticle = null;
            navigateToPage('fansPage');
        }
    });
    newsCommentsHost?.addEventListener('submit', async event => {
        const form = event.target.closest('#newsCommentForm');
        if (!form) return;
        event.preventDefault();
        const articleId = Number(window.__activeNewsArticle?.id || 0);
        const field = form.elements.comment;
        const comment = String(field?.value || '').trim();
        if (!articleId || !comment) return;
        const submit = form.querySelector('button[type="submit"]');
        submit.disabled = true;
        try {
            await fanApi('/api/news-comments', { method: 'POST', body: JSON.stringify({ news_id: articleId, comment }) });
            await loadNewsComments(articleId);
            showToast('تم نشر تعليقك بنجاح');
        } catch (error) {
            showToast(error.status === 401 ? 'سجّل الدخول بحسابك أولاً' : (error.message || 'تعذر إرسال التعليق'));
            if (error.status === 401) {
                try { history.replaceState({ appPage: currentAppPage }, '', location.href); } catch (historyError) {}
                closeAllModals();
                window.__activeNewsArticle = null;
                navigateToPage('fansPage');
            }
        } finally {
            if (submit.isConnected) submit.disabled = false;
        }
    });

    async function fanApi(path, options = {}) {
        const token = localStorage.getItem(FAN_TOKEN_KEY) || '';
        const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
        if (token) headers.Authorization = 'Bearer ' + token;
        const response = await fetch(FAN_API_BASE + path, Object.assign({}, options, { headers, cache: 'no-store' }));
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload.success === false) {
            const diagnostic = payload.diagnostic && (payload.diagnostic.name || payload.diagnostic.detail)
                ? ' (' + [payload.diagnostic.name, payload.diagnostic.detail].filter(Boolean).join(': ') + ')'
                : '';
            const error = new Error((payload.message || 'تعذر تنفيذ الطلب') + diagnostic);
            error.status = response.status;
            throw error;
        }
        return payload;
    }

    function fanEscape(value) {
        return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    }

    function fanShowMessage(message, type = 'error') {
        if (!fanAuthRoot) return;
        const box = fanAuthRoot.querySelector('.fan-form-message');
        if (!box) return;
        box.textContent = message;
        box.className = 'fan-form-message ' + type;
        box.hidden = false;
    }

    function renderFanAuth() {
        if (!fanAuthRoot) return;
        if (fanCurrentUser) {
            const user = fanCurrentUser;
            if (!user.phone) {
                fanAuthRoot.innerHTML = `
                    <div class="fan-welcome-banner"><div class="fan-banner-pattern"></div><div class="fan-crest"><img src="images/logo.png" alt="شعار النادي"></div><span class="fan-eyebrow">خطوة أخيرة</span><h3>أكمل عضويتك</h3><p>أدخل اسمك الثلاثي ورقم هاتفك للانضمام إلى توقعات وجوائز جمهور النادي</p></div>
                    <div class="fan-auth-card">
                        <div class="fan-auth-heading"><h3>بيانات عضو الجمهور</h3><p>رقم الهاتف خاص بعضويتك ولا يمكن استخدامه في حساب آخر</p></div>
                        <div class="fan-form-message" hidden></div>
                        <form class="fan-auth-form" data-fan-form="profile" novalidate>
                            <label>الاسم الثلاثي</label><div class="fan-input-wrap"><i class="fas fa-user"></i><input name="name" type="text" autocomplete="name" placeholder="الاسم الأول والثاني والثالث" maxlength="80" value="${fanEscape(user.name || '')}" required></div>
                            <label>رقم الهاتف</label><div class="fan-input-wrap"><i class="fas fa-mobile-screen"></i><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="مثال: 9677XXXXXXXX" required></div>
                            <button class="fan-submit-btn" type="submit"><span>حفظ بيانات العضوية</span><i class="fas fa-arrow-left"></i></button>
                        </form>
                        <p class="fan-privacy-note"><i class="fas fa-lock"></i> لا يظهر رقم هاتفك في لوحة صدارة المشجعين.</p>
                    </div>`;
                return;
            }
            fanAuthRoot.innerHTML = `
                <div class="fan-welcome-banner">
                    <div class="fan-banner-pattern"></div>
                    <div class="fan-crest"><img src="images/logo.png" alt="شعار نادي شعب حضرموت"></div>
                    <span class="fan-eyebrow">أهلاً بك بين أهلك</span>
                    <h3>جمهور نادي الشعب</h3>
                    <p>أنت جزء من مدرج النوارس ❤️</p>
                </div>
                <div class="fan-account-card">
                    <div class="fan-account-avatar"><i class="fas fa-user"></i></div>
                    <div class="fan-account-info">
                        <span class="fan-account-label">حساب المشجع</span>
                        <h3>${fanEscape(user.name)}</h3>
                        <p>${fanEscape(user.phone || user.email || 'عضو جمهور شعباوي')}</p>
                        <small>رقم العضوية #${fanEscape(user.id)}</small>
                    </div>
                    <span class="fan-verified"><i class="fas fa-check"></i></span>
                </div>
                <div class="fan-member-note"><i class="fas fa-heart"></i><span>يسعدنا انضمامك إلى جمهور نادي شعب حضرموت. حسابك محفوظ ويمكنك العودة إليه في أي وقت.</span></div>
                <button type="button" class="fan-logout-btn" data-fan-logout><i class="fas fa-right-from-bracket"></i> تسجيل الخروج</button>
            `;
            return;
        }

        const isRegister = fanAuthMode === 'register';
        fanAuthRoot.innerHTML = `
            <div class="fan-welcome-banner">
                <div class="fan-banner-pattern"></div>
                <div class="fan-crest"><img src="images/logo.png" alt="شعار نادي شعب حضرموت"></div>
                <span class="fan-eyebrow">مدرج واحد.. قلب واحد</span>
                <h3>جمهور نادي الشعب</h3>
                <p>انضم إلى عائلة النوارس وكن قريباً من ناديك</p>
                <div class="fan-banner-pills"><span><i class="fas fa-shield-heart"></i> روح الانتماء</span><span><i class="fas fa-users"></i> عائلة واحدة</span></div>
            </div>
            <div class="fan-auth-card">
                <div class="fan-auth-heading">
                    <h3>${isRegister ? 'إنشاء حساب مشجع جديد' : 'مرحباً بعودتك'}</h3>
                    <p>${isRegister ? 'سجل بياناتك وانضم إلى جمهور النوارس' : 'سجل دخولك إلى حساب جمهور نادي الشعب'}</p>
                </div>
                <div class="fan-auth-tabs">
                    <button type="button" data-fan-mode="login" class="${!isRegister ? 'active' : ''}">تسجيل الدخول</button>
                    <button type="button" data-fan-mode="register" class="${isRegister ? 'active' : ''}">حساب جديد</button>
                </div>
                <div class="fan-form-message" hidden></div>
                <form class="fan-auth-form" data-fan-form="${isRegister ? 'register' : 'login'}" novalidate>
                    ${isRegister ? `
                    <label>الاسم الثلاثي</label>
                    <div class="fan-input-wrap"><i class="fas fa-user"></i><input name="name" type="text" autocomplete="name" placeholder="اكتب اسمك الثلاثي" maxlength="80" required></div>
                    ` : ''}
                    <label>رقم الجوال</label>
                    <div class="fan-input-wrap"><i class="fas fa-mobile-screen"></i><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="مثال: 9677XXXXXXXX" required></div>
                    <label>كلمة المرور</label>
                    <div class="fan-input-wrap"><i class="fas fa-lock"></i><input name="password" type="password" autocomplete="${isRegister ? 'new-password' : 'current-password'}" placeholder="${isRegister ? '8 أحرف على الأقل' : 'أدخل كلمة المرور'}" minlength="8" required></div>
                    ${isRegister ? `
                    <label>تأكيد كلمة المرور</label>
                    <div class="fan-input-wrap"><i class="fas fa-lock"></i><input name="confirmPassword" type="password" autocomplete="new-password" placeholder="أعد كتابة كلمة المرور" minlength="8" required></div>
                    ` : ''}
                    <button class="fan-submit-btn" type="submit"><span>${isRegister ? 'إنشاء حسابي' : 'تسجيل الدخول'}</span><i class="fas fa-arrow-left"></i></button>
                </form>
                <div class="fan-auth-divider"><span>أو تابع باستخدام</span></div>
                <div class="fan-google-area"><div id="fanGoogleButton"></div>
                    ${fanGoogleClientId ? '' : '<button type="button" class="fan-google-disabled" disabled><span class="fan-google-g">G</span> المتابعة باستخدام Google</button><p class="fan-google-note">سيتم تفعيل تسجيل Google بعد ربط حساب النادي بخدمة Google.</p>'}
                </div>
                <p class="fan-privacy-note"><i class="fas fa-lock"></i> بياناتك تستخدم لإنشاء حساب جمهور آمن، ولا تظهر للزوار الآخرين.</p>
            </div>
        `;
        if (fanGoogleClientId) renderFanGoogleButton();
    }

    async function renderFansPage() {
        if (!fanAuthRoot) return;
        fanAuthRoot.innerHTML = '<div class="fan-loading"><i class="fas fa-spinner fa-spin"></i><span>جارٍ التحقق من حسابك...</span></div>';
        const token = localStorage.getItem(FAN_TOKEN_KEY);
        if (token) {
            try {
                const result = await fanApi('/api/fans');
                fanCurrentUser = result.user;
            } catch (error) {
                localStorage.removeItem(FAN_TOKEN_KEY);
                fanCurrentUser = null;
            }
        } else {
            fanCurrentUser = null;
        }
        try {
            const config = await fanApi('/api/fans?config=1');
            fanGoogleClientId = config.googleClientId || '';
        } catch (error) {
            fanGoogleClientId = '';
        }
        renderFanAuth();
    }

    async function loadFanGoogleScript() {
        if (window.google?.accounts?.id) return;
        if (fanGoogleScriptPromise) return fanGoogleScriptPromise;
        fanGoogleScriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error('تعذر تحميل خدمة Google'));
            document.head.appendChild(script);
        });
        return fanGoogleScriptPromise;
    }

    async function renderFanGoogleButton() {
        const host = document.getElementById('fanGoogleButton');
        if (!host || !fanGoogleClientId) return;
        try {
            await loadFanGoogleScript();
            if (!window.google?.accounts?.id || !document.getElementById('fanGoogleButton')) return;
            window.google.accounts.id.initialize({
                client_id: fanGoogleClientId,
                callback: async response => {
                    try {
                        const result = await fanApi('/api/fans', {
                            method: 'POST',
                            body: JSON.stringify({ action: 'google', credential: response.credential })
                        });
                        localStorage.setItem(FAN_TOKEN_KEY, result.token);
                        fanCurrentUser = result.user;
                        renderFanAuth();
                    } catch (error) {
                        fanShowMessage(error.message || 'تعذر تسجيل الدخول عبر Google');
                    }
                }
            });
            host.innerHTML = '';
            window.google.accounts.id.renderButton(host, {
                type: 'standard', theme: 'outline', size: 'large', text: 'continue_with',
                shape: 'rectangular', logo_alignment: 'left', locale: 'ar', width: 300
            });
            fanGoogleButtonRendered = true;
        } catch (error) {
            const note = document.querySelector('.fan-google-note');
            if (note) note.textContent = 'تعذر تحميل تسجيل Google حالياً، استخدم رقم الجوال أو حاول لاحقاً.';
        }
    }

    if (fanAuthRoot) {
        fanAuthRoot.addEventListener('click', async event => {
            const modeButton = event.target.closest('[data-fan-mode]');
            if (modeButton) {
                fanAuthMode = modeButton.getAttribute('data-fan-mode');
                renderFanAuth();
                return;
            }
            if (event.target.closest('[data-fan-logout]')) {
                try { await fanApi('/api/fans', { method: 'DELETE' }); } catch (error) {}
                localStorage.removeItem(FAN_TOKEN_KEY);
                fanCurrentUser = null;
                fanAuthMode = 'login';
                renderFanAuth();
            }
        });
        fanAuthRoot.addEventListener('submit', async event => {
            const form = event.target.closest('[data-fan-form]');
            if (!form) return;
            event.preventDefault();
            const data = new FormData(form);
            const action = form.getAttribute('data-fan-form');
            const phone = String(data.get('phone') || '').trim();
            const password = String(data.get('password') || '');
            if (action === 'register') {
                const name = String(data.get('name') || '').trim();
                const confirmPassword = String(data.get('confirmPassword') || '');
                if (name.split(/\s+/).filter(Boolean).length !== 3) return fanShowMessage('اكتب اسمك الثلاثي كاملاً.');
                if (password.length < 8) return fanShowMessage('كلمة المرور يجب ألا تقل عن 8 أحرف.');
                if (password !== confirmPassword) return fanShowMessage('كلمتا المرور غير متطابقتين.');
            }
            const submit = form.querySelector('button[type="submit"]');
            if (submit) { submit.disabled = true; submit.classList.add('loading'); }
            try {
                const result = await fanApi('/api/fans', {
                    method: 'POST',
                    body: JSON.stringify(action === 'profile'
                        ? { action, name: String(data.get('name') || '').trim(), phone }
                        : action === 'register'
                            ? { action, name: String(data.get('name') || '').trim(), phone, password }
                            : { action, phone, password })
                });
                if (result.token) localStorage.setItem(FAN_TOKEN_KEY, result.token);
                fanCurrentUser = result.user;
                renderFanAuth();
            } catch (error) {
                fanShowMessage(error.message || 'تعذر إكمال العملية.');
                if (submit) { submit.disabled = false; submit.classList.remove('loading'); }
            }
        });
    }

    window.__fanApiReady = true;
    async function refreshPredictionsUI() {
        const leaderboardHost = document.getElementById('fanLeaderboardRows');
        if (!leaderboardHost) return;
        try {
            const board = await fanApi('/api/predictions');
            const rows = Array.isArray(board.leaderboard) ? board.leaderboard : [];
            leaderboardHost.innerHTML = rows.length ? rows.map((member,index) => `
                <div class="fan-leader-row"><span class="fan-leader-rank rank-${index+1}">${index+1}</span><strong>${fanEscape(member.full_name)}</strong><b>${Number(member.points||0).toLocaleString('en-US')} نقطة</b></div>`).join('') : '<p class="fan-leader-empty">لا توجد نقاط حتى الآن. كن أول من يتصدر!</p>';
            const cards = document.querySelectorAll('[data-prediction-match]');
            await Promise.all(Array.from(cards).map(async card => {
                const id = Number(card.getAttribute('data-prediction-match'));
                try {
                    const data = await fanApi('/api/predictions?match_id=' + id);
                    const selected = data.myPrediction?.choice || '';
                    card.querySelectorAll('[data-fan-predict]').forEach(button => {
                        button.classList.toggle('selected', button.getAttribute('data-fan-predict') === selected);
                    });
                    const status = card.querySelector('.fan-prediction-status');
                    if (status) status.textContent = selected ? 'توقعك الحالي: ' + ({win:'فوز شعب حضرموت',draw:'تعادل',loss:'خسارة شعب حضرموت'}[selected]) + ' — يمكنك تعديله قبل بداية المباراة.' : 'اختر توقعك قبل بداية المباراة';
                } catch (e) {}
            }));
        } catch (error) {
            leaderboardHost.innerHTML = '<p class="fan-leader-empty">تعذر تحميل لوحة الصدارة حالياً.</p>';
        }
    }

    document.addEventListener('click', async event => {
        const button = event.target.closest('[data-fan-predict]');
        if (!button) return;
        event.preventDefault();
        event.stopPropagation();
        const matchId = Number(button.getAttribute('data-match-id'));
        const choice = button.getAttribute('data-fan-predict');
        try {
            const session = await fanApi('/api/fans');
            if (!session.user?.phone) {
                fanCurrentUser = session.user;
                navigateToPage('fansPage');
                return;
            }
            button.disabled = true;
            const saved = await fanApi('/api/predictions', { method:'POST', body:JSON.stringify({match_id:matchId,choice}) });
            const card = button.closest('[data-prediction-match]');
            if (card) {
                card.querySelectorAll('[data-fan-predict]').forEach(item => item.classList.toggle('selected',item.getAttribute('data-fan-predict')===choice));
                const status = card.querySelector('.fan-prediction-status');
                if (status) status.textContent = saved.message || 'تم حفظ توقعك';
            }
            await refreshPredictionsUI();
        } catch (error) {
            alert(error.message || 'سجل الدخول أولاً للمشاركة في التوقعات');
            if (error.status === 401) navigateToPage('fansPage');
        } finally { button.disabled = false; }
    });

    const clubEscape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    async function clubGet(path) {
        const cacheKey = path.replace(/([?&])refresh=[^&]*/g, '$1').replace(/[?&]$/, '');
        try {
            const response = await fetch(CLUB_API_BASE + path + (path.includes('?') ? '&' : '?') + 'refresh=' + Date.now(), { cache: 'no-store' });
            const data = await response.json();
            if (!response.ok || data.success === false) throw new Error(data.message || 'تعذر تحميل بيانات النادي');
            saveClubSnapshot(cacheKey, data);
            return data;
        } catch (error) {
            const cached = readClubSnapshot(cacheKey);
            if (cached) return cached;
            throw error;
        }
    }
    function clubDate(value) {
        if (!value) return '';
        const raw = String(value);
        const date = new Date(raw.length === 10 ? raw + 'T12:00:00' : raw);
        return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString('ar', { year:'numeric', month:'long', day:'numeric' });
    }
    function refreshHomeNews() {
        const wrap = document.querySelector('.news-cards-container');
        if (!wrap) return;
        wrap.innerHTML = NEWS_ALL.length ? NEWS_ALL.slice(0, 4).map(n =>
            '<div class="news-card" data-news-id="' + n.id + '" onclick="openArticleModal(' + n.id + ')">' +
            '<div class="news-card-image"><img src="' + clubEscape(n.img) + '" alt="' + clubEscape(n.title) + '" loading="eager" fetchpriority="high" decoding="sync"></div>' +
            '<div class="news-card-content"><h4>' + clubEscape(n.title) + '</h4><div class="news-date"><span>' + clubEscape(n.date) + '</span> <i class="far fa-clock"></i></div></div></div>'
        ).join('') : '<div class="empty-state">لا توجد أخبار محفوظة على هذا الجهاز حتى الآن.</div>';
    }
    function applyClubNews(rows) {
        if (!Array.isArray(rows)) rows = [];
        NEWS_ALL = rows.map(item => ({
            id: Number(item.id), title: item.title || '', date: clubDate(item.created_at),
            cat: 'أخبار النادي', readTime: 'خبر من المركز الإعلامي',
            author: 'المركز الإعلامي لنادي شعب حضرموت',
            img: item.image_url || '',
            content: item.content || '', images: Array.isArray(item.images) ? item.images.map(image => typeof image === 'string' ? image : image?.url).filter(Boolean) : []
        }));
        renderAllNews();
        refreshHomeNews();
    }
    function applyClubPlayers(rows) {
        if (!Array.isArray(rows)) rows = [];
        const posMap = {'حراس المرمى':'gk','الدفاع':'def','الوسط':'mid','الهجوم':'att','المدرب':'staff'};
        const posNames = {'حراس المرمى':'حارس مرمى','الدفاع':'مدافع','الوسط':'لاعب وسط','الهجوم':'مهاجم','المدرب':'الجهاز الفني'};
        const players = [], staff = [];
        rows.forEach(item => {
            const p = posMap[item.position] || 'mid';
            if (p === 'staff') staff.push({name:item.name, role:'الجهاز الفني', img:item.image_url || ''});
            else players.push({
                id:Number(item.id), name:item.name || '', num:item.number || '—', pos:p,
                posName:posNames[item.position] || item.position || 'لاعب',
                nationality:item.nationality || 'يمني',
                age:Number(item.age) || '—', height:item.height || '—', weight:'—',
                matches:Number(item.matches) || 0, cleanSheets:Number(item.clean_sheets) || 0,
                saves:Number(item.saves) || 0, goals:Number(item.goals) || 0,
                assists:Number(item.assists) || 0, tackles:Number(item.tackles) || 0,
                readiness:Number.isFinite(Number(item.readiness)) ? Number(item.readiness) : 90,
                cheers:0, bio:item.bio || 'لاعب في صفوف نادي شعب حضرموت.',
                img:item.image_url || ''
            });
        });
        PLAYERS_DATA = players;
        STAFF_DATA = staff;
        renderPlayers('all');
        const activeTab = document.querySelector('[data-player-cat].active');
        if (activeTab && activeTab.getAttribute('data-player-cat') === 'staff') renderPlayers('staff');
    }
    function formatMatchTime(value) {
        const raw = String(value || '').trim();
        if (!raw) return '';
        const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
        if (!match) return raw;
        const hour24 = Number(match[1]);
        if (hour24 < 0 || hour24 > 23) return raw;
        const period = hour24 >= 12 ? 'م' : 'ص';
        const hour12 = hour24 % 12 || 12;
        return hour12 + ':' + match[2] + ' ' + period;
    }
    function applyClubMatches(rows) {
        if (!Array.isArray(rows)) return;
        const upcoming = [], results = [];
        rows.forEach(item => {
            const homeClub = Number(item.is_home) !== 0;
            const home = homeClub ? 'شعب حضرموت' : (item.opponent || 'المنافس');
            const away = homeClub ? (item.opponent || 'المنافس') : 'شعب حضرموت';
            const clubScore = item.home_score == null ? null : Number(item.home_score);
            const opponentScore = item.away_score == null ? null : Number(item.away_score);
            const score = clubScore == null || opponentScore == null ? '—' :
                (homeClub ? clubScore + ' - ' + opponentScore : opponentScore + ' - ' + clubScore);
            const common = {
                id:Number(item.id), round:item.competition || 'مباريات النادي',
                home, away, date:clubDate(item.match_date), time:formatMatchTime(item.match_time),
                stadium:item.venue || '', isHome:homeClub, managed:true,
                notes:item.notes || '', opponent:item.opponent || 'المنافس', opponentLogo:item.opponent_logo_url || '',
                homeLogo:item.home_logo_url || '', status:item.status || 'upcoming',
                formation:item.formation || '', lineup:(()=>{try{return JSON.parse(item.lineup_json || '[]').map(x=>typeof x==='object'?{id:Number(x.id),slot:x.slot||'cm'}:{id:Number(x),slot:'cm'})}catch{return []}})()
            };
            if (item.status === 'finished') results.push({...common, score, scorers:item.notes || ''});
            else if (item.status !== 'cancelled') upcoming.push(common);
        });
        MATCHES_UPCOMING = upcoming;
        MATCHES_RESULTS = results;
        const banner = document.getElementById('matchBannerCard');
        if (banner) {
            const match = upcoming[0] || results[0];
            if (match) {
                const finished = !upcoming.length;
                const safeText = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
                const safeUrl = value => {
                    const url = String(value || '').trim();
                    return /^(https?:\/\/|\/api\/media\/)/i.test(url) ? url : '';
                };
                const teamBlock = (name, logo, side) => {
                    const src = safeUrl(logo);
                    return `<div class="team team-${side}">
                        <div class="team-logo-container"><div class="team-logo-img">${src ? `<img src="${safeText(src)}" alt="${safeText(name)}" class="official-logo-img" loading="eager" fetchpriority="high" decoding="sync">` : '<i class="fas fa-shield-halved"></i>'}</div></div>
                        <span class="team-name">${safeText(name)}</span>
                    </div>`;
                };
                const clubName = 'شعب حضرموت';
                const opponentName = match.opponent || 'المنافس';
                const clubLogo = match.isHome ? match.homeLogo : match.opponentLogo;
                const opponentLogo = match.isHome ? match.opponentLogo : match.homeLogo;
                banner.querySelector('.match-header span').textContent = finished ? 'انتهى اللقاء' : 'المباراة القادمة';
                banner.querySelector('.match-header i').className = finished ? 'fas fa-flag-checkered' : 'fas fa-calendar-alt';
                banner.querySelector('.match-content').innerHTML = `
                    <div class="league-name">${safeText(match.round)}</div>
                    <div class="match-teams">
                        ${teamBlock(clubName, clubLogo, 'club')}
                        <div class="match-info-center">
                            <span class="${finished ? 'score-badge' : 'vs-text'}">${finished ? safeText(match.score || '—') : 'VS'}</span>
                            <div class="match-date"><i class="far fa-calendar-alt"></i><span>${safeText(match.date)}</span></div>
                            ${!finished && match.time ? `<div class="match-time"><i class="far fa-clock"></i><span>${safeText(match.time)}</span></div>` : ''}
                        </div>
                        ${teamBlock(opponentName, opponentLogo, 'opponent')}
                    </div>`;
            }
        }
        if (banner && !upcoming.length && !results.length) {
            const heading = banner.querySelector('.match-header span');
            const content = banner.querySelector('.match-content');
            if (heading) heading.textContent = 'لا توجد مباراة منشورة حالياً';
            if (content) content.innerHTML = '<div class="empty-state">ستظهر هنا أحدث بيانات المباريات عند نشرها من لوحة الإدارة.</div>';
        }
        renderMatches('upcoming');
        const tab = document.querySelector('[data-match-tab].active');
        renderMatches(tab ? tab.getAttribute('data-match-tab') : 'upcoming');
        if (window.__fanApiReady) refreshPredictionsUI();
    }
    function applyClubStandings(rows) {
        if (!Array.isArray(rows)) rows = [];
        STANDINGS_DATA = rows.map((item,index) => ({
            rank:index+1, team:item.team_name || '', logo:(item.logo_url||''), played:Number(item.played||0),
            won:Number(item.wins||0), draw:Number(item.draws||0), lost:Number(item.losses||0),
            diff:(Number(item.goals_for||0)-Number(item.goals_against||0)) > 0 ? '+'+(Number(item.goals_for||0)-Number(item.goals_against||0)) : String(Number(item.goals_for||0)-Number(item.goals_against||0)),
            points:Number(item.points||0), isShaab:(item.team_name||'').includes('شعب حضرموت')
        }));
        renderStandings();
        const empty=document.getElementById('tournamentEmpty');
        if(empty) empty.hidden=rows.length>0;
    }
    let selectedPublicTournament='';
    async function loadPublicTournamentStandings(tournamentId) {
        const body=document.getElementById('standingsBody');
        if(body) body.innerHTML='<tr><td colspan="8">جارٍ تحميل جدول البطولة...</td></tr>';
        try { const data=await clubGet('/api/standings?tournament_id='+encodeURIComponent(tournamentId)); applyClubStandings(data.standings||[]); }
        catch(error) { console.warn('Tournament standings unavailable',error); applyClubStandings([]); }
    }
    let publicTournamentLoadStarted = false;
    function closeTournamentPicker() {
        const button=document.getElementById('tournamentPickerButton');
        const menu=document.getElementById('tournamentPickerMenu');
        if(button)button.setAttribute('aria-expanded','false');
        if(menu)menu.hidden=true;
    }
    function renderTournamentPicker() {
        const select=document.getElementById('publicTournamentSelect');
        const button=document.getElementById('tournamentPickerButton');
        const value=document.getElementById('tournamentPickerValue');
        const menu=document.getElementById('tournamentPickerMenu');
        if(!select||!button||!value||!menu)return;
        const options=Array.from(select.options).filter(option=>option.value);
        const current=options.find(option=>String(option.value)===String(select.value));
        value.textContent=current?current.textContent:((select.options[0]?.textContent)||'اختر البطولة');
        button.disabled=!options.length;
        button.classList.toggle('is-disabled',!options.length);
        menu.innerHTML=options.map(option=>{
            const active=String(option.value)===String(select.value);
            return '<button type="button" class="tournament-option'+(active?' active':'')+'" role="option" aria-selected="'+active+'" data-tournament-id="'+clubEscape(option.value)+'"><span>'+clubEscape(option.textContent)+'</span><span class="tournament-option-check"><i class="fas fa-check"></i></span></button>';
        }).join('');
    }
    async function loadPublicTournaments() {
        publicTournamentLoadStarted = true;
        const select=document.getElementById('publicTournamentSelect');
        if(!select)return;
        try {
            const data=await clubGet('/api/tournaments'); const rows=data.tournaments||[];
            select.innerHTML=rows.map(t=>'<option value="'+clubEscape(t.id)+'">'+clubEscape(t.name)+(t.season_year?' — '+clubEscape(t.season_year):'')+'</option>').join('')||'<option value="">لا توجد بطولات</option>';
            const empty=document.getElementById('tournamentEmpty'); if(empty)empty.hidden=rows.length>0;
            if(!rows.length){renderTournamentPicker();applyClubStandings([]);return;}
            if(!rows.some(t=>String(t.id)===String(selectedPublicTournament)))selectedPublicTournament=String(rows[0].id);
            select.value=selectedPublicTournament;
            renderTournamentPicker();
            await loadPublicTournamentStandings(selectedPublicTournament);
        } catch(error) {
            console.warn('Tournaments unavailable',error);
            select.innerHTML='<option value="">تعذر تحميل البطولات</option>';
            renderTournamentPicker();
        }
    }
    function applyClubTransfers(rows) {
        if (!Array.isArray(rows)) rows = [];
        const mapped = {in:[],out:[],renew:[]};
        rows.forEach(item => {
            const direction = item.direction === 'outgoing' ? 'out' : 'in';
            mapped[direction].push({
                name:item.player_name || '', from:item.from_club || '',
                to:item.to_club || 'شعب حضرموت', role:item.details || '',
                date:clubDate(item.transfer_date), type:item.transfer_type === 'loan' ? 'إعارة' : 'انتقال نهائي',
                val:item.details || '', img:item.image_url || ''
            });
        });
        TRANSFERS_DATA = mapped;
        const tab = document.querySelector('[data-trans-tab].active');
        renderTransfers(tab ? tab.getAttribute('data-trans-tab') : 'in');
    }
    function applyClubGallery(rows) {
        if (!Array.isArray(rows)) rows = [];
        const photos = [], videos = [];
        rows.forEach(item => {
            const record = {
                id:Number(item.id), title:item.title || '', img:item.media_type === 'image' ? item.media_url : '',
                media_url:item.media_url || '', description:item.description || ''
            };
            (item.media_type === 'video' ? videos : photos).push(record);
        });
        MEDIA_DATA = {photos, videos};
        const tab = document.querySelector('[data-media-tab].active');
        renderMedia(tab ? tab.getAttribute('data-media-tab') : 'photos');
    }
    function applyClubAnthems(rows) {
        if (!Array.isArray(rows)) rows = [];
        ANTHEMS_DATA = rows.map(item => ({
            id:Number(item.id), title:item.title || '', artist:item.description || 'أناشيد نادي شعب حضرموت',
            description:item.description || '', audio_url:item.audio_url || '', duration:'—:—', progress:0
        }));
        currentAnthemIdx = 0;
        renderAnthems();
        const first = ANTHEMS_DATA[0];
        if (first) {
            document.getElementById('currentAnthemTitle').textContent = first.title;
            document.getElementById('currentAnthemArtist').textContent = first.artist;
            document.getElementById('totalTimeDisplay').textContent = first.duration;
        }
    }
    function applyClubCarousel(rows) {
        const wrapper = document.getElementById('sliderWrapper');
        if (!wrapper) return;
        const slides = (Array.isArray(rows) ? rows : []).filter(item => item.image_url).slice(0, 3);
        window.__clubCarouselItems = slides;
        wrapper.innerHTML = slides.map((item,index) =>
            '<div class="slide ' + (index === 0 ? 'active' : '') + '" data-cms-slide="' + clubEscape(item.id) + '" role="button" tabindex="0" aria-label="فتح خبر: ' + clubEscape(item.title || 'أخبار النادي') + '">' +
            '<img class="slide-image" src="' + clubEscape(item.image_url) + '" alt="' + clubEscape(item.title || 'أخبار النادي') + '" loading="eager" fetchpriority="' + (index === 0 ? 'high' : 'auto') + '" decoding="sync">' +
            '<div class="slide-overlay"><span class="slide-category">أخبار النادي</span><h3>' + clubEscape(item.title || '') + '</h3></div></div>'
        ).join('');
        const dots = document.getElementById('sliderDots');
        if (dots) dots.innerHTML = slides.map((item,index) => '<button type="button" class="dot ' + (index === 0 ? 'active' : '') + '" data-slide-index="' + index + '" aria-label="الانتقال إلى الخبر ' + (index + 1) + '"></button>').join('');
        currentSlide = 0;
        const section = wrapper.closest('.slider-section');
        if (section) section.hidden = !slides.length;
        stopAutoSlide();
        startAutoSlide();
    }
    window.openCarouselArticle = function(item) {
        if (!item) return;
        const body = document.getElementById('articleModalBody');
        const overlay = document.getElementById('articleModalOverlay');
        const sheet = document.getElementById('articleModalSheet');
        if (!body || !overlay || !sheet) return;
        const safeTitle = clubEscape(item.title || 'أخبار النادي');
        body.innerHTML = '<div style="border-radius:16px;overflow:hidden;margin-bottom:14px;max-height:240px"><img src="' + clubEscape(item.image_url || '') + '" alt="' + safeTitle + '" style="width:100%;height:100%;object-fit:cover"></div>' +
            '<h3 style="font-size:17px;font-weight:800;line-height:1.6;margin-bottom:12px">' + safeTitle + '</h3>' +
            '<div style="font-size:13px;line-height:1.9;color:var(--text-gray);white-space:pre-line">' + clubEscape(item.content || 'لا توجد تفاصيل إضافية لهذا الخبر.') + '</div>';
        if (!overlay.classList.contains('active')) history.pushState({ ...(history.state || {}), appPage: currentAppPage, newsArticle: true }, '', location.href);
        window.__activeNewsArticle = { title:item.title || '', content:item.content || '', img:item.image_url || '', images:[] };
        // Reset the carousel article scroll position every time it is opened.
        body.scrollTop = 0;
        sheet.scrollTop = 0;
        overlay.classList.add('active');
        sheet.classList.add('open');
        requestAnimationFrame(() => {
            body.scrollTop = 0;
            sheet.scrollTop = 0;
        });
    };
    async function loadClubHistory(data = null) {
        try {
            data = data || await clubGet('/api/history');
            if (!data.history) return;
            const page = document.getElementById('aboutPage');
            if (!page) return;
            const banner = page.querySelector('.foundation-badge');
            if (banner) banner.innerHTML = '<i class="fas fa-history"></i> تأسس عام ' + clubEscape(data.history.founded_year || '1964') + ' م (المكلا)';
            let target = document.getElementById('clubHistoryLiveContent');
            if (!target) {
                target = document.createElement('div');
                target.id = 'clubHistoryLiveContent';
                target.className = 'about-card';
                page.querySelector('.page-scroll-content')?.appendChild(target);
            }
            target.innerHTML = '<h4><i class="fas fa-book-open text-red"></i> ' + clubEscape(data.history.title || 'تاريخ النادي') + '</h4>' +
                (data.history.content ? '<p class="about-text">' + clubEscape(data.history.content).replace(/\n/g,'<br>') + '</p>' : '') +
                (data.history.achievements ? '<h4><i class="fas fa-trophy text-red"></i> الإنجازات</h4><p class="about-text">' + clubEscape(data.history.achievements).replace(/\n/g,'<br>') + '</p>' : '');
        } catch (error) { console.warn('Club history unavailable', error); }
    }
    async function loadClubStore() {
        const sheet = document.getElementById('storeModalSheet');
        if (!sheet) return;
        let target = document.getElementById('clubStoreLiveContent');
        if (!target) {
            target = document.createElement('div');
            target.id = 'clubStoreLiveContent';
            target.className = 'about-card';
            sheet.appendChild(target);
        }
        target.innerHTML = '<p class="about-text">جارٍ تحميل منتجات المتجر...</p>';
        try {
            const data = await clubGet('/api/sections?section=store');
            const rows = data.items || [];
            target.innerHTML = '<h4><i class="fas fa-store text-red"></i> منتجات المتجر الرسمي</h4>' +
                (rows.length ? rows.map(item => '<article class="managed-content-card">' +
                    (item.image_url ? '<img src="' + clubEscape(item.image_url) + '" alt="' + clubEscape(item.title) + '">' : '') +
                    (item.media_url ? (/\.(mp4|webm|mov)(\?|$)/i.test(item.media_url) ? '<video controls playsinline src="' + clubEscape(item.media_url) + '"></video>' : '') : '') +
                    '<div class="managed-content-body"><h3>' + clubEscape(item.title) + '</h3>' +
                    (item.content ? '<p>' + clubEscape(item.content) + '</p>' : '') +
                    (item.price ? '<span class="managed-content-price">' + clubEscape(item.price) + '</span>' : '') + '</div></article>').join('') :
                    '<p class="about-text">لا توجد منتجات منشورة حالياً.</p>');
        } catch (error) {
            target.innerHTML = '<p class="about-text">تعذر تحميل منتجات المتجر حالياً.</p>';
        }
    }
    async function loadClubNotifications(data = null) {
        try {
            data = data || await clubGet('/api/notifications');
            const rows = data.notifications || [];
            const list = document.getElementById('notifList');
            const badge = document.getElementById('notifBadge');
            if (!list) return;
            if (!rows.length) { list.innerHTML = '<div class="empty-state">لا توجد إشعارات محفوظة.</div>'; if (badge) badge.style.display = 'none'; return; }
            list.innerHTML = rows.map(item => '<div class="notif-item unread"><div class="notif-icon news-notif"><i class="fas fa-bullhorn"></i></div>' +
                '<div class="notif-body"><p class="notif-text"><strong>' + clubEscape(item.title || 'تنبيه النادي') + '</strong> ' + clubEscape(item.body || '') + '</p>' +
                '<span class="notif-time"><i class="far fa-clock"></i> ' + clubEscape(clubDate(item.created_at)) + '</span></div><span class="unread-dot"></span></div>').join('');
            if (badge) { badge.textContent = String(rows.length); badge.style.display = rows.length ? 'flex' : 'none'; }
        } catch (error) { console.warn('Club notifications unavailable', error); }
    }
    document.addEventListener('click', event => {
        const button=event.target.closest('#tournamentPickerButton');
        const option=event.target.closest('.tournament-option');
        if(button){
            const menu=document.getElementById('tournamentPickerMenu');
            const opening=button.getAttribute('aria-expanded')!=='true';
            if(menu)menu.hidden=!opening;
            button.setAttribute('aria-expanded',String(opening));
            return;
        }
        if(option){
            const select=document.getElementById('publicTournamentSelect');
            if(select){
                selectedPublicTournament=option.getAttribute('data-tournament-id')||'';
                select.value=selectedPublicTournament;
                renderTournamentPicker();
                closeTournamentPicker();
                loadPublicTournamentStandings(selectedPublicTournament);
            }
            return;
        }
        if(!event.target.closest('.tournament-select-wrap'))closeTournamentPicker();
    });
    document.addEventListener('keydown', event => {
        if(event.key==='Escape')closeTournamentPicker();
    });
    document.addEventListener('change', event => { if(event.target?.id==='publicTournamentSelect'){selectedPublicTournament=event.target.value;renderTournamentPicker();loadPublicTournamentStandings(selectedPublicTournament);} });
    async function loadAllClubContent() {
        const jobs = [
            ['/api/news', d => applyClubNews(d.news)],
            ['/api/players', d => applyClubPlayers(d.players)],
            ['/api/matches', d => applyClubMatches(d.matches)],
            ['/api/transfers', d => applyClubTransfers(d.transfers)],
            ['/api/gallery', d => applyClubGallery(d.media)],
            ['/api/anthems', d => applyClubAnthems(d.anthems)],
            ['/api/carousel', d => applyClubCarousel(d.slides)],
            ['/api/history', d => loadClubHistory(d)],
            ['/api/notifications', d => loadClubNotifications(d)]
        ];
        // Display the last saved real CMS content first, then refresh it online.
        await Promise.allSettled(jobs.map(async job => {
            const cached = readClubSnapshot(job[0]);
            if (cached) { try { job[1](cached); } catch(error) { console.warn('Cached content render failed:', job[0], error); } }
        }));
        const refreshGroup = async group => Promise.allSettled(group.map(async job => {
            try {
                const data = await clubGet(job[0]);
                saveClubSnapshot(job[0], data);
                job[1](data);
            } catch (error) {
                console.warn('CMS section unavailable; keeping saved content: ' + job[0], error);
            }
        }));
        // Prepare every shared CMS feed together during the opening screen.
        await refreshGroup(jobs);
    }
    // Native-style pull down refresh: reload current CMS data without leaving the screen.
    function setupPullToRefresh() {
        let startY = 0, currentDistance = 0, activePage = null, pulling = false, refreshing = false;
        const threshold = 88;
        const indicator = document.createElement('div');
        indicator.id = 'pullRefreshIndicator';
        indicator.innerHTML = '<i class="fas fa-arrow-down"></i><span>اسحب للأسفل للتحديث</span>';
        document.body.appendChild(indicator);

        const setState = (state, label, icon) => {
            indicator.className = state;
            indicator.innerHTML = '<i class="fas ' + icon + '"></i><span>' + label + '</span>';
        };
        const hideIndicator = () => {
            indicator.style.transform = 'translate(-50%, -130%)';
            setState('', 'اسحب للأسفل للتحديث', 'fa-arrow-down');
        };
        const getActivePage = () => document.querySelector('.app-page.active');

        document.addEventListener('touchstart', event => {
            if (refreshing || event.touches.length !== 1) return;
            // Never treat gestures inside a reader/modal as app-level pull-to-refresh.
            if (event.target.closest('.app-modal-sheet, .modal-overlay, .modal, .overlay, .drawer') || document.querySelector('.app-modal-sheet.open, .modal-overlay.active')) return;
            const page = getActivePage();
            if (!page || page.scrollTop > 2) return;
            if (event.target.closest('input, textarea, select, button, a, .modal, .overlay, .drawer')) return;
            activePage = page;
            startY = event.touches[0].clientY;
            currentDistance = 0;
            pulling = true;
            hideIndicator();
        }, {passive:true});

        document.addEventListener('touchmove', event => {
            if (!pulling || refreshing || !event.touches.length) return;
            if (getActivePage() !== activePage) { pulling = false; hideIndicator(); return; }
            currentDistance = Math.max(0, event.touches[0].clientY - startY);
            if (currentDistance <= 0) { hideIndicator(); return; }
            const progress = Math.min(currentDistance, threshold);
            const offset = Math.max(-8, -58 + progress * 0.62);
            indicator.style.transform = 'translate(-50%, ' + offset + 'px)';
            if (currentDistance >= threshold) setState('ready', 'اترك لتحديث التطبيق', 'fa-arrow-down');
            else setState('pulling', 'اسحب للأسفل للتحديث', 'fa-arrow-down');
        }, {passive:true});

        const finishPull = async () => {
            if (!pulling || refreshing) return;
            const shouldRefresh = currentDistance >= threshold && activePage === getActivePage();
            pulling = false;
            if (!shouldRefresh) { hideIndicator(); activePage = null; return; }

            refreshing = true;
            indicator.style.transform = 'translate(-50%, 10px)';
            setState('refreshing', 'جارٍ تحديث بيانات النادي...', 'fa-spinner fa-spin');
            try {
                await Promise.allSettled([loadAllClubContent(), loadClubReels()]);
                setState('done', 'تم تحديث البيانات', 'fa-check');
            } finally {
                refreshing = false;
                activePage = null;
                setTimeout(hideIndicator, 900);
            }
        };

        document.addEventListener('touchend', finishPull, {passive:true});
        document.addEventListener('touchcancel', () => {
            pulling = false;
            currentDistance = 0;
            activePage = null;
            if (!refreshing) hideIndicator();
        }, {passive:true});
    }
    setupPullToRefresh();
    // Fetch all section data first, then warm their images while the logo intro is visible.
    const startupTasks = [
        loadAllClubContent(),
        loadPublicTournaments(),
        loadClubStore(),
        loadClubReels(),
        ...Object.keys(MANAGED_SECTION_PAGES).map(key => loadManagedSection(key))
    ];
    Promise.allSettled(startupTasks).then(() => {
        // Do not delay entry to the app; image warming continues in the background.
        preloadAppImages();
    });

});
