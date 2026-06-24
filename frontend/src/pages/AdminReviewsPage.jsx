import { useState, useEffect } from 'react';
import Layout from '../components/shared/Layout';
import StarRating from '../components/shared/StarRating';
import API from '../services/api';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    API.get('/reviews/all')
      .then(res => setReviews(res.data.reviews || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = reviews.filter(r =>
    r.user_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.service_name?.toLowerCase().includes(search.toLowerCase())
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingCounts = [5,4,3,2,1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length > 0
      ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
      : 0
  }));

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Reviews & Feedback</h1>
            <p className="text-sm text-white/50 mt-1">{reviews.length} total reviews</p>
          </div>
          <div className="relative">
            <svg className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="glass border border-white/10 text-white placeholder-white/30 rounded-xl pl-9 pr-4 py-2.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          {/* Average Rating */}
          <div className="glass-light rounded-2xl p-5 flex items-center gap-5">
            <div>
              <p className="text-5xl font-bold text-gray-900">{avgRating}</p>
              <StarRating value={Math.round(avgRating)} readonly size="sm" />
              <p className="text-xs text-gray-500 mt-1">{reviews.length} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {ratingCounts.map(({ star, count, percent }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-4">{star}</span>
                  <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-amber-400 h-1.5 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-6">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-light rounded-2xl p-5 grid grid-cols-2 gap-3">
            {[
              { label: '5 Star', value: ratingCounts[0].count, color: 'text-amber-500' },
              { label: 'Avg Rating', value: avgRating, color: 'text-indigo-600' },
              { label: 'Total Reviews', value: reviews.length, color: 'text-gray-800' },
              { label: 'This Month', value: reviews.filter(r =>
                new Date(r.created_at).getMonth() === new Date().getMonth()
              ).length, color: 'text-green-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(review => (
              <div key={review.id} className="glass-light rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">
                        {review.user_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.user_name}</p>
                      <p className="text-xs text-gray-400">{review.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StarRating value={review.rating} readonly size="sm" />
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.created_at).toLocaleDateString('en-PK', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pl-13">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
                      {review.service_name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(review.appointment_date).toLocaleDateString('en-PK', {
                        month: 'short', day: 'numeric'
                      })}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      "{review.comment}"
                    </p>
                  )}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-14 glass rounded-2xl border border-white/10">
                <p className="text-white/50 font-medium">No reviews found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}