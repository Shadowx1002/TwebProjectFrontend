import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const reviews = [
  {
    id: 1,
    name: "Sarah Jenkins",
    country: "United Kingdom",
    rating: 5,
    text: "Sri Lanka was a dream come true! The 'Forest Hiker' tour was perfectly organized. Our guide, Amal, was incredibly knowledgeable about the local flora and fauna. Highly recommend!",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    country: "Canada",
    rating: 5,
    text: "The train ride to Ella is a must-do. Booking through this website was seamless. I appreciated the transparent pricing and the instant confirmation PDF.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Emma & Tom",
    country: "Australia",
    rating: 4,
    text: "Great value for money. The hotels selected in the 'Cultural Triangle' package were top-notch. Only wish we had stayed one more day in Sigiriya!",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: 4,
    name: "Lars Jensen",
    country: "Denmark",
    rating: 5,
    text: "Surfing in Mirissa was the highlight of my year. The team handled all logistics including surfboard rentals and transport. 10/10 experience.",
    image: "https://randomuser.me/api/portraits/men/86.jpg"
  }
];

const Reviews = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-green-50 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Traveler Stories</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          Don't just take our word for it. Hear from the people who have experienced the magic of Sri Lanka with us.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative hover:shadow-lg transition">
              <FaQuoteLeft className="text-4xl text-green-200 absolute top-6 left-6" />
              
              <div className="relative z-10 pt-4">
                <p className="text-gray-700 italic mb-6 text-lg leading-relaxed">"{review.text}"</p>
                
                <div className="flex items-center gap-4">
                  <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{review.country}</p>
                  </div>
                  <div className="ml-auto flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-green-600 rounded-2xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Have you traveled with us?</h2>
          <p className="mb-8 opacity-90">We would love to hear about your adventure.</p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;