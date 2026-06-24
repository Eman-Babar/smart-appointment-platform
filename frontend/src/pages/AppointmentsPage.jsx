import { useState, useEffect } from 'react';
import Layout from '../components/shared/Layout';
import { appointmentService } from '../services/appointmentService';
import StarRating from '../components/shared/StarRating';
import ReviewModal from '../components/shared/ReviewModal';
import { Link } from 'react-router-dom';
import API from '../services/api';

const statusStyles = {
  pending:     { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400'  },
  confirmed:   { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400'  },
  cancelled:   { bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-400'    },
  completed:   { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400'   },
  rescheduled: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
};

export default function AppointmentsPage() {
  const [appointments,  setAppointments]  = useState([]);
  const [filter,        setFilter]        = useState('all');
  const [loading,       setLoading]       = useState(true);
  const [reviewModal,   setReviewModal]   = useState(null);
  const [reviewedIds,   setReviewedIds]   = useState(new Set());

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getMine();
      const appts = res.data.appointments || [];
      setAppointments(appts);

      // Check which completed ones are already reviewed
      const completed = appts.filter(a => a.status === 'completed');
      const checks = await Promise.all(
        completed.map(a =>
          API.get(`/reviews/check/${a.id}`)
            .then(r => r.data.reviewed ? a.id : null)
            .catch(() => null)
        )
      );
      setReviewedIds(new Set(checks.filter(Boolean)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await appointmentService.cancel(id);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancel failed');
    }
  };

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter);

  const tabs = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">My Appointments</h1>
            <p className="text-sm text-white/50 mt-1">{appointments.length} total appointments</p>
          </div>
          <Link
            to="/appointments/book"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-500/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Book New
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 glass p-1 rounded-xl mb-6 w-fit border border-white/10">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === tab
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
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
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl border border-white/10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white/60 font-medium">No appointments found</p>
            <Link to="/appointments/book" className="inline-block mt-4 text-indigo-400 text-sm hover:underline">
              Book now →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(apt => {
              const s = statusStyles[apt.status] || statusStyles.pending;
              const isReviewed = reviewedIds.has(apt.id);

              return (
                <div key={apt.id} className="glass-light rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{apt.service_name}</p>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {new Date(apt.appointment_date).toLocaleDateString('en-PK', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })} · {apt.appointment_time?.slice(0, 5)}
                      </p>
                      <p className="text-sm text-gray-400">Rs. {apt.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>

                    {(apt.status === 'pending' || apt.status === 'confirmed') && (
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="text-xs text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    {apt.status === 'completed' && !isReviewed && (
                      <button
                        onClick={() => setReviewModal(apt)}
                        className="flex items-center gap-1.5 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-xl transition-colors font-medium"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Review
                      </button>
                    )}

                    {apt.status === 'completed' && isReviewed && (
                      <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-xl font-medium">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Reviewed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Review Modal */}
        {reviewModal && (
          <ReviewModal
            appointment={reviewModal}
            onClose={() => setReviewModal(null)}
            onSuccess={() => {
              fetchAppointments();
              setReviewModal(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
}