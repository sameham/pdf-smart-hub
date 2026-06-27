"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Loader2, Settings as SettingsIcon, Save, Plus } from "lucide-react";
import { toast } from "sonner";

interface Setting {
  key: string;
  value: any;
  description: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .order("key");

      setSettings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    setSaving(key);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);

      if (error) throw error;

      // Log action
      await supabase.from("admin_audit_log").insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action: "settings.update",
        target_type: "setting",
        target_id: key,
        details: { new_value: value },
      });

      toast.success("Setting updated");
      await loadSettings();
    } catch (err) {
      toast.error("Failed to update");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Site Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Configure your site behavior
        </p>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <SettingCard
            key={setting.key}
            setting={setting}
            saving={saving === setting.key}
            onSave={(value) => updateSetting(setting.key, value)}
          />
        ))}
      </div>
    </div>
  );
}

function SettingCard({
  setting,
  saving,
  onSave,
}: {
  setting: Setting;
  saving: boolean;
  onSave: (value: any) => void;
}) {
  const [value, setValue] = useState(setting.value);
  const isBoolean = typeof setting.value === "boolean";
  const isNumber = typeof setting.value === "number";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="font-bold capitalize">
            {setting.key.replace(/_/g, " ")}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isBoolean ? (
          <button
            onClick={() => {
              const newVal = !value;
              setValue(newVal);
              onSave(newVal);
            }}
            disabled={saving}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              value ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                value ? "translate-x-1" : "-translate-x-6"
              }`}
            />
          </button>
        ) : isNumber ? (
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 outline-none"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 outline-none"
          />
        )}

        {!isBoolean && (
          <button
            onClick={() => onSave(value)}
            disabled={saving}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
        )}
      </div>
    </div>
  );
}