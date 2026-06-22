-- إنشاء جدول الملاحظات
CREATE TABLE feedback (
    id BIGSERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    user_name VARCHAR(255) NOT NULL,
    visibility VARCHAR(20) NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX idx_feedback_visibility ON feedback(visibility);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX idx_feedback_user_name ON feedback(user_name);

-- تفعيل RLS (Row Level Security)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- السماح بقراءة الملاحظات العامة للجميع
CREATE POLICY "Allow public read" ON feedback
    FOR SELECT
    USING (visibility = 'public');

-- السماح بقراءة الملاحظات الخاصة لصاحبها فقط
CREATE POLICY "Allow private read for owner" ON feedback
    FOR SELECT
    USING (visibility = 'private' AND auth.uid()::text = user_name);

-- السماح بإدراج ملاحظات جديدة للجميع
CREATE POLICY "Allow insert for all" ON feedback
    FOR INSERT
    WITH CHECK (true);

-- السماح بتحديث الملاحظات لصاحبها فقط
CREATE POLICY "Allow update for owner" ON feedback
    FOR UPDATE
    USING (user_name = current_user_id());

-- السماح بحذف الملاحظات لصاحبها فقط
CREATE POLICY "Allow delete for owner" ON feedback
    FOR DELETE
    USING (user_name = current_user_id());
