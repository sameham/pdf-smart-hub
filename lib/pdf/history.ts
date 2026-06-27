"use client";

import { createClient } from "@/lib/supabase";

/**
 * حفظ عملية في السجل (اختياري - فقط لو المستخدم مسجل دخول)
 */
export async function logProcessingHistory(data: {
  toolType: string;
  fileName: string;
  fileSize: number;
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return; // مش مسجل دخول، نتجاهل

    await supabase.from("processing_history").insert({
      user_id: user.id,
      tool_type: data.toolType,
      file_name: data.fileName,
      file_size: data.fileSize,
      status: "completed",
      metadata: data.metadata || {},
    });
  } catch (err) {
    // صامت - عدم القدرة على الحفظ مش لازم تأثر على الـ UX
    console.warn("Failed to log history:", err);
  }
}