// ===== متغيرات عامة =====
let selectedRating = null;
let selectedVisibility = 'public';
let editingId = null;
let isAdminMode = false;
let allFeedback = [];
let userName = '';

// ===== كلمات محظورة =====
const bannedWords = ['سب', 'قذف', 'شتم', 'http://', 'https://', 'www.'];

// ===== دوال مساعدة =====
function containsBannedWords(text) {
    return bannedWords.some(word => text.toLowerCase().includes(word.toLowerCase()));
}

function requestUserName() {
    userName = localStorage.getItem('userName');
    if (!userName) {
        userName = prompt('👤 أدخل اسم حسابك:');
        if (!userName || userName.trim() === '') {
            userName = 'زائر';
        }
        localStorage.setItem('userName', userName);
    }
}

function loadFeedback() {
    try {
        const saved = localStorage.getItem('allFeedback');
        allFeedback = saved ? JSON.parse(saved) : [];
    } catch (e) {
        allFeedback = [];
    }
}

function saveFeedback() {
    localStorage.setItem('allFeedback', JSON.stringify(allFeedback));
}

function displayFeedback() {
    const container = document.getElementById('feedbackList');
    if (!container) return;
    
    container.innerHTML = '';
    
    // تصفية الملاحظات المرئية
    const visible = allFeedback.filter(f => {
        if (f.visibility === 'private') {
            return f.userName === userName;
        }
        return true;
    });
    
    if (visible.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; width: 100%;">لا توجد ملاحظات حتى الآن</p>';
        return;
    }
    
    // عرض الملاحظات
    visible.forEach(feedback => {
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
        
        const isOwner = feedback.userName === userName;
        const canDelete = isOwner || isAdminMode;
        
        let buttonsHTML = '';
        if (isOwner) {
            buttonsHTML = `
                <button onclick="editFeedbackItem(${feedback.id})" style="background: #667eea; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; margin-right: 5px;">✏️ تعديل</button>
                <button onclick="deleteFeedbackItem(${feedback.id})" style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">🗑️ حذف</button>
            `;
        } else if (isAdminMode) {
            buttonsHTML = `
                <button onclick="deleteFeedbackItem(${feedback.id})" style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">🗑️ حذف</button>
            `;
        }
        
        const starsHTML = Array(5).fill(0).map((_, i) => 
            `<span style="font-size: 20px; opacity: ${i < feedback.rating ? '1' : '0.3'};">⭐</span>`
        ).join('');
        
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div>
                    <p style="margin: 0; font-weight: bold; color: #333;">👤 ${feedback.userName}</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">${feedback.timestamp}</p>
                    ${feedback.visibility === 'private' ? '<p style="margin: 5px 0 0 0; font-size: 12px; color: #f44336;">🔒 خاص</p>' : ''}
                </div>
                <div style="display: flex; gap: 5px;">
                    ${buttonsHTML}
                </div>
            </div>
            <p style="margin: 10px 0; color: #333; line-height: 1.6;">${feedback.text}</p>
            <div style="display: flex; gap: 5px; margin-top: 10px;">
                ${starsHTML}
            </div>
        `;
        
        container.appendChild(div);
    });
}

function editFeedbackItem(id) {
    const feedback = allFeedback.find(f => f.id === id);
    if (!feedback || feedback.userName !== userName) return;
    
    editingId = id;
    document.getElementById('feedbackText').value = feedback.text;
    selectedRating = feedback.rating;
    selectedVisibility = feedback.visibility;
    
    updateRatingDisplay();
    updateVisibilityDisplay();
    document.getElementById('feedbackText').focus();
}

function deleteFeedbackItem(id) {
    const feedback = allFeedback.find(f => f.id === id);
    if (!feedback) return;
    
    const isOwner = feedback.userName === userName;
    if (!isOwner && !isAdminMode) return;
    
    if (confirm('هل تريد حذف هذه الملاحظة؟')) {
        allFeedback = allFeedback.filter(f => f.id !== id);
        saveFeedback();
        displayFeedback();
    }
}

function updateRatingDisplay() {
    const buttons = document.querySelectorAll('.badge-btn');
    buttons.forEach(btn => {
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
    const buttons = document.querySelectorAll('.visibility-btn');
    buttons.forEach(btn => {
        const visibility = btn.getAttribute('data-visibility');
        if (visibility === selectedVisibility) {
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
    const password = prompt('🔐 أدخل كلمة السر للأدمن:');
    if (password === 'TeamMG@2024#SecureAdmin$789') {
        isAdminMode = true;
        alert('✅ تم تفعيل وضع الأدمن!');
        displayFeedback();
    } else {
        alert('❌ كلمة السر غير صحيحة!');
    }
}

// ===== معالجات الأحداث =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('تحميل الصفحة...');
    
    // تحميل البيانات
    requestUserName();
    loadFeedback();
    displayFeedback();
    
    console.log('اسم المستخدم:', userName);
    console.log('عدد الملاحظات:', allFeedback.length);
    
    // ===== أزرار التقييم =====
    const badgeButtons = document.querySelectorAll('.badge-btn');
    console.log('عدد أزرار التقييم:', badgeButtons.length);
    
    badgeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            selectedRating = parseInt(this.getAttribute('data-rating'));
            console.log('تم اختيار التقييم:', selectedRating);
            updateRatingDisplay();
        });
    });
    
    // ===== أزرار الرؤية =====
    const visibilityButtons = document.querySelectorAll('.visibility-btn');
    console.log('عدد أزرار الرؤية:', visibilityButtons.length);
    
    visibilityButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            selectedVisibility = this.getAttribute('data-visibility');
            console.log('تم اختيار الرؤية:', selectedVisibility);
            updateVisibilityDisplay();
        });
    });
    
    // ===== زر الإرسال =====
    const submitBtn = document.getElementById('submitBtn');
    console.log('زر الإرسال موجود:', !!submitBtn);
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('تم الضغط على زر الإرسال');
            
            const text = document.getElementById('feedbackText').value.trim();
            console.log('النص:', text);
            
            if (!text) {
                alert('❌ الرجاء كتابة ملاحظة');
                return;
            }
            
            if (selectedRating === null) {
                alert('❌ الرجاء اختيار تقييم');
                return;
            }
            
            if (containsBannedWords(text)) {
                alert('⚠️ تحتوي الملاحظة على كلمات محظورة أو روابط!');
                return;
            }
            
            if (editingId !== null) {
                console.log('تحديث الملاحظة:', editingId);
                const index = allFeedback.findIndex(f => f.id === editingId);
                if (index !== -1) {
                    allFeedback[index].text = text;
                    allFeedback[index].rating = selectedRating;
                    allFeedback[index].visibility = selectedVisibility;
                }
                editingId = null;
            } else {
                console.log('إضافة ملاحظة جديدة');
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
            
            // مسح النموذج
            document.getElementById('feedbackText').value = '';
            selectedRating = null;
            selectedVisibility = 'public';
            updateRatingDisplay();
            updateVisibilityDisplay();
            
            alert('✅ تم إرسال الملاحظة بنجاح!');
        });
    }
    
    // ===== زر الأدمن =====
    const adminBtn = document.getElementById('adminBtn');
    console.log('زر الأدمن موجود:', !!adminBtn);
    
    if (adminBtn) {
        adminBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('تم الضغط على زر الأدمن');
            
            if (!isAdminMode) {
                checkAdminPassword();
            } else {
                isAdminMode = false;
                alert('❌ تم إيقاف وضع الأدمن!');
                displayFeedback();
            }
        });
    }
});
