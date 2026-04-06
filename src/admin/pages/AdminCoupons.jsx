import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../components/ui/Modal'
import toast from 'react-hot-toast'

const emptyForm = { code: '', discount_percent: '', min_order: '0', max_uses: '100', is_active: true, expires_at: '' }

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
    setCoupons(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true) }
  const openEdit = (c) => {
    setEditing(c)
    setForm({
      code: c.code,
      discount_percent: c.discount_percent,
      min_order: c.min_order,
      max_uses: c.max_uses,
      is_active: c.is_active,
      expires_at: c.expires_at ? c.expires_at.slice(0, 10) : ''
    })
    setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        code: form.code.toUpperCase(),
        discount_percent: parseFloat(form.discount_percent),
        min_order: parseFloat(form.min_order) || 0,
        max_uses: parseInt(form.max_uses) || 100,
        is_active: form.is_active,
        expires_at: form.expires_at || null
      }
      if (editing) {
        await supabase.from('coupons').update(payload).eq('id', editing.id)
      } else {
        await supabase.from('coupons').insert([payload])
      }
      toast.success(editing ? 'Coupon updated!' : 'Coupon created!')
      await load()
      setModal(false)
    } catch (err) {
      toast.error('Error: ' + err.message)
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return
    await supabase.from('coupons').delete().eq('id', id)
    toast.success('Coupon deleted!')
    setCoupons(prev => prev.filter(c => c.id !== id))
  }

  const toggleActive = async (id, current) => {
    await supabase.from('coupons').update({ is_active: !current }).eq('id', id)
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c))
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Coupons</h2>
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Add Coupon</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Code</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Discount</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Min Order</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Uses</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {coupons.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-mono font-bold text-gray-800">{c.code}</td>
                <td className="px-5 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {c.discount_percent}% OFF
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">${c.min_order}</td>
                <td className="px-5 py-3 text-gray-500">{c.used_count}/{c.max_uses}</td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleActive(c.id, c.is_active)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className="text-blue-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <p className="text-center py-10 text-gray-400">No coupons found</p>}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Coupon' : 'Add Coupon'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
            <input required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="e.g. SAVE20"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount % *</label>
              <input required type="number" min="1" max="100" value={form.discount_percent}
                onChange={e => setForm(f => ({ ...f, discount_percent: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Order $</label>
              <input type="number" min="0" value={form.min_order}
                onChange={e => setForm(f => ({ ...f, min_order: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
              <input type="number" min="1" value={form.max_uses}
                onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
              <input type="date" value={form.expires_at}
                onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" checked={form.is_active}
              onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
              className="w-4 h-4 text-blue-600" />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
            </button>
            <button type="button" onClick={() => setModal(false)}
              className="flex-1 border border-gray-200 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}