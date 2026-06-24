import { useState, useEffect } from 'react';
import Layout from '../components/shared/Layout';
import { appointmentService } from '../services/appointmentService';

const statusStyles = {
  pending:     { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400'  },
  confirmed:   { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400'  },
  cancelled:   { bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-400'    },
  completed:   { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400'   },
  rescheduled: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [filter,       setFilter]       = useState('all');
  const [search,       setSearch]       = useState('');
  const [loading,      setLoading]      = useState(true);

  const fetchAll = async () => {
    try {
      const res = await appointmentService.getAll();
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleApprove = async (id) => {
    try {
      await appointmentService.approve(id);
      fetchAll();
    } catch { alert('Action failed'); }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this appointment?')) return;
    try {
      await appointmentService.reject(id);
      fetchAll();
    } catch { alert('Action failed'); }
  };

  const handleComplete = async (id) => {
    try {
      await appointmentService.complete(id);
      fetchAll();
    } catch { alert('Action failed'); }
};

  const filtered = appointments
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a =>
      a.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.service_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase())
    );

  const tabs = ['all','pending','confirmed','completed','cancelled'];
  const pending = appointments.filter(a => a.status === 'pending').length;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-sm text-gray-500 mt-1">
              {appointments.length} total
              {pending > 0 && (
                <span className="ml-2 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {pending} pending
                </span>
              )}
            </p>
          </div>
          <div className="relative">
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search customer or service..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Customer','Service','Date & Time','Status','Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(apt => {
                  const s = statusStyles[apt.status] || statusStyles.pending;
                  return (
                    <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-600 text-xs font-semibold">
                              {apt.user_name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{apt.user_name}</p>
                            <p className="text-xs text-gray-400">{apt.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-700">{apt.service_name}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-700">
                          {new Date(apt.appointment_date).toLocaleDateString('en-PK', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-400">{apt.appointment_time?.slice(0,5)}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium w-fit ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {apt.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(apt.id)}
                              className="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
                          >
                              Approve
                            </button>

                            <button
                              onClick={() => handleReject(apt.id)}
                              className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleComplete(apt.id)}
                            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
                          >
                            Complete
                          </button>
                     )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-14">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No appointments found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}