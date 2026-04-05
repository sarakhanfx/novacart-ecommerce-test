import { useEffect, useState } from 'react'
import { getSettings, updateSettings } from '../api/adminApi'

export default function AdminSettings() {
  const [settings, setSettings] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getSettings().then(data => {
      setSettings(data)
      setForm(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSettings(settings.id, {
        store_name: form.store_name,
        tagline: form.tagline,
        currency: form.currency,
        shipping_fee: parseFloat(form.shipping_fee),
        tax_percent: parseFloat(form.tax_percent),
        contact_email: form.contact_email,
        support_phone: form.support_phone,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Error: ' + err.message)
    }
    setSaving(false)
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div></div>
  if (!settings) return <p className="text-red-500">Settings table not found. Run the SQL in Supabase first.</p>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Store Settings</h2>
      <form onSubmit={handleSave} className="max-w-xl space-y-5">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm">General</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input value={form.store_name || ''} onChange={e => set('store_name', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input value={form.tagline || ''} onChange={e => set('tagline', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select value={form.currency || 'USD'} onChange={e => set('currency', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="PKR">PKR (₨)</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm">Pricing</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Fee</label>
              <input type="number" step="0.01" min="0" value={form.shipping_fee || 0} onChange={e => set('shipping_fee', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax %</label>
              <input type="number" step="0.01" min="0" max="100" value={form.tax_percent || 0} onChange={e => set('tax_percent', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm">Contact</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
            <input type="email" value={form.contact_email || ''} onChange={e => set('contact_email', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
            <input value={form.support_phone || ''} onChange={e => set('support_phone', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && <span className="text-green-600 text-sm font-medium">✓ Saved successfully!</span>}
        </div>
      </form>
    </div>
  )
}