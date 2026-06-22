// تخزين الملاحظات
let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
let selectedRating = null;
let selectedVisibility = 'public';
let isAdminMode = false;
let editingIndex = null;

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

// دالة للحصول على اسم الحساب
function getUserName() {
    let userName = localStorage.getItem('userName');
    if (!userName) {
        userName = prompt('الرجاء إدخال اسم حسابك:');
        if (userName && userName.trim()) {
            localStorage.setItem('userName', userName.trim());
        } else {
            userName = 'مستخدم مجهول';
        }
    }
    return userName;
}

// دالة تحقق الأدمن
function checkAdminPassword() {
    const password = prompt('أدخل كلمة السر للأدمن:');
    if (password === 'TeamMG@2024#SecureAdmin$789') {
        isAdminMode = true;
        alert('✅ تم تفعيل وضع الأدمن!');
        return true;
    } else {
        alert('❌ كلمة السر خاطئة!');
        isAdminMode = false;
        return false;
    }
}

// تحديث عرض الملاحظات
function updateFeedbackDisplay() {
    const feedbackListDiv = document.getElementById('feedbackList');
    const currentUserName = localStorage.getItem('userName');
    
    // تصفية الملاحظات (عرض الملاحظات العامة + ملاحظات المستخدم الخاصة)
    const visibleFeedback = feedbackList.filter(feedback => {
        if (feedback.visibility === 'public') return true;
        if (feedback.userName === currentUserName) return true;
        return false;
    });
    
    if (visibleFeedback.length === 0) {
        feedbackListDiv.innerHTML = '<p style="color: #999; text-align: center; width: 100%;"><span class="ar">لا توجد ملاحظات حتى الآن</span><span class="en" style="display: none;">No feedback yet</span></p>';
        return;
    }
    
    feedbackListDiv.style.display = 'flex';
    feedbackListDiv.style.flexWrap = 'nowrap';
    feedbackListDiv.style.gap = '15px';
    feedbackListDiv.style.alignItems = 'flex-start';
    feedbackListDiv.style.overflowX = 'auto';
    feedbackListDiv.style.overflowY = 'hidden';
    feedbackListDiv.style.scrollBehavior = 'smooth';
    feedbackListDiv.style.paddingBottom = '10px';
    
    feedbackListDiv.innerHTML = visibleFeedback.map((feedback, visibleIndex) => {
        const actualIndex = feedbackList.indexOf(feedback);
        const isOwner = feedback.userName === currentUserName;
        const canDelete = isOwner || isAdminMode;
        
        return `
            <div style="background: #f9f9f9; padding: 15px; border-radius: 10px; border-left: 4px solid #667eea; flex-shrink: 0; min-width: 300px; width: 300px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <img src="badge-${feedback.rating}-${['terrible', 'poor', 'neutral', 'good', 'excellent'][feedback.rating-1]}.png" style="width: 50px; height: 50px; object-fit: contain;">
                    <div style="flex: 1;">
                        <p style="color: #667eea; margin: 0; font-weight: bold; font-size: 14px;">👤 ${feedback.userName}</p>
                        <p style="color: #999; font-size: 11px; margin: 3px 0 0 0;">${new Date(feedback.date).toLocaleString('ar-SA')}</p>
                        <p style="color: ${feedback.visibility === 'public' ? '#28a745' : '#ffc107'}; font-size: 10px; margin: 3px 0 0 0; font-weight: bold;">
                            ${feedback.visibility === 'public' ? '🌐 عام' : '🔒 خاص'}
                        </p>
                    </div>
                </div>
                <p style="color: #333; margin: 10px 0; word-break: break-word; font-size: 14px; line-height: 1.5;">${feedback.text}</p>
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                    ${isOwner ? `<button onclick="editFeedback(${actualIndex})" style="background: #667eea; color: white; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; flex: 1;">✏️ تعديل</button>` : ''}
                    ${canDelete ? `<button onclick="deleteFeedback(${actualIndex})" style="background: #ff6b6b; color: white; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; flex: 1;">🗑️ حذف</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// حذف ملاحظة
function deleteFeedback(index) {
    const feedback = feedbackList[index];
    const currentUserName = localStorage.getItem('userName');
    const isOwner = feedback.userName === currentUserName;
    
    if (!isOwner && !isAdminMode) {
        alert('❌ لا يمكنك حذف ملاحظة شخص آخر!');
        return;
    }
    
    if (confirm('هل تريد حذف هذه الملاحظة؟')) {
        feedbackList.splice(index, 1);
        localStorage.setItem('feedbackList', JSON.stringify(feedbackList));
        updateFeedbackDisplay();
        alert('✅ تم حذف الملاحظة!');
    }
}

// تعديل ملاحظة
function editFeedback(index) {
    openEditModal(index);
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

// معالجة الضغط على أزرار الشعارات
document.addEventListener('DOMContentLoaded', function() {
    const badgeBtns = document.querySelectorAll('.badge-btn');
    badgeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            selectedRating = parseInt(this.getAttribute('data-rating'));
            
            // تحديث الحدود
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
    document.getElementById('submitBtn').addEventListener('click', function() {
        const text = document.getElementById('feedbackText').value.trim();
        
        if (!text) {
            alert('الرجاء كتابة ملاحظة');
            return;
        }
        
        if (selectedRating === null) {
            alert('الرجاء اختيار شعار التقييم');
            return;
        }
        
        // التحقق من الكلمات المحظورة
        if (containsBannedWords(text)) {
            alert('⚠️ تحتوي الملاحظة على كلمات محظورة أو روابط غير مسموحة!\nالرجاء تعديل الملاحظة.');
            return;
        }
        
        // الحصول على اسم الحساب
        const userName = getUserName();
        
        if (editingIndex !== null) {
            // تحديث ملاحظة موجودة
            feedbackList[editingIndex] = {
                text: text,
                rating: selectedRating,
                userName: userName,
                visibility: selectedVisibility,
                date: feedbackList[editingIndex].date,
                editedDate: new Date().toISOString()
            };
            alert('✅ تم تحديث الملاحظة!');
            editingIndex = null;
        } else {
            // إضافة ملاحظة جديدة
            feedbackList.push({
                text: text,
                rating: selectedRating,
                userName: userName,
                visibility: selectedVisibility,
                date: new Date().toISOString()
            });
            alert('✅ شكراً على ملاحظتك!');
        }
        
        // حفظ في localStorage
        localStorage.setItem('feedbackList', JSON.stringify(feedbackList));
        
        // تحديث العرض
        updateFeedbackDisplay();
        
        // مسح النموذج
        document.getElementById('feedbackText').value = '';
        selectedRating = null;
        selectedVisibility = 'public';
        editingIndex = null;
        document.getElementById('selectedBadge').innerHTML = '<p style="color: #999; font-size: 14px;">اختر شعار التقييم</p>';
        badgeBtns.forEach(b => b.style.borderColor = '#ddd');
        updateVisibilityDisplay();
    });
    
    // زر الأدمن
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', function() {
            if (!isAdminMode) {
                checkAdminPassword();
            } else {
                isAdminMode = false;
                alert('❌ تم إيقاف وضع الأدمن!');
            }
            updateFeedbackDisplay();
        });
    }
    
    // تحديث الملاحظات عند التحميل
    updateFeedbackDisplay();
});
