// متغيرات التحكم
let selectedRating = null;
let selectedVisibility = 'public';
let editingId = null;
let isAdminMode = false;
let allFeedback = [];
let userName = localStorage.getItem('userName') || '';

// قائمة الكلمات المحظورة
const bannedWords = [
    'سب', 'قذف', 'شتم', 'لعن', 'كلمة سيئة',
    'http://', 'https://', 'www.', '.com', '.net', '.org',
    'رابط', 'موقع', 'لينك'
];

// دالة للتحقق من الكلمات المحظورة
function containsBannedWords(text) {
    const lowerText = text.toLowerCase();
    return bannedWords.some(word => lowerText.includes(word.toLowerCase()));
}

// تحديث عرض الشعار المختار
function updateBadgeDisplay() {
    const selectedBadgeDiv = document.getElementById('selectedBadge');
    
    if (selectedRating === null) {
        selectedBadgeDiv.innerHTML = '<p style="color: #999; font-size: 14px;">اختر شعار التقييم</p>';
        return;
    }
    
    const badgeNames = ['terrible', 'poor', 'neutral', 'good', 'excellent'];
    selectedBadgeDiv.innerHTML = `
        <img src="badge-${selectedRating}-${badgeNames[selectedRating-1]}.png" style="width: 100px; height: 100px; object-fit: contain;">
    `;
}

// تحديث عرض الرؤية (عام/خاص)
function updateVisibilityDisplay() {
    const visibilityBtns = document.querySelectorAll('.visibility-btn');
    visibilityBtns.forEach(btn => {
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

// طلب اسم الحساب
function requestUserName() {
    if (!userName) {
        userName = prompt('👤 أدخل اسم حسابك:');
        if (!userName || userName.trim() === '') {
            userName = 'زائر';
        }
        localStorage.setItem('userName', userName);
    }
}

// إضافة ملاحظة محلية
function addFeedbackLocally(text, rating, visibility) {
    const feedback = {
        id: Date.now(),
        text: text,
        rating: rating,
        visibility: visibility,
        userName: userName,
        timestamp: new Date().toLocaleString('ar-SA')
    };
    
    allFeedback.push(feedback);
    localStorage.setItem('allFeedback', JSON.stringify(allFeedback));
    updateFeedbackDisplay();
}

// تحديث ملاحظة محلية
function updateFeedbackLocally(id, text, rating, visibility) {
    const index = allFeedback.findIndex(f => f.id === id);
    if (index !== -1) {
        allFeedback[index].text = text;
        allFeedback[index].rating = rating;
        allFeedback[index].visibility = visibility;
        localStorage.setItem('allFeedback', JSON.stringify(allFeedback));
        updateFeedbackDisplay();
    }
}

// حذف ملاحظة محلية
function deleteFeedbackLocally(id) {
    allFeedback = allFeedback.filter(f => f.id !== id);
    localStorage.setItem('allFeedback', JSON.stringify(allFeedback));
    updateFeedbackDisplay();
}

// تحميل الملاحظات المحلية
function loadFeedbackLocally() {
    const saved = localStorage.getItem('allFeedback');
    if (saved) {
        allFeedback = JSON.parse(saved);
    }
}

// عرض الملاحظات
function updateFeedbackDisplay() {
    const container = document.getElementById('feedbackList');
    if (!container) return;
    
    container.innerHTML = '';
    
    // تصفية الملاحظات
    const visibleFeedback = allFeedback.filter(f => {
        if (f.visibility === 'private') {
            return f.userName === userName;
        }
        return true;
    });
    
    if (visibleFeedback.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">لا توجد ملاحظات حتى الآن</p>';
        return;
    }
    
    visibleFeedback.forEach(feedback => {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.style.cssText = `
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            min-width: 250px;
            flex-shrink: 0;
        `;
        
        const isOwner = feedback.userName === userName;
        const isAdmin = isAdminMode;
        
        feedbackDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <div>
                    <p style="margin: 0; font-weight: bold; color: #333;">👤 ${feedback.userName}</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">${feedback.timestamp}</p>
                    ${feedback.visibility === 'private' ? '<p style="margin: 5px 0 0 0; font-size: 12px; color: #f44336;">🔒 خاص</p>' : ''}
                </div>
                <div style="display: flex; gap: 5px;">
                    ${isOwner ? `
                        <button onclick="editFeedback(${feedback.id})" style="
                            background: #667eea;
                            color: white;
                            border: none;
                            padding: 8px 12px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                        ">✏️ تعديل</button>
                        <button onclick="deleteFeedback(${feedback.id})" style="
                            background: #f44336;
                            color: white;
                            border: none;
                            padding: 8px 12px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                        ">🗑️ حذف</button>
                    ` : ''}
                    ${isAdmin && !isOwner ? `
                        <button onclick="deleteFeedback(${feedback.id})" style="
                            background: #f44336;
                            color: white;
                            border: none;
                            padding: 8px 12px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                        ">🗑️ حذف</button>
                    ` : ''}
                </div>
            </div>
            
            <p style="margin: 10px 0; color: #333; line-height: 1.6;">${feedback.text}</p>
            
            <div style="display: flex; gap: 8px; margin-top: 10px;">
                ${Array(5).fill(0).map((_, i) => `
                    <img src="badge-${i+1}-${['terrible', 'poor', 'neutral', 'good', 'excellent'][i]}.png" 
                         style="width: 30px; height: 30px; opacity: ${i < feedback.rating ? '1' : '0.3'};">
                `).join('')}
            </div>
        `;
        
        container.appendChild(feedbackDiv);
    });
}

// تعديل ملاحظة
function editFeedback(id) {
    const feedback = allFeedback.find(f => f.id === id);
    if (!feedback) return;
    
    editingId = id;
    document.getElementById('feedbackText').value = feedback.text;
    selectedRating = feedback.rating;
    selectedVisibility = feedback.visibility;
    
    // تحديث الواجهة
    updateBadgeDisplay();
    updateVisibilityDisplay();
    
    // تحديث أزرار الشعارات
    document.querySelectorAll('.badge-btn').forEach(btn => {
        if (parseInt(btn.getAttribute('data-rating')) === selectedRating) {
            btn.style.borderColor = '#667eea';
            btn.style.borderWidth = '3px';
        } else {
            btn.style.borderColor = '#ddd';
        }
    });
    
    // التركيز على حقل الإدخال
    document.getElementById('feedbackText').focus();
}

// حذف ملاحظة
function deleteFeedback(id) {
    if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
        deleteFeedbackLocally(id);
    }
}

// فتح قائمة الأدمن
function checkAdminPassword() {
    const password = prompt('🔐 أدخل كلمة السر للأدمن:');
    if (password === 'TeamMG@2024#SecureAdmin$789') {
        isAdminMode = true;
        alert('✅ تم تفعيل وضع الأدمن!');
        updateFeedbackDisplay();
    } else {
        alert('❌ كلمة السر غير صحيحة!');
    }
}

// معالجة الأحداث
document.addEventListener('DOMContentLoaded', function() {
    requestUserName();
    loadFeedbackLocally();
    updateFeedbackDisplay();
    
    const badgeBtns = document.querySelectorAll('.badge-btn');
    badgeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            selectedRating = parseInt(this.getAttribute('data-rating'));
            
            badgeBtns.forEach(b => b.style.borderColor = '#ddd');
            this.style.borderColor = '#667eea';
            this.style.borderWidth = '3px';
            
            updateBadgeDisplay();
        });
    });
    
    // معالجة أزرار الرؤية (عام/خاص)
    const visibilityBtns = document.querySelectorAll('.visibility-btn');
    visibilityBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            selectedVisibility = this.getAttribute('data-visibility');
            updateVisibilityDisplay();
        });
    });
    
    // معالجة إرسال الملاحظة
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const text = document.getElementById('feedbackText').value.trim();
            
            if (!text) {
                alert('الرجاء كتابة ملاحظة');
                return;
            }
            
            if (selectedRating === null) {
                alert('الرجاء اختيار شعار التقييم');
                return;
            }
            
            if (containsBannedWords(text)) {
                alert('⚠️ تحتوي الملاحظة على كلمات محظورة أو روابط غير مسموحة!\nالرجاء تعديل الملاحظة.');
                return;
            }
            
            if (editingId !== null) {
                updateFeedbackLocally(editingId, text, selectedRating, selectedVisibility);
                editingId = null;
            } else {
                addFeedbackLocally(text, selectedRating, selectedVisibility);
            }
            
            // مسح النموذج
            document.getElementById('feedbackText').value = '';
            selectedRating = null;
            selectedVisibility = 'public';
            document.getElementById('selectedBadge').innerHTML = '<p style="color: #999; font-size: 14px;">اختر شعار التقييم</p>';
            badgeBtns.forEach(b => b.style.borderColor = '#ddd');
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
                alert('❌ تم إيقاف وضع الأدمن!');
                updateFeedbackDisplay();
            }
        });
    }
});
