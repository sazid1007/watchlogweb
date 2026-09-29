export default function SettingsPage() {
  return <div className="max-w-2xl space-y-12"><div><p className="eyebrow">Workspace</p><h1 className="hero-title mt-4">Settings</h1></div><section className="divide-y divide-glass-border border-y border-glass-border"><SettingRow label="Display language" value="English" /><SettingRow label="Region" value="United States" /><SettingRow label="Theme" value="Midnight" /></section><p className="max-w-lg text-sm leading-7 text-foreground-muted">WatchLog keeps your discovery experience quiet and personal. More account controls will appear here as your journal grows.</p></div>;
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-5 py-5"><span className="text-sm text-foreground">{label}</span><span className="text-sm text-foreground-muted">{value} <span className="ml-3 text-accent">→</span></span></div>;
}
