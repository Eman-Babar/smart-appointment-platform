import { useState, useEffect } from 'react';
import Layout from '../components/shared/Layout';
import { serviceService } from '../services/appointmentService';

const empty = { name: '', description: '', duration_minutes: 30, price: '', category: '' };

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [form,     setForm]     = useState(empty);
  const [editing,  setEditing]  = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const fetchServices = async () => {
    const res = await serviceService.getAll();
    setServices(res.data.services || []);
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) await serviceService.update(editing, form);
      else         await serviceService.create(form);
      setForm(empty);
      setEditing(null);
      setShowForm(false);
      fetchServices();
    } catch { alert('Failed to save service'); }
    finally  { setLoading(false); }
  };

  const handleEdit = (s) => {
    setForm({
      name: s.name, description: s.description || '',
      duration_minutes: s.duration_minutes, price: s.price, category: s.category || ''
    });
    setEditing(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    await serviceService.delete(id);
    fetchServices();
  };

  const categoryColors = {
    medical:  { bg: 'bg-blue-50',   text: 'text-blue-700'   },
    dental:   { bg: 'bg-cyan-50',   text: 'text-cyan-700'   },
    optical:  { bg: 'bg-teal-50',   text: 'text-teal-700'   },
    therapy:  { bg: 'bg-purple-50', text: 'text-purple-700' },
    beauty:   { bg: 'bg-pink-50',   text: 'text-pink-700'   },
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services</h1>
            <p className="text-sm text-gray-500 mt-1">{services.length} active services</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              showForm
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
            }`}
          >
            {showForm ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Service
              </>
            )}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-4">
              {editing ? 'Edit Service' : 'New Service'}
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: 'Service Name', key: 'name',             type: 'text',   placeholder: 'e.g. Dental Checkup' },
                { label: 'Category',     key: 'category',         type: 'text',   placeholder: 'e.g. dental, medical' },
                { label: 'Duration (minutes)', key: 'duration_minutes', type: 'number', placeholder: '30' },
                { label: 'Price (Rs.)',   key: 'price',            type: 'number', placeholder: '500' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                    required
                  />
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={2}
                placeholder="Brief description of the service..."
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 shadow-sm shadow-indigo-200"
            >
              {loading ? 'Saving...' : editing ? 'Update Service' : 'Create Service'}
            </button>
          </form>
        )}

        {/* Services List */}
        <div className="space-y-3">
          {services.map(s => {
            const cat = categoryColors[s.category] || { bg: 'bg-gray-50', text: 'text-gray-600' };
            return (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900">{s.name}</p>
                      {s.category && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${cat.bg} ${cat.text}`}>
                          {s.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{s.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-gray-500">
                        <span className="font-semibold text-indigo-600">Rs. {s.price}</span>
                      </span>
                      <span className="text-gray-200">|</span>
                      <span className="text-xs text-gray-500">{s.duration_minutes} min</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="flex items-center gap-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-xl transition-colors font-medium"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="flex items-center gap-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl transition-colors font-medium"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </Layout>
  );
}