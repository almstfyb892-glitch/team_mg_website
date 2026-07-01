// متغيرات عامة
let selectedRating = null;
let selectedVisibility = 'public';
let editingId = null;
let isAdminMode = false;
let allFeedback = [];
let userName = localStorage.getItem('userName') || '';

// كلمات محظورة
const bannedWords = ['سب', 'قذف', 'شتم', 'http://', 'https://', 'www.'];

function containsBannedWords(text) {
    return bannedWords.some(word => text.toLowerCase().includes(word.toLowerCase()));
}

function requestUserName() {
    if (!userName) {
        userName = prompt('👤 أدخل اسم حسابك:') || 'زائر';
        localStorage.setItem('userName', userName);
    }
}

function loadFeedback() {
    const saved = localStorage.getItem('allFeedback');
    allFeedback = saved ? JSON.parse(saved) : [];
}

function saveFeedback() {
    localStorage.setItem('allFeedback', JSON.stringify(allFeedback));
}

function displayFeedback() {
    const container = document.getElementById('feedbackList');
    if (!container) return;
    
    container.innerHTML = '';
    
    const visible = allFeedback.filter(f => 
        f.visibility === 'public' || f.userName === userName
    );
    
    if (visible.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; width: 100%;">لا توجد ملاحظات</p>';
        return;
    }
    
    visible.forEach(f => {
        const div = document.createElement('div');
        div.style.cssText = `
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            padding: 15px;
            min-width: 250px;
            flex-shrink: 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;
        
        const isOwner = f.userName === userName;
        
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div>
                    <p style="margin: 0; font-weight: bold;">👤 ${f.userName}</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">${f.timestamp}</p>
                    ${f.visibility === 'private' ? '<p style="margin: 5px 0 0 0; font-size: 12px; color: #f44336;">🔒 خاص</p>' : ''}
                </div>
                <div style="display: flex; gap: 5px;">
                    ${isOwner ? `
                        <button onclick="editFeedback(${f.id})" style="background: #667eea; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">✏️</button>
                        <button onclick="deleteFeedback(${f.id})" style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">🗑️</button>
                    ` : ''}
                    ${isAdminMode && !isOwner ? `
                        <button onclick="deleteFeedback(${f.id})" style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">🗑️</button>
                    ` : ''}
                </div>
            </div>
            <p style="margin: 10px 0; color: #333;">${f.text}</p>
            <div style="display: flex; gap: 5px;">
                ${Array(5).fill(0).map((_, i) => `<span style="font-size: 20px; opacity: ${i < f.rating ? '1' : '0.3'};">⭐</span>`).join('')}
            </div>
        `;
        
        container.appendChild(div);
    });
}

function editFeedback(id) {
    const f = allFeedback.find(x => x.id === id);
    if (!f) return;
    
    editingId = id;
    document.getElementById('feedbackText').value = f.text;
    selectedRating = f.rating;
    selectedVisibility = f.visibility;
    
    updateRatingDisplay();
    updateVisibilityDisplay();
}

function deleteFeedback(id) {
    if (confirm('حذف هذه الملاحظة؟')) {
        allFeedback = allFeedback.filter(x => x.id !== id);
        saveFeedback();
        displayFeedback();
    }
}

function updateRatingDisplay() {
    document.querySelectorAll('.badge-btn').forEach(btn => {
        const rating = parseInt(btn.getAttribute('data-rating'));
        if (rating === selectedRating) {
            btn.style.borderColor = '#667eea';
            btn.style.borderWidth = '3px';
        } else {
            btn.style.borderColor = '#ddd';
            btn.style.borderWidth = '1px';
        }
    });
}

function updateVisibilityDisplay() {
    document.querySelectorAll('.visibility-btn').forEach(btn => {
        if (btn.getAttribute('data-visibility') === selectedVisibility) {
            btn.style.borderColor = '#667eea';
            btn.style.borderWidth = '3px';
            btn.style.backgroundColor = '#f0f4ff';
        } else {
            btn.style.borderColor = '#ddd';
            btn.style.borderWidth = '1px';
            btn.style.backgroundColor = 'white';
        }
    });
}

function checkAdminPassword() {
    const pwd = prompt('🔐 كلمة السر:');
    if (pwd === 'TeamMG@2024#SecureAdmin$789') {
        isAdminMode = true;
        alert('✅ وضع الأدمن مفعل');
        displayFeedback();
    } else {
        alert('❌ كلمة السر خاطئة');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    requestUserName();
    loadFeedback();
    displayFeedback();
    
    // أزرار التقييم
    document.querySelectorAll('.badge-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            updateRatingDisplay();
        });
    });
    
    // أزرار الرؤية
    document.querySelectorAll('.visibility-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedVisibility = this.getAttribute('data-visibility');
            updateVisibilityDisplay();
        });
    });
    
    // زر الإرسال
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const text = document.getElementById('feedbackText').value.trim();
            
            if (!text) {
                alert('اكتب ملاحظة');
                return;
            }
            
            if (selectedRating === null) {
                alert('اختر تقييم');
                return;
            }
            
            if (containsBannedWords(text)) {
                alert('⚠️ كلمات محظورة');
                return;
            }
            
            if (editingId !== null) {
                const idx = allFeedback.findIndex(x => x.id === editingId);
                if (idx !== -1) {
                    allFeedback[idx].text = text;
                    allFeedback[idx].rating = selectedRating;
                    allFeedback[idx].visibility = selectedVisibility;
                }
                editingId = null;
            } else {
                allFeedback.push({
                    id: Date.now(),
                    text: text,
                    rating: selectedRating,
                    visibility: selectedVisibility,
                    userName: userName,
                    timestamp: new Date().toLocaleString('ar-SA')
                });
            }
            
            saveFeedback();
            displayFeedback();
            
            document.getElementById('feedbackText').value = '';
            selectedRating = null;
            selectedVisibility = 'public';
            updateRatingDisplay();
            updateVisibilityDisplay();
        });
    }
    
    // زر الأدمن
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', function() {
            if (!isAdminMode) {
                checkAdminPassword();
            } else {
                isAdminMode = false;
                alert('❌ وضع الأدمن معطل');
                displayFeedback();
            }
        });
    }
});
