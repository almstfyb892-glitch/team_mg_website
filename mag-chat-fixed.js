// MAG AI Chat System - Fixed Version
let magChatOpen = false;
let magMessages = [];

// مقترحات الأسئلة
const suggestedQuestions = [
    '🎮 ما هي أفضل الألعاب على الخادم؟',
    '👥 كيف أنضم إلى السيرفر؟',
    '🏆 كيف أصبح عضو VIP؟',
    '💬 كيف أتواصل مع الإدارة؟',
    '🎯 ما هي قواعد السيرفر؟',
    '🌟 كيف أحصل على رتبة خاصة؟'
];

// قاموس الردود - الإجابات الكاملة
const magResponsesMap = {
    'ألعاب': `🎮 أفضل الألعاب في TEAM_MG وأكثرها شهرة هما:

🟦 Roblox

تُعد Roblox من أكثر الألعاب شعبية بسبب تنوعها الهائل، فهي ليست لعبة واحدة بل منصة تحتوي على آلاف الألعاب والتجارب المختلفة التي يصنعها اللاعبون. يمكنك خوض مغامرات مثيرة، أو لعب ألعاب الرعب، أو سباقات السيارات، أو تحديات البقاء، أو حتى بناء عوالمك الخاصة. كما تتميز بإمكانية اللعب مع الأصدقاء والتعرف على لاعبين جدد، مما يجعلها خياراً رائعاً لمن يبحث عن المتعة والتجديد المستمر.

🟩 Minecraft

Minecraft هي لعبة الإبداع والاستكشاف بلا حدود. تمنحك الحرية لبناء المنازل والقصور والمدن الضخمة، أو خوض مغامرات مليئة بالتحديات ضد الوحوش والكهوف الغامضة. تتميز اللعبة بعالم مفتوح واسع وإمكانيات بناء لا نهائية، مما يجعل كل تجربة مختلفة عن الأخرى. سواء كنت من محبي البناء أو الاستكشاف أو البقاء على قيد الحياة، فإن Minecraft تقدم تجربة فريدة وممتعة للجميع.

💚 شكراً لكم على القراءة، ونتمنى لكم وقتاً ممتعاً داخل TEAM_MG.`,
    
    'انضم': `👥 للانضمام إلى السيرفر:
1. اضغط على زر "💬 انضم للسيرفر الآن"
2. سيتم نقلك إلى ديسكورد
3. وافق على الشروط
4. اختر لعبتك المفضلة
5. استمتع! 🎉`,
    
    'vip': `🏆 للحصول على عضوية VIP:
• التبرع للسيرفر
• النشاط المستمر
• المشاركة في الفعاليات

الأعضاء VIP يحصلون على:
✨ رتبة خاصة
✨ قنوات حصرية
✨ مكافآت شهرية

تواصل مع الإدارة للمزيد! 💎`,
    
    'إدارة': `💬 للتواصل مع الإدارة:
• قناة #support في السيرفر
• رسالة خاصة للمسؤولين
• البريد الإلكتروني الرسمي

نحن هنا لمساعدتك 24/7! 🤝`,
    
    'قواعد': `🎯 قواعد السيرفر:
1. احترم الجميع
2. لا للسب والشتم
3. لا للإزعاج
4. لا للإعلانات
5. استمتع واللعب بنزاهة

اقرأ القناة #rules للتفاصيل الكاملة! ⚖️`,
    
    'رتبة': `🌟 الحصول على رتبة خاصة:
• النشاط المستمر في السيرفر
• المشاركة في الفعاليات
• مساعدة الأعضاء الجدد
• الالتزام بالقواعس

كلما زاد نشاطك، زادت رتبتك! 📈`,
    
    'مرحبا': `👋 مرحباً بك! أنا MAG، مساعدك الذكي في السيرفر.

كيف يمكنني مساعدتك اليوم؟ 😊`,
    
    'شكرا': `😊 تشرفت! أنا هنا دائماً لمساعدتك.

إذا كان لديك أسئلة أخرى، لا تتردد! 🚀`
};

// دالة التشفير
function encryptMessage(message) {
    return btoa(message);
}

// دالة فك التشفير
function decryptMessage(encrypted) {
    try {
        return atob(encrypted);
    } catch (e) {
        return encrypted;
    }
}

// إنشاء واجهة MAG Chat
function createMagChat() {
    const chatHTML = `
        <div id="magChatWidget" style="position: fixed; bottom: 20px; left: 20px; z-index: 998; display: none;">
            <button id="magToggleBtn" onclick="toggleMagChat()" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
                transition: all 0.3s;
                background-image: url('mag-creative-logo.png');
                background-size: cover;
                background-position: center;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            </button>
            <p style="text-align: center; margin-top: 8px; color: white; font-weight: bold; font-size: 12px;">MAG</p>
        </div>
        
        <div id="magChatWindow" style="
            position: fixed;
            bottom: 120px;
            left: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            display: none;
            z-index: 999;
            flex-direction: column;
            overflow: hidden;
        ">
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>
                    <h3 style="margin: 0; font-size: 16px;">🤖 MAG - مساعدك الذكي</h3>
                    <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">متاح 24/7</p>
                </div>
                <button onclick="closeMagChat()" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                ">✕</button>
            </div>
            
            <div id="magMessagesContainer" style="
                flex: 1;
                overflow-y: auto;
                padding: 15px;
                background: #f9f9f9;
                display: flex;
                flex-direction: column;
                gap: 10px;
            "></div>
            
            <div style="padding: 15px; border-top: 1px solid #ddd; background: white;">
                <div style="display: flex; gap: 10px;">
                    <input 
                        type="text" 
                        id="magInput" 
                        placeholder="اسأل MAG..." 
                        style="
                            flex: 1;
                            padding: 10px;
                            border: 2px solid #667eea;
                            border-radius: 8px;
                            font-size: 14px;
                        "
                        onkeypress="if(event.key==='Enter') sendMagMessage()"
                    >
                    <button onclick="sendMagMessage()" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                    ">📤</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    document.getElementById('magChatWidget').style.display = 'block';
    loadMagMessages();
    showSuggestedQuestions();
}

function toggleMagChat() {
    const chatWindow = document.getElementById('magChatWindow');
    magChatOpen = !magChatOpen;
    chatWindow.style.display = magChatOpen ? 'flex' : 'none';
    if (magChatOpen) {
        document.getElementById('magInput').focus();
    }
}

function closeMagChat() {
    magChatOpen = false;
    document.getElementById('magChatWindow').style.display = 'none';
}

function showSuggestedQuestions() {
    const container = document.getElementById('magMessagesContainer');
    const welcomeMsg = `
        <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px;
            border-radius: 10px;
            margin-bottom: 10px;
            text-align: center;
        ">
            <p style="margin: 0; font-weight: bold;">👋 مرحباً! أنا MAG</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">كيف يمكنني مساعدتك؟</p>
        </div>
    `;
    
    container.innerHTML = welcomeMsg;
    suggestedQuestions.forEach((question) => {
        const btn = document.createElement('button');
        btn.style.cssText = `
            background: white;
            border: 2px solid #667eea;
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            color: #667eea;
            font-weight: bold;
            transition: all 0.3s;
            width: 100%;
            text-align: right;
        `;
        btn.textContent = question;
        btn.onmouseover = () => btn.style.background = '#f0f4ff';
        btn.onmouseout = () => btn.style.background = 'white';
        btn.onclick = () => {
            document.getElementById('magInput').value = question;
            sendMagMessage();
        };
        container.appendChild(btn);
    });
}

function sendMagMessage() {
    const input = document.getElementById('magInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMagMessage(message, 'user');
    input.value = '';
    saveMagMessage(message, 'user');
    
    showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        const response = getMagResponse(message);
        addMagMessage(response, 'mag');
        saveMagMessage(response, 'mag');
    }, 800);
}

function showTypingIndicator() {
    const container = document.getElementById('magMessagesContainer');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'magTypingIndicator';
    typingDiv.style.cssText = `
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;
    `;
    
    const bubble = document.createElement('div');
    bubble.style.cssText = `
        background: #e8e8e8;
        color: #333;
        padding: 10px 15px;
        border-radius: 12px;
        font-size: 13px;
    `;
    
    bubble.innerHTML = '🤖 جاري الكتابة <span style="animation: blink 1.4s infinite;">...</span>';
    typingDiv.appendChild(bubble);
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('magTypingIndicator');
    if (indicator) indicator.remove();
}

function addMagMessage(message, sender) {
    const container = document.getElementById('magMessagesContainer');
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = `
        display: flex;
        justify-content: ${sender === 'user' ? 'flex-end' : 'flex-start'};
        margin-bottom: 10px;
    `;
    
    const bubble = document.createElement('div');
    bubble.style.cssText = `
        background: ${sender === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e8e8e8'};
        color: ${sender === 'user' ? 'white' : '#333'};
        padding: 10px 15px;
        border-radius: 12px;
        max-width: 85%;
        word-wrap: break-word;
        font-size: 13px;
        line-height: 1.5;
        white-space: pre-wrap;
    `;
    
    bubble.textContent = message;
    msgDiv.appendChild(bubble);
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function getMagResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // البحث المباشر عن الكلمات المفتاحية
    for (let key in magResponsesMap) {
        if (lowerMessage.includes(key)) {
            return magResponsesMap[key];
        }
    }
    
    // رد افتراضي
    return '🤔 سؤال جيد!\n\nيمكنك:\n• اختيار من الأسئلة المقترحة\n• التواصل مع الإدارة في #support\n\nأنا هنا لمساعدتك! 😊';
}

function saveMagMessage(message, sender) {
    const encrypted = encryptMessage(message);
    magMessages.push({
        text: encrypted,
        sender: sender,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('magMessages', JSON.stringify(magMessages));
}

function loadMagMessages() {
    const saved = localStorage.getItem('magMessages');
    if (saved) {
        magMessages = JSON.parse(saved);
        const container = document.getElementById('magMessagesContainer');
        container.innerHTML = '';
        magMessages.slice(-10).forEach(msg => {
            const decrypted = decryptMessage(msg.text);
            addMagMessage(decrypted, msg.sender);
        });
    }
}

// CSS للرسوم المتحركة
const style = document.createElement('style');
style.textContent = `
    @keyframes blink {
        0%, 20%, 50%, 80%, 100% { opacity: 1; }
        40% { opacity: 0.5; }
        60% { opacity: 0.7; }
    }
`;
document.head.appendChild(style);

// تهيئة
document.addEventListener('DOMContentLoaded', function() {
    createMagChat();
});
