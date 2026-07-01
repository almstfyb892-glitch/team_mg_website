// ===== FEEDBACK SYSTEM =====
let selectedRating = null;
let selectedVisibility = 'public';
let editingId = null;
let isAdminMode = false;
let allFeedback = [];
let userName = '';

const bannedWords = ['سب', 'قذف', 'شتم', 'http://', 'https://', 'www.'];

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
        console.error('Error loading feedback:', e);
        allFeedback = [];
    }
}

function saveFeedback() {
    try {
        localStorage.setItem('allFeedback', JSON.stringify(allFeedback));
    } catch (e) {
        console.error('Error saving feedback:', e);
    }
}

function displayFeedback() {
    const container = document.getElementById('feedbackList');
    if (!container) {
        console.error('feedbackList container not found');
        return;
    }
    
    container.innerHTML = '';
    
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
        
        let buttonsHTML = '';
        if (isOwner) {
            buttonsHTML = `
                <button class="edit-btn" data-id="${feedback.id}" style="background: #667eea; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; margin-right: 5px;">✏️ تعديل</button>
                <button class="delete-btn" data-id="${feedback.id}" style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">🗑️ حذف</button>
            `;
        } else if (isAdminMode) {
            buttonsHTML = `
                <button class="delete-btn" data-id="${feedback.id}" style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">🗑️ حذف</button>
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
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            editFeedbackItem(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteFeedbackItem(id);
        });
    });
}

function editFeedbackItem(id) {
    const feedback = allFeedback.find(f => f.id === id);
    if (!feedback || feedback.userName !== userName) return;
    
    editingId = id;
    const textArea = document.getElementById('feedbackText');
    if (textArea) {
        textArea.value = feedback.text;
        textArea.focus();
    }
    selectedRating = feedback.rating;
    selectedVisibility = feedback.visibility;
    
    updateRatingDisplay();
    updateVisibilityDisplay();
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

function submitFeedback() {
    const text = document.getElementById('feedbackText').value.trim();
    
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
        const index = allFeedback.findIndex(f => f.id === editingId);
        if (index !== -1) {
            allFeedback[index].text = text;
            allFeedback[index].rating = selectedRating;
            allFeedback[index].visibility = selectedVisibility;
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
    
    alert('✅ تم إرسال الملاحظة بنجاح!');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Feedback script loaded');
    
    requestUserName();
    loadFeedback();
    displayFeedback();
    
    // Badge buttons
    const badgeButtons = document.querySelectorAll('.badge-btn');
    console.log('Found badge buttons:', badgeButtons.length);
    badgeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            selectedRating = parseInt(this.getAttribute('data-rating'));
            console.log('Selected rating:', selectedRating);
            updateRatingDisplay();
        });
    });
    
    // Visibility buttons
    const visibilityButtons = document.querySelectorAll('.visibility-btn');
    console.log('Found visibility buttons:', visibilityButtons.length);
    visibilityButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            selectedVisibility = this.getAttribute('data-visibility');
            console.log('Selected visibility:', selectedVisibility);
            updateVisibilityDisplay();
        });
    });
    
    // Submit button
    const submitBtn = document.getElementById('submitBtn');
    console.log('Submit button found:', submitBtn ? 'YES' : 'NO');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Submit button clicked');
            submitFeedback();
        });
    }
    
    // Admin button
    const adminBtn = document.getElementById('adminBtn');
    console.log('Admin button found:', adminBtn ? 'YES' : 'NO');
    if (adminBtn) {
        adminBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Admin button clicked');
            
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
