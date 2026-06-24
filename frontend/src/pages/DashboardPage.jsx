import { useState, useEffect } from 'react';
import Layout from '../components/shared/Layout';
import { useAuth } from '../context/AuthContext';
import { appointmentService, recommendationService } from '../services/appointmentService';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, color, bg, icon }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
      <span className={`text-xl ${color}`}>{icon}</span>
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  </div>
);

const statusStyles = {
  pending:     { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400'  },
  confirmed:   { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400'  },
  cancelled:   { bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-400'    },
  completed:   { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400'   },
  rescheduled: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [appointments,    setAppointments]    = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      appointmentService.getMine(),
      recommendationService.get(),
    ]).then(([apptRes, recRes]) => {
      setAppointments(apptRes.data.appointments || []);
      setRecommendations(recRes.data.recommendations || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const upcoming  = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const completed = appointments.filter(a => a.status === 'completed');

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good day, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">Here's your appointment overview</p>
          </div>
          <Link
            to="/appointments/book"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Book Appointment
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Appointments" value={appointments.length} icon="📋" bg="bg-gray-50"    color="text-gray-600" />
          <StatCard label="Upcoming"           value={upcoming.length}    icon="⏰" bg="bg-indigo-50"  color="text-indigo-600" />
          <StatCard label="Completed"          value={completed.length}   icon="✅" bg="bg-green-50"   color="text-green-600" />
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h2 className="text-sm font-semibold text-white">AI Recommendations for you</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendations.map((rec, i) => (
                <Link
                  key={i}
                  to="/appointments/book"
                  className="bg-white/15 hover:bg-white/25 backdrop-blur text-white text-sm px-4 py-2 rounded-xl border border-white/20 transition-colors"
                >
                  {rec.service_name} · {rec.preferred_day} {rec.preferred_time}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Upcoming Appointments</h2>
            <Link to="/appointments" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-14">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm font-medium">No upcoming appointments</p>
              <Link to="/appointments/book" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">
                Book your first appointment →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcoming.map(apt => {
                const s = statusStyles[apt.status] || statusStyles.pending;
                return (
                  <div key={apt.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{apt.service_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(apt.appointment_date).toLocaleDateString('en-PK', {
                            weekday: 'long', month: 'long', day: 'numeric'
                          })} · {apt.appointment_time?.slice(0, 5)}
                        </p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}