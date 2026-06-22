// إنشاء Modal للتعديل
function createEditModal() {
    const modalHTML = `
        <div id="editModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 15px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #667eea;">✏️ تعديل الملاحظة</h2>
                    <button onclick="closeEditModal()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #999;">✕</button>
                </div>
                
                <!-- اختيار التقييم -->
                <div style="margin-bottom: 20px;">
                    <label style="display: block; color: #667eea; font-weight: bold; margin-bottom: 10px;">قيّم تجربتك:</label>
                    <div style="display: flex; justify-content: space-around; gap: 10px; flex-wrap: wrap;" id="modalBadges">
                        <button class="modal-badge-btn" data-rating="1" style="background: none; border: 3px solid #ddd; border-radius: 10px; padding: 8px; cursor: pointer; transition: all 0.3s;">
                            <img src="badge-1-terrible.png" style="width: 70px; height: 70px; object-fit: contain;">
                        </button>
                        <button class="modal-badge-btn" data-rating="2" style="background: none; border: 3px solid #ddd; border-radius: 10px; padding: 8px; cursor: pointer; transition: all 0.3s;">
                            <img src="badge-2-poor.png" style="width: 70px; height: 70px; object-fit: contain;">
                        </button>
                        <button class="modal-badge-btn" data-rating="3" style="background: none; border: 3px solid #ddd; border-radius: 10px; padding: 8px; cursor: pointer; transition: all 0.3s;">
                            <img src="badge-3-neutral.png" style="width: 70px; height: 70px; object-fit: contain;">
                        </button>
                        <button class="modal-badge-btn" data-rating="4" style="background: none; border: 3px solid #ddd; border-radius: 10px; padding: 8px; cursor: pointer; transition: all 0.3s;">
                            <img src="badge-4-good.png" style="width: 70px; height: 70px; object-fit: contain;">
                        </button>
                        <button class="modal-badge-btn" data-rating="5" style="background: none; border: 3px solid #ddd; border-radius: 10px; padding: 8px; cursor: pointer; transition: all 0.3s;">
                            <img src="badge-5-excellent.png" style="width: 70px; height: 70px; object-fit: contain;">
                        </button>
                    </div>
                </div>
                
                <!-- اختيار النوع (عام/خاص) -->
                <div style="margin-bottom: 20px;">
                    <label style="display: block; color: #667eea; font-weight: bold; margin-bottom: 10px;">نوع الملاحظة:</label>
                    <div style="display: flex; gap: 10px;">
                        <button class="modal-visibility-btn" data-visibility="public" style="background: white; border: 3px solid #667eea; border-radius: 8px; padding: 10px 20px; cursor: pointer; font-weight: bold; color: #667eea; transition: all 0.3s; flex: 1;">
                            🌐 عام (يراه الجميع)
                        </button>
                        <button class="modal-visibility-btn" data-visibility="private" style="background: white; border: 3px solid #ddd; border-radius: 8px; padding: 10px 20px; cursor: pointer; font-weight: bold; color: #666; transition: all 0.3s; flex: 1;">
                            🔒 خاص (لك فقط)
                        </button>
                    </div>
                </div>
                
                <!-- حقل النص -->
                <div style="margin-bottom: 20px;">
                    <label style="display: block; color: #667eea; font-weight: bold; margin-bottom: 10px;">الملاحظة:</label>
                    <textarea id="modalFeedbackText" style="width: 100%; height: 150px; padding: 15px; border: 2px solid #667eea; border-radius: 10px; font-family: Arial; font-size: 14px; resize: vertical;" dir="rtl"></textarea>
                </div>
                
                <!-- أزرار الإجراء -->
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="closeEditModal()" style="background: #ddd; color: #333; padding: 10px 20px; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: bold;">إلغاء</button>
                    <button onclick="saveEditedFeedback()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: bold;">حفظ التعديل</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // معالجة أزرار التقييم في Modal
    const modalBadgeBtns = document.querySelectorAll('.modal-badge-btn');
    modalBadgeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            selectedRating = parseInt(this.getAttribute('data-rating'));
            
            modalBadgeBtns.forEach(b => b.style.borderColor = '#ddd');
            this.style.borderColor = '#667eea';
            this.style.borderWidth = '3px';
        });
    });
    
    // معالجة أزرار الرؤية في Modal
    const modalVisibilityBtns = document.querySelectorAll('.modal-visibility-btn');
    modalVisibilityBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            selectedVisibility = this.getAttribute('data-visibility');
            
            modalVisibilityBtns.forEach(b => {
                b.style.borderColor = '#ddd';
                b.style.backgroundColor = 'white';
                b.style.color = '#666';
            });
            this.style.borderColor = '#667eea';
            this.style.backgroundColor = '#f0f4ff';
            this.style.color = '#667eea';
        });
    });
}

// فتح Modal التعديل
function openEditModal(index) {
    const feedback = feedbackList[index];
    const currentUserName = localStorage.getItem('userName');
    
    if (feedback.userName !== currentUserName) {
        alert('❌ لا يمكنك تعديل ملاحظة شخص آخر!');
        return;
    }
    
    editingIndex = index;
    selectedRating = feedback.rating;
    selectedVisibility = feedback.visibility;
    
    const modal = document.getElementById('editModal');
    modal.style.display = 'flex';
    
    // ملء البيانات
    document.getElementById('modalFeedbackText').value = feedback.text;
    
    // تحديث الأزرار
    const modalBadgeBtns = document.querySelectorAll('.modal-badge-btn');
    modalBadgeBtns.forEach(btn => {
        if (parseInt(btn.getAttribute('data-rating')) === selectedRating) {
            btn.style.borderColor = '#667eea';
            btn.style.borderWidth = '3px';
        } else {
            btn.style.borderColor = '#ddd';
            btn.style.borderWidth = '1px';
        }
    });
    
    const modalVisibilityBtns = document.querySelectorAll('.modal-visibility-btn');
    modalVisibilityBtns.forEach(btn => {
        if (btn.getAttribute('data-visibility') === selectedVisibility) {
            btn.style.borderColor = '#667eea';
            btn.style.backgroundColor = '#f0f4ff';
            btn.style.color = '#667eea';
        } else {
            btn.style.borderColor = '#ddd';
            btn.style.backgroundColor = 'white';
            btn.style.color = '#666';
        }
    });
    
    document.getElementById('modalFeedbackText').focus();
}

// إغلاق Modal
function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
    editingIndex = null;
}

// حفظ التعديل من Modal
function saveEditedFeedback() {
    const text = document.getElementById('modalFeedbackText').value.trim();
    
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
    
    if (editingIndex !== null) {
        const userName = feedbackList[editingIndex].userName;
        
        feedbackList[editingIndex] = {
            text: text,
            rating: selectedRating,
            userName: userName,
            visibility: selectedVisibility,
            date: feedbackList[editingIndex].date,
            editedDate: new Date().toISOString()
        };
        
        localStorage.setItem('feedbackList', JSON.stringify(feedbackList));
        updateFeedbackDisplay();
        closeEditModal();
        alert('✅ تم تحديث الملاحظة!');
    }
}

// إغلاق Modal عند الضغط خارجه
document.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (modal && event.target === modal) {
        closeEditModal();
    }
});

// إنشاء Modal عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    createEditModal();
});
