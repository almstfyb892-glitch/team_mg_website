// تخزين الملاحظات
let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
let selectedRating = null;

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

// دالة للحصول على اسم الحساب (يمكن تعديله حسب الحاجة)
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

// تحديث عرض الملاحظات (عرض أفقي)
function updateFeedbackDisplay() {
    const feedbackListDiv = document.getElementById('feedbackList');
    
    if (feedbackList.length === 0) {
        feedbackListDiv.innerHTML = '<p style="color: #999; text-align: center;">لا توجد ملاحظات حتى الآن</p>';
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
    
    feedbackListDiv.innerHTML = feedbackList.map((feedback, index) => `
        <div style="background: #f9f9f9; padding: 15px; border-radius: 10px; border-left: 4px solid #667eea; flex-shrink: 0; min-width: 300px; width: 300px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <img src="badge-${feedback.rating}-${['terrible', 'poor', 'neutral', 'good', 'excellent'][feedback.rating-1]}.png" style="width: 50px; height: 50px; object-fit: contain;">
                <div style="flex: 1;">
                    <p style="color: #667eea; margin: 0; font-weight: bold; font-size: 14px;">👤 ${feedback.userName}</p>
                    <p style="color: #999; font-size: 11px; margin: 3px 0 0 0;">${new Date(feedback.date).toLocaleString('ar-SA')}</p>
                </div>
            </div>
            <p style="color: #333; margin: 10px 0; word-break: break-word; font-size: 14px; line-height: 1.5;">${feedback.text}</p>
            <div style="display: flex; gap: 8px; margin-top: 10px;">
                <button onclick="editFeedback(${index})" style="background: #667eea; color: white; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; flex: 1;">تعديل</button>
                <button onclick="deleteFeedback(${index})" style="background: #ff6b6b; color: white; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; flex: 1;">حذف</button>
            </div>
        </div>
    `).join('');
}

// حذف ملاحظة
function deleteFeedback(index) {
    if (confirm('هل تريد حذف هذه الملاحظة؟')) {
        feedbackList.splice(index, 1);
        localStorage.setItem('feedbackList', JSON.stringify(feedbackList));
        updateFeedbackDisplay();
    }
}

// تعديل ملاحظة
function editFeedback(index) {
    const feedback = feedbackList[index];
    document.getElementById('feedbackText').value = feedback.text;
    selectedRating = feedback.rating;
    updateBadgeDisplay();
    
    // حذف الملاحظة القديمة
    deleteFeedback(index);
    
    // التركيز على حقل الإدخال
    document.getElementById('feedbackText').focus();
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
        
        // إضافة الملاحظة
        feedbackList.push({
            text: text,
            rating: selectedRating,
            userName: userName,
            date: new Date().toISOString()
        });
        
        // حفظ في localStorage
        localStorage.setItem('feedbackList', JSON.stringify(feedbackList));
        
        // تحديث العرض
        updateFeedbackDisplay();
        
        // مسح النموذج
        document.getElementById('feedbackText').value = '';
        selectedRating = null;
        document.getElementById('selectedBadge').innerHTML = '<p style="color: #999; font-size: 14px;">اختر شعار التقييم</p>';
        badgeBtns.forEach(b => b.style.borderColor = '#ddd');
        
        alert('✅ شكراً على ملاحظتك!');
    });
    
    // تحديث الملاحظات عند التحميل
    updateFeedbackDisplay();
});
