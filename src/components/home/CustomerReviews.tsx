import { reviews } from '@/lib/data';

export default function CustomerReviews() {
  return (
    <section className="bg-gray-50 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-7 sm:mb-10">
          <h2 className="text-lg sm:text-2xl font-bold tracking-wide uppercase">Müşteri Yorumları</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">Müşterilerimizin deneyimlerini paylaştı</p>
          <div className="flex items-center justify-center gap-0.5 mt-2 sm:mt-3">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs sm:text-sm text-gray-600 ml-2 font-medium">4.9 / 5</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white p-4 sm:p-5 shadow-sm border border-gray-100">
              <div className="flex gap-0.5 mb-2 sm:mb-3">
                {Array.from({length: 5}).map((_, i) => (
                  <svg key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`}
                    fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3 sm:mb-4">"{review.comment}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold">{review.name}</p>
                  {review.product && (
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{review.product}</p>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  {new Date(review.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
