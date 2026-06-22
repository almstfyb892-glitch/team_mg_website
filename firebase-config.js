// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDKq1mZ8pL9nQ2rR3sT4uV5wX6yZ7aB8cD",
    authDomain: "team-mg-feedback.firebaseapp.com",
    projectId: "team-mg-feedback",
    storageBucket: "team-mg-feedback.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// متغيرات عامة
let currentUserName = '';
let feedbackList = [];

// الحصول على اسم المستخدم
function getUserName() {
    let userName = localStorage.getItem('userName');
    if (!userName) {
        userName = prompt('الرجاء إدخال اسم حسابك:');
        if (userName && userName.trim()) {
            localStorage.setItem('userName', userName.trim());
            currentUserName = userName.trim();
        } else {
            currentUserName = 'مستخدم مجهول';
        }
    } else {
        currentUserName = userName;
    }
    return currentUserName;
}

// جلب الملاحظات من Firebase
async function loadFeedbackFromFirebase() {
    try {
        const snapshot = await db.collection('feedback').orderBy('date', 'desc').get();
        feedbackList = [];
        snapshot.forEach(doc => {
            feedbackList.push({
                id: doc.id,
                ...doc.data()
            });
        });
        updateFeedbackDisplay();
    } catch (error) {
        console.error('خطأ في جلب الملاحظات:', error);
    }
}

// إضافة ملاحظة إلى Firebase
async function addFeedbackToFirebase(text, rating, visibility) {
    try {
        const userName = currentUserName || getUserName();
        
        await db.collection('feedback').add({
            text: text,
            rating: rating,
            userName: userName,
            visibility: visibility,
            date: new Date().toISOString(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        loadFeedbackFromFirebase();
        alert('✅ تم إضافة الملاحظة!');
    } catch (error) {
        console.error('خطأ في إضافة الملاحظة:', error);
        alert('❌ حدث خطأ في إضافة الملاحظة');
    }
}

// تحديث ملاحظة في Firebase
async function updateFeedbackInFirebase(id, text, rating, visibility) {
    try {
        await db.collection('feedback').doc(id).update({
            text: text,
            rating: rating,
            visibility: visibility,
            editedDate: new Date().toISOString()
        });
        
        loadFeedbackFromFirebase();
        alert('✅ تم تحديث الملاحظة!');
    } catch (error) {
        console.error('خطأ في تحديث الملاحظة:', error);
        alert('❌ حدث خطأ في تحديث الملاحظة');
    }
}

// حذف ملاحظة من Firebase
async function deleteFeedbackFromFirebase(id, isAdmin = false) {
    try {
        const feedback = feedbackList.find(f => f.id === id);
        
        if (!feedback) {
            alert('❌ لم يتم العثور على الملاحظة');
            return;
        }
        
        const isOwner = feedback.userName === currentUserName;
        
        if (!isOwner && !isAdmin) {
            alert('❌ لا يمكنك حذف ملاحظة شخص آخر!');
            return;
        }
        
        if (confirm('هل تريد حذف هذه الملاحظة؟')) {
            await db.collection('feedback').doc(id).delete();
            loadFeedbackFromFirebase();
            alert('✅ تم حذف الملاحظة!');
        }
    } catch (error) {
        console.error('خطأ في حذف الملاحظة:', error);
        alert('❌ حدث خطأ في حذف الملاحظة');
    }
}

// تحديث عرض الملاحظات
function updateFeedbackDisplay() {
    const feedbackListDiv = document.getElementById('feedbackList');
    
    // تصفية الملاحظات (عرض العامة + الخاصة للمالك)
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
    
    feedbackListDiv.innerHTML = visibleFeedback.map((feedback) => {
        const isOwner = feedback.userName === currentUserName;
        
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
                    ${isOwner ? `<button onclick="openEditModal('${feedback.id}')" style="background: #667eea; color: white; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; flex: 1;">✏️ تعديل</button>` : ''}
                    ${isOwner ? `<button onclick="deleteFeedbackFromFirebase('${feedback.id}')" style="background: #ff6b6b; color: white; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; flex: 1;">🗑️ حذف</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    currentUserName = getUserName();
    loadFeedbackFromFirebase();
    
    // تحديث الملاحظات كل 3 ثوان
    setInterval(loadFeedbackFromFirebase, 3000);
});
