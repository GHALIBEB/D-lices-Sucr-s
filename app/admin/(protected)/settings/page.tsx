'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';
import Image from 'next/image';


type SettingsState = Record<string, string>;

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings').then((r) => r.json()).then(setSettings);
  }, []);

  function set(key: string, value: string) {
    setSettings((p) => ({ ...p, [key]: value }));
  }

  async function uploadFile(key: string, file: File, type: 'image' | 'video' = 'image') {
    setUploading(key);
    try {
      // Upload direct vers Cloudinary (contourne la limite 4.5MB de Vercel)
      const cloudName = 'dspvlrphl';
      const preset = 'delice';
      const resourceType = type === 'video' ? 'video' : 'image';

      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', preset);
      fd.append('folder', 'delice_sucre');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: 'POST', body: fd }
      );
      const data = await res.json();

      if (data.secure_url) {
        setSettings((prev) => {
          const updated = { ...prev, [key]: data.secure_url };
          fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          });
          return updated;
        });
        toast.success(`✅ ${type === 'video' ? 'Vidéo' : 'Image'} sauvegardée !`);
      } else {
        toast.error(`Erreur Cloudinary: ${data.error?.message || 'inconnue'}`);
      }
    } catch (e: any) {
      toast.error(`Erreur: ${e.message}`);
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    setSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      // Apply colors live
      if (settings.primaryColor) document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
      if (settings.accentColor) document.documentElement.style.setProperty('--color-accent', settings.accentColor);
      toast.success('Paramètres sauvegardés');
    } catch {
      toast.error('Erreur');
    } finally {
      setSaving(false);
    }
  }

  function ImageUploadField({ label, settingKey, videoOk }: { label: string; settingKey: string; videoOk?: boolean }) {
    const val = settings[settingKey] || '';
    const isVideo = val.includes('/video/') || val.endsWith('.mp4') || val.endsWith('.mov');

    return (
      <div>
        <label className="label">{label}</label>
        <div className="flex gap-3 items-start">
          {/* Aperçu */}
          {val && (
            <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
              {isVideo ? (
                <video src={val} className="w-full h-full object-cover" muted playsInline />
              ) : (
                <Image src={val} alt="" fill className="object-cover" />
              )}
              <span className="absolute bottom-0 right-0 bg-green-500 text-white text-[9px] px-1 rounded-tl">
                {isVideo ? '🎬' : '🖼️'}
              </span>
            </div>
          )}

          <label className={`flex-1 border-2 border-dashed rounded-xl p-3 flex items-center gap-2 cursor-pointer transition text-sm ${
            uploading === settingKey ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary text-gray-500'
          }`}>
            {uploading === settingKey ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span className="text-primary font-medium">Upload en cours...</span>
              </>
            ) : (
              <>
                <Upload size={16} className="flex-shrink-0" />
                <span>{val ? 'Changer' : `Choisir ${videoOk ? 'image ou vidéo' : 'une image'}`}</span>
              </>
            )}
            <input
              type="file"
              accept={videoOk ? 'image/*,video/*' : 'image/*'}
              className="hidden"
              disabled={!!uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const type = file.type.startsWith('video') ? 'video' : 'image';
                uploadFile(settingKey, file, type);
              }}
            />
          </label>
        </div>
      </div>
    );
  }

  const S = (k: string) => settings[k] || '';

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-gray-900">Paramètres</h1>
        <button onClick={save} disabled={saving} className="btn-primary text-sm py-2">
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      {/* Informations boutique */}
      <Section title="Informations Boutique">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nom de la boutique" value={S('shopName')} onChange={(v) => set('shopName', v)} />
          <Field label="Slogan" value={S('slogan')} onChange={(v) => set('slogan', v)} />
          <Field label="WhatsApp (format 212XXXXXXXXX)" value={S('whatsappNumber')} onChange={(v) => set('whatsappNumber', v)} />
          <Field label="Instagram URL" value={S('instagramUrl')} onChange={(v) => set('instagramUrl', v)} />
          <Field label="Facebook URL" value={S('facebookUrl')} onChange={(v) => set('facebookUrl', v)} />
        </div>
      </Section>

      {/* Livraison */}
      <Section title="Livraison & Délais">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Frais de livraison (MAD)" value={S('deliveryFee')} onChange={(v) => set('deliveryFee', v)} type="number" />
          <Field label="Livraison gratuite à partir de (MAD)" value={S('freeDeliveryFrom')} onChange={(v) => set('freeDeliveryFrom', v)} type="number" />
          <Field label="Délai minimum (jours)" value={S('minOrderDays')} onChange={(v) => set('minOrderDays', v)} type="number" />
          <Field label="Villes livrées (séparées par virgule)" value={S('deliveryCities')} onChange={(v) => set('deliveryCities', v)} />
        </div>
      </Section>

      {/* Couleurs */}
      <Section title="Couleurs du Site">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Couleur primaire (rose) — format: R G B</label>
            <div className="flex gap-2 items-center">
              <input value={S('primaryColor')} onChange={(e) => set('primaryColor', e.target.value)} className="input flex-1" placeholder="244 167 185" />
              <div className="w-10 h-10 rounded-lg border" style={{ backgroundColor: `rgb(${S('primaryColor') || '244 167 185'})` }} />
            </div>
          </div>
          <div>
            <label className="label">Couleur accent (or) — format: R G B</label>
            <div className="flex gap-2 items-center">
              <input value={S('accentColor')} onChange={(e) => set('accentColor', e.target.value)} className="input flex-1" placeholder="201 169 110" />
              <div className="w-10 h-10 rounded-lg border" style={{ backgroundColor: `rgb(${S('accentColor') || '201 169 110'})` }} />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-3">
          <div className="flex-1 h-12 rounded-xl" style={{ backgroundColor: `rgb(${S('primaryColor') || '244 167 185'})` }} />
          <div className="flex-1 h-12 rounded-xl" style={{ backgroundColor: `rgb(${S('accentColor') || '201 169 110'})` }} />
          <div className="flex-1 h-12 rounded-xl bg-[#FFF8F3] border" />
        </div>
      </Section>

      {/* Médias Hero */}
      <Section title="Médias Hero">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <ImageUploadField label="Logo" settingKey="logo" />
            <div className="mt-3">
              <label className="label">Taille du logo (px)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="32"
                  max="120"
                  value={S('logoSize') || '56'}
                  onChange={(e) => set('logoSize', e.target.value)}
                  className="flex-1 accent-primary"
                />
                <span className="w-14 text-center font-semibold text-primary bg-primary/10 rounded-lg py-1 text-sm">
                  {S('logoSize') || '56'}px
                </span>
              </div>
              <div className="mt-2 flex items-center justify-center bg-gray-50 rounded-xl p-3">
                {S('logo') ? (
                  <Image
                    src={S('logo')}
                    alt="Aperçu logo"
                    width={120}
                    height={120}
                    style={{ width: `${S('logoSize') || 56}px`, height: `${S('logoSize') || 56}px` }}
                    className="rounded-full object-contain"
                  />
                ) : (
                  <p className="text-xs text-gray-400">Aperçu logo</p>
                )}
              </div>
            </div>
          </div>
          <ImageUploadField label="Image principale hero" settingKey="heroImage" />
          <ImageUploadField label="Vidéo hero Desktop (paysage, max 100MB)" settingKey="heroVideo" videoOk />
          <ImageUploadField label="Vidéo hero Mobile (vertical 9:16, max 100MB)" settingKey="heroVideoMobile" videoOk />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <Field label="Badge texte" value={S('badgeText')} onChange={(v) => set('badgeText', v)} placeholder="Fait Maison Depuis 2018" />
          <Field label="Sous-titre hero" value={S('heroSubtitle')} onChange={(v) => set('heroSubtitle', v)} />
        </div>
      </Section>

      {/* Images catégories */}
      <Section title="Images Catégories">
        <div className="grid sm:grid-cols-2 gap-4">
          <ImageUploadField label="Gâteaux Custom" settingKey="catImageCustom" />
          <ImageUploadField label="Pâtisseries Marocaines" settingKey="catImageMarocaine" />
          <ImageUploadField label="Box Cadeaux" settingKey="catImageBox" />
          <ImageUploadField label="Desserts" settingKey="catImageDesserts" />
        </div>
      </Section>

      {/* Pourquoi nous */}
      <Section title="Section « Pourquoi Nous Choisir »">
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 grid sm:grid-cols-3 gap-4">
              <ImageUploadField label={`Image bloc ${i + 1}`} settingKey={`featImg${i}`} />
              <div className="sm:col-span-2 space-y-2">
                <Field label="Titre" value={S(`featTitle${i}`)} onChange={(v) => set(`featTitle${i}`, v)} />
                <Field label="Description" value={S(`featDesc${i}`)} onChange={(v) => set(`featDesc${i}`, v)} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <button onClick={save} disabled={saving} className="btn-primary w-full">
        {saving ? 'Sauvegarde...' : 'Sauvegarder tous les paramètres'}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h2 className="font-semibold text-gray-900 border-b pb-2">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
        placeholder={placeholder}
      />
    </div>
  );
}
