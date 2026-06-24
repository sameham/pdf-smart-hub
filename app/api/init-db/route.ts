import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This endpoint initializes the database schema
// It's called once on first dashboard visit or manually
export async function POST() {
  try {
    // Use service role to bypass RLS for schema creation
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // SQL to create the schema
    const sql = `
      -- Create processing_history table
      CREATE TABLE IF NOT EXISTS public.processing_history (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
        tool_type text NOT NULL,
        file_name text NOT NULL,
        file_size bigint NOT NULL DEFAULT 0,
        status text NOT NULL DEFAULT 'completed',
        metadata jsonb DEFAULT '{}'::jsonb,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS processing_history_user_id_idx
        ON public.processing_history(user_id);

      CREATE INDEX IF NOT EXISTS processing_history_created_at_idx
        ON public.processing_history(created_at DESC);

      -- Enable RLS
      ALTER TABLE public.processing_history ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Users can view own history" ON public.processing_history;
      CREATE POLICY "Users can view own history"
        ON public.processing_history FOR SELECT
        USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can insert own history" ON public.processing_history;
      CREATE POLICY "Users can insert own history"
        ON public.processing_history FOR INSERT
        WITH CHECK (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can delete own history" ON public.processing_history;
      CREATE POLICY "Users can delete own history"
        ON public.processing_history FOR DELETE
        USING (auth.uid() = user_id);

      -- Create profiles table
      CREATE TABLE IF NOT EXISTS public.profiles (
        id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        full_name text,
        avatar_url text,
        preferred_language text DEFAULT 'ar' CHECK (preferred_language IN ('ar', 'en')),
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
      );

      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
      CREATE POLICY "Profiles are viewable by everyone"
        ON public.profiles FOR SELECT USING (true);

      DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
      CREATE POLICY "Users can update own profile"
        ON public.profiles FOR UPDATE USING (auth.uid() = id);

      DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
      CREATE POLICY "Users can insert own profile"
        ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

      -- Auto-create profile on signup
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.profiles (id, full_name)
        VALUES (
          new.id,
          COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
        )
        ON CONFLICT (id) DO NOTHING;
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `;

    // Execute via RPC
    const { data, error } = await supabaseAdmin.rpc("exec_sql", {
      sql_query: sql,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message:
      "POST to this endpoint to initialize the database schema. Or run the SQL directly in Supabase SQL Editor.",
    schema_url:
      "https://github.com/sameham/pdf-smart-hub/blob/main/supabase/schema.sql",
  });
}