// Supabase Configuration
const SUPABASE_URL = 'https://team-mg-feedback.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYW0tbWctZmVlZGJhY2siLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxOTEwNDAwMCwiZXhwIjoxODc2ODcyMDAwfQ.dummyKeyForDemo';

// Initialize Supabase
const supabase = supabase_module.createClient(SUPABASE_URL, SUPABASE_KEY);

// متغيرات عامة
let currentUserName = '';
let feedbackList = [];
let isAdminMode = false;

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

// جلب الملاحظات من Supabase
async function loadFeedbackFromSupabase() {
    try {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        feedbackList = data || [];
        updateFeedbackDisplay();
    } catch (error) {
        console.error('خطأ في جلب الملاحظات:', error);
    }
}

// إضافة ملاحظة إلى Supabase
async function addFeedbackToSupabase(text, rating, visibility) {
    try {
        const userName = currentUserName || getUserName();
        
        const { data, error } = await supabase
            .from('feedback')
            .insert([
                {
                    text: text,
                    rating: rating,
                    user_name: userName,
                    visibility: visibility,
                    created_at: new Date().toISOString()
                }
            ]);
        
        if (error) throw error;
        
        loadFeedbackFromSupabase();
        alert('✅ تم إضافة الملاحظة!');
    } catch (error) {
        console.error('خطأ في إضافة الملاحظة:', error);
        alert('❌ حدث خطأ في إضافة الملاحظة');
    }
}

// تحديث ملاحظة في Supabase
async function updateFeedbackInSupabase(id, text, rating, visibility) {
    try {
        const { data, error } = await supabase
            .from('feedback')
            .update({
                text: text,
                rating: rating,
                visibility: visibility,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);
        
        if (error) throw error;
        
        loadFeedbackFromSupabase();
        alert('✅ تم تحديث الملاحظة!');
    } catch (error) {
        console.error('خطأ في تحديث الملاحظة:', error);
        alert('❌ حدث خطأ في تحديث الملاحظة');
    }
}

// حذف ملاحظة من Supabase
async function deleteFeedbackFromSupabase(id) {
    try {
        const feedback = feedbackList.find(f => f.id === id);
        
        if (!feedback) {
            alert('❌ لم يتم العثور على الملاحظة');
            return;
        }
        
        const isOwner = feedback.user_name === currentUserName;
        
        if (!isOwner && !isAdminMode) {
            alert('❌ لا يمكنك حذف ملاحظة شخص آخر!');
            return;
        }
        
        if (confirm('هل تريد حذف هذه الملاحظة؟')) {
            const { error } = await supabase
                .from('feedback')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            loadFeedbackFromSupabase();
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
        if (feedback.user_name === currentUserName) return true;
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
        const isOwner = feedback.user_name === currentUserName;
        const badgeNames = ['terrible', 'poor', 'neutral', 'good', 'excellent'];
        
        return `
            <div style="background: #f9f9f9; padding: 15px; border-radius: 10px; border-left: 4px solid #667eea; flex-shrink: 0; min-width: 300px; width: 300px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <img src="badge-${feedback.rating}-${badgeNames[feedback.rating-1]}.png" style="width: 50px; height: 50px; object-fit: contain;">
                    <div style="flex: 1;">
                        <p style="color: #667eea; margin: 0; font-weight: bold; font-size: 14px;">👤 ${feedback.user_name}</p>
                        <p style="color: #999; font-size: 11px; margin: 3px 0 0 0;">${new Date(feedback.created_at).toLocaleString('ar-SA')}</p>
                        <p style="color: ${feedback.visibility === 'public' ? '#28a745' : '#ffc107'}; font-size: 10px; margin: 3px 0 0 0; font-weight: bold;">
                            ${feedback.visibility === 'public' ? '🌐 عام' : '🔒 خاص'}
                        </p>
                    </div>
                </div>
                <p style="color: #333; margin: 10px 0; word-break: break-word; font-size: 14px; line-height: 1.5;">${feedback.text}</p>
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                    ${isOwner ? `<button onclick="openEditModal('${feedback.id}')" style="background: #667eea; color: white; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; flex: 1;">✏️ تعديل</button>` : ''}
                    ${isOwner || isAdminMode ? `<button onclick="deleteFeedbackFromSupabase('${feedback.id}')" style="background: #ff6b6b; color: white; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; flex: 1;">🗑️ حذف</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
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

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    currentUserName = getUserName();
    loadFeedbackFromSupabase();
    
    // تحديث الملاحظات كل 3 ثوان
    setInterval(loadFeedbackFromSupabase, 3000);
});
