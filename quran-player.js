// متغيرات التحكم بالصوت والوضعيات
let isAudioPlaying = false;
let deviceMode = localStorage.getItem('deviceMode') || 'phone';

// إنشاء عنصر الصوت
function createAudioPlayer() {
    const audioHTML = `
        <div id="quranPlayer" style="position: fixed; bottom: 20px; right: 20px; z-index: 999; background: white; padding: 15px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.3); min-width: 250px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <button id="playPauseBtn" onclick="toggleAudio()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;">
                    ▶️
                </button>
                <div style="flex: 1;">
                    <p style="margin: 0; color: #667eea; font-weight: bold; font-size: 14px;">🎵 سورة الكهف</p>
                    <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">بصوت مشاري العفاسي</p>
                </div>
                <button onclick="closeAudioPlayer()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999;">✕</button>
            </div>
            
            <!-- شريط التحكم بالصوت -->
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 12px; color: #999;">🔊</span>
                <input type="range" id="volumeControl" min="0" max="100" value="70" style="flex: 1; cursor: pointer;" onchange="setVolume(this.value)">
                <span id="volumeLabel" style="font-size: 12px; color: #999; min-width: 30px;">70%</span>
            </div>
            
            <!-- وقت التشغيل -->
            <div style="margin-top: 10px; text-align: center;">
                <p style="margin: 0; color: #999; font-size: 12px;">
                    <span id="currentTime">0:00</span> / <span id="duration">0:00</span>
                </p>
            </div>
            
            <!-- شريط التقدم -->
            <div style="margin-top: 10px;">
                <input type="range" id="progressBar" min="0" max="100" value="0" style="width: 100%; cursor: pointer;" onchange="seekAudio(this.value)">
            </div>
        </div>
        
        <audio id="quranAudio" style="display: none;">
            <source src="https://archive.org/download/Quran_Mishari_Al-Afasy/018-Al-kahf.mp3" type="audio/mpeg">
        </audio>
    `;
    
    document.body.insertAdjacentHTML('beforeend', audioHTML);
    
    // ربط أحداث الصوت
    const audio = document.getElementById('quranAudio');
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', audioEnded);
}

// تشغيل/إيقاف الصوت
function toggleAudio() {
    const audio = document.getElementById('quranAudio');
    const btn = document.getElementById('playPauseBtn');
    
    if (isAudioPlaying) {
        audio.pause();
        btn.textContent = '▶️';
        isAudioPlaying = false;
    } else {
        audio.play();
        btn.textContent = '⏸️';
        isAudioPlaying = true;
    }
}

// تعيين مستوى الصوت
function setVolume(value) {
    const audio = document.getElementById('quranAudio');
    audio.volume = value / 100;
    document.getElementById('volumeLabel').textContent = value + '%';
}

// البحث في الصوت
function seekAudio(value) {
    const audio = document.getElementById('quranAudio');
    audio.currentTime = (value / 100) * audio.duration;
}

// تحديث شريط التقدم
function updateProgress() {
    const audio = document.getElementById('quranAudio');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    
    if (audio.duration) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}

// تحديث المدة الكلية
function updateDuration() {
    const audio = document.getElementById('quranAudio');
    document.getElementById('duration').textContent = formatTime(audio.duration);
}

// تنسيق الوقت
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// عند انتهاء الصوت
function audioEnded() {
    const btn = document.getElementById('playPauseBtn');
    btn.textContent = '▶️';
    isAudioPlaying = false;
}

// إغلاق مشغل الصوت
function closeAudioPlayer() {
    const player = document.getElementById('quranPlayer');
    player.style.display = 'none';
}

// إنشاء زر تبديل الوضعيات
function createModeToggleButton() {
    const toggleHTML = `
        <button id="modeToggleBtn" onclick="toggleDeviceMode()" style="position: fixed; left: 20px; bottom: 20px; z-index: 998; background: #333; color: white; border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 15px rgba(0,0,0,0.3); transition: all 0.3s; font-weight: bold;">
            ${deviceMode === 'phone' ? '📱' : '📱'}
        </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toggleHTML);
}

// تبديل الوضعيات
function toggleDeviceMode() {
    deviceMode = deviceMode === 'phone' ? 'tablet' : 'phone';
    localStorage.setItem('deviceMode', deviceMode);
    
    const btn = document.getElementById('modeToggleBtn');
    btn.style.background = deviceMode === 'tablet' ? '#667eea' : '#333';
    
    applyDeviceMode();
}

// تطبيق وضعية الجهاز
function applyDeviceMode() {
    if (deviceMode === 'tablet') {
        // وضع الآيباد
        document.documentElement.style.fontSize = '18px';
        
        // تكبير الحاويات
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.style.maxWidth = '1400px';
            container.style.padding = '0 40px';
        });
        
        // تكبير الأقسام
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const currentPadding = window.getComputedStyle(section).padding;
            section.style.padding = '100px 0';
        });
        
        // تكبير النصوص
        const headings = document.querySelectorAll('h1, h2, h3, h4');
        headings.forEach(heading => {
            const currentSize = parseFloat(window.getComputedStyle(heading).fontSize);
            heading.style.fontSize = (currentSize * 1.3) + 'px';
        });
        
        // تكبير الأزرار
        const buttons = document.querySelectorAll('button:not(#playPauseBtn):not(#modeToggleBtn)');
        buttons.forEach(button => {
            button.style.padding = '15px 30px';
            button.style.fontSize = '16px';
        });
        
        // تكبير الصور
        const images = document.querySelectorAll('img:not([src*="badge"])');
        images.forEach(img => {
            if (img.style.height) {
                const currentHeight = parseFloat(img.style.height);
                img.style.height = (currentHeight * 1.3) + 'px';
            }
        });
        
        alert('📱 تم التبديل إلى وضع الآيباد (شاشة كبيرة)');
    } else {
        // إعادة تعيين إلى وضع الهاتف
        location.reload();
    }
}

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    createAudioPlayer();
    createModeToggleButton();
    applyDeviceMode();
});
