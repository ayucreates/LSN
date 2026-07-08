import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Review } from '../types';

interface ReviewsProps {
  productId: string;
}

function Stars({ rating, size = 4 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`w-${size} h-${size} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

export function Reviews({ productId }: ReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await api.getReviews(productId);
      if (res.success) setReviews(res.data);
      setLoading(false);
    };
    load();
  }, [productId]);

  const handleSubmit = async () => {
    if (!comment.trim() || !user) return;
    const res = await api.addReview({ productId, userId: user.id, userName: user.name, rating, comment: comment.trim() });
    if (res.success) {
      setReviews((prev) => [res.data, ...prev]);
      setComment('');
      setRating(5);
    }
  };

  const avgRating = reviews.length ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

  if (loading) return null;

  return (
    <div className="border-t border-gold-200 pt-8 mt-8">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-gold-500" /> Customer Reviews
        {reviews.length > 0 && <span className="text-sm font-normal text-gray-400">({reviews.length})</span>}
      </h2>

      {reviews.length > 0 && (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gold-100">
          <Stars rating={avgRating} size={5} />
          <span className="text-sm font-medium text-gray-700">{avgRating.toFixed(1)} out of 5</span>
          <span className="text-sm text-gray-400">· {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {user && (
        <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Write a Review</p>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)}>
                <Star className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} hover:fill-yellow-400 transition-colors`} />
              </button>
            ))}
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts about this product..." rows={3}
            className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400 resize-none mb-2" />
          <button onClick={handleSubmit} disabled={!comment.trim()}
            className="bg-gold-600 text-white text-sm font-semibold px-4 py-1.5 rounded hover:bg-gold-700 transition-colors disabled:opacity-50">
            Submit Review
          </button>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No reviews yet. Be the first to share your experience!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="pb-4 border-b border-gold-100 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gold-100 rounded-full flex items-center justify-center text-xs font-medium text-gold-700">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{review.userName}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <Stars rating={review.rating} />
              <p className="text-sm text-gray-600 mt-1.5">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
