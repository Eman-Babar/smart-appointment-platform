import { useState, useEffect } from 'react';
import Layout from '../components/shared/Layout';
import StarRating from '../components/shared/StarRating';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/reviews/my')
      .then(res => setReviews(res.data.reviews || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">My Reviews</h1>
          <p className="text-sm text-white/50 mt-1">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} submitted
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass rounded-2xl border border-white/10 p-14 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-white/60 font-semibold">No reviews yet</p>
            <p className="text-white/30 text-sm mt-1 max-w-xs mx-auto">
              Complete an appointment and share your feedback
            </p>
            <Link
              to="/appointments"
              className="inline-block mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-6 py-2.5 rounded-xl transition-colors"
            >
              View My Appointments
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="glass-light rounded-2xl p-5">

                {/* Service + Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.service_name}</p>
                      <p className="text-xs text-gray-400">
                        Appointment: {new Date(review.appointment_date).toLocaleDateString('en-PK', {
                          month: 'long', day: 'numeric', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StarRating value={review.rating} readonly size="sm" />
                    <p className="text-xs text-gray-400 mt-1">
                      Reviewed: {new Date(review.created_at).toLocaleDateString('en-PK', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Rating Label */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    review.rating === 5 ? 'bg-green-50 text-green-700' :
                    review.rating === 4 ? 'bg-blue-50 text-blue-700' :
                    review.rating === 3 ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][review.rating]}
                  </span>
                </div>

                {/* Comment */}
                {review.comment ? (
                  <div className="bg-gray-50 rounded-xl p-3.5">
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No comment added</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}