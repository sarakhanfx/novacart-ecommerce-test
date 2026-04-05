import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/adminApi'
import Modal from '../components/ui/Modal'

const emptyForm = { name: '', slug: '', description: '', image_url: '' }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const data = await getCategories()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true) }
  const openEdit = (c) => {
    setEditing(c)
    setForm({ name: c.name, slug: c.slug || '', description: c.description || '', image_url: c.image_url || '' })
    setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (!form.slug) form.slug = form.name.toLowerCase().replace(/\s+/g, '-')
      if (editing) await updateCategory(editing.id, form)
      else await createCategory(form)
      await load()
      setModal(false)
    } catch (err) {
      alert('Error: ' + err.message)
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    await deleteCategory(id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Add Category</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c => (
          <div key={c.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
            <div className="flex items-center gap-3">
              {c.image_url && <img src={c.image_url} alt={c.name} className="w-12 h-12 rounded-lg object-cover" />}
              <div>
                <p className="font-semibold text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-400">{c.slug}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)} className="text-blue-600 hover:underline text-xs">Edit</button>
              <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated if empty" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
            </button>
            <button type="button" onClick={() => setModal(false)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}