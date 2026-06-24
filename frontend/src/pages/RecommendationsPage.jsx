import { useState, useEffect } from 'react';
import Layout from '../components/shared/Layout';
import { recommendationService, serviceService } from '../services/appointmentService';
import { Link } from 'react-router-dom';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [services,        setServices]        = useState([]);
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      recommendationService.get(),
      serviceService.getAll(),
    ]).then(([recRes, svcRes]) => {
      setRecommendations(recRes.data.recommendations || []);
      setServices(svcRes.data.services || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recommendations</h1>
          <p className="text-sm text-gray-500 mt-1">Personalized suggestions based on your booking history</p>
        </div>

        {recommendations.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommended for you</p>
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{rec.service_name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Best for you:{' '}
                      <span className="font-medium text-indigo-600">
                        {rec.preferred_day} · {rec.preferred_time}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Based on {rec.total_score} booking(s)</p>
                  </div>
                </div>
                <Link
                  to="/appointments/book"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-xl transition-colors shadow-sm shadow-indigo-200 whitespace-nowrap"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="font-semibold text-gray-700">No recommendations yet</p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
              Book a few appointments and our AI will start suggesting the best slots for you
            </p>
            <Link
              to="/appointments/book"
              className="inline-block mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-6 py-2.5 rounded-xl transition-colors shadow-sm shadow-indigo-200"
            >
              Book First Appointment
            </Link>
          </div>
        )}

        {/* All Services */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">All Available Services</p>
          <div className="grid grid-cols-2 gap-3">
            {services.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{s.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium text-indigo-600">Rs. {s.price}</span>
                    <span className="mx-1">·</span>
                    <span>{s.duration_minutes} min</span>
                  </div>
                  <Link to="/appointments/book" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    Book →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}