// تخزين الملاحظات
let selectedRating = null;
let selectedVisibility = 'public';
let isAdminMode = false;
let editingId = null;

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
        
        if (editingId !== null) {
            // تحديث ملاحظة موجودة
            updateFeedbackInFirebase(editingId, text, selectedRating, selectedVisibility);
            editingId = null;
        } else {
            // إضافة ملاحظة جديدة
            addFeedbackToFirebase(text, selectedRating, selectedVisibility);
        }
        
        // مسح النموذج
        document.getElementById('feedbackText').value = '';
        selectedRating = null;
        selectedVisibility = 'public';
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
});
