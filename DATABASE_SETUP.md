# إعداد قاعدة البيانات - Supabase

## الخطوة 1: إنشاء حساب Supabase

1. اذهب إلى: https://supabase.com
2. اضغط "Start your project"
3. سجل دخول باستخدام GitHub أو البريد الإلكتروني
4. اختر "Create a new project"

## الخطوة 2: إنشاء مشروع جديد

- **Project Name**: team-mg-feedback
- **Database Password**: (اختر كلمة سر قوية)
- **Region**: اختر الأقرب لموقعك
- اضغط "Create new project"

## الخطوة 3: الحصول على بيانات الاتصال

1. اذهب إلى: Settings > API
2. انسخ:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_KEY)

## الخطوة 4: تحديث ملف supabase-config.js

استبدل البيانات في `supabase-config.js`:

```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL';
const SUPABASE_KEY = 'YOUR_ANON_KEY';
```

## الخطوة 5: إنشاء جدول الملاحظات

1. في Supabase Console، اذهب إلى: SQL Editor
2. اضغط "New Query"
3. انسخ محتوى ملف `setup-database.sql`
4. اضغط "Run"

## الخطوة 6: التحقق من الإعدادات

1. اذهب إلى: Tables
2. يجب أن ترى جدول "feedback"
3. اختبر الموقع بإضافة ملاحظة جديدة

## ملاحظات مهمة

- **الخطة المجانية**: 500 MB تخزين، 50,000 قراءة/يوم، 20,000 كتابة/يوم
- **بدون بطاقة ائتمان مطلوبة**
- **قاعدة البيانات تُحفظ تلقائياً**

## استكشاف الأخطاء

### الخطأ: "Could not connect to database"
- تحقق من SUPABASE_URL و SUPABASE_KEY
- تأكد من تفعيل الجدول

### الخطأ: "Permission denied"
- تحقق من سياسات RLS
- تأكد من أن الملاحظات العامة يمكن قراءتها

### الملاحظات لا تظهر
- افتح Developer Console (F12)
- تحقق من الأخطاء في Console
- تأكد من أن الملاحظات محفوظة في الجدول

## الدعم

للمزيد من المساعدة:
- https://supabase.com/docs
- https://discord.supabase.com
