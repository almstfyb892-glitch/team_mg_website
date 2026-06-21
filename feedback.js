// تخزين الملاحظات
let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
let selectedRating = null;

// تحديث عرض الملاحظات
function updateFeedbackDisplay() {
    const feedbackListDiv = document.getElementById('feedbackList');
    
    if (feedbackList.length === 0) {
        feedbackListDiv.innerHTML = '<p style="color: #999; text-align: center;">لا توجد ملاحظات حتى الآن</p>';
        return;
    }
    
    feedbackListDiv.innerHTML = feedbackList.map((feedback, index) => `
        <div style="background: #f9f9f9; padding: 15px; margin-bottom: 15px; border-radius: 10px; border-left: 4px solid #667eea;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <img src="badge-${feedback.rating}-${['terrible', 'poor', 'neutral', 'good', 'excellent'][feedback.rating-1]}.png" style="width: 50px; height: 50px; object-fit: contain;">
                <div style="flex: 1; margin-left: 15px;">
                    <p style="color: #333; margin: 0; word-break: break-word;">${feedback.text}</p>
                    <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">${new Date(feedback.date).toLocaleString('ar-SA')}</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="editFeedback(${index})" style="background: #667eea; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 12px;">تعديل</button>
                    <button onclick="deleteFeedback(${index})" style="background: #ff6b6b; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 12px;">حذف</button>
                </div>
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
        
        // إضافة الملاحظة
        feedbackList.push({
            text: text,
            rating: selectedRating,
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
        
        alert('شكراً على ملاحظتك!');
    });
    
    // تحديث الملاحظات عند التحميل
    updateFeedbackDisplay();
});
