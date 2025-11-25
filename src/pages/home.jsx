import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaLeaf, FaHeart } from 'react-icons/fa';

const Home = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tours`);
        setTours(res.data.data.tours);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tours.');
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <div className="bg-gray-50">
      
      {/* HERO SECTION */}
      <div 
  className="relative h-[85vh] bg-cover bg-center flex items-center justify-center text-center px-4"
  style={{ 
    backgroundImage: `
      linear-gradient(to right bottom, rgba(17, 24, 40, 0.85), rgba(17, 24, 40, 0.85)),
      url("/Mimage.jpg")
    `
  }}
>

        <div className="text-white max-w-4xl animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-md">
            Outdoors is where <br /> life happens
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-light tracking-wide opacity-90">
            Join thousands of travelers exploring the world's best hidden gems.
          </p>
          <a href="#tours" className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 hover:-translate-y-1 hover:shadow-xl transition transform duration-300 inline-block">
            Discover our tours
          </a>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
           <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition border-t-4 border-green-500">
             <FaMapMarkedAlt className="text-6xl text-green-500 mx-auto mb-4" />
             <h3 className="text-xl font-bold mb-2">Expert Guides</h3>
             <p className="text-gray-600">Our guides are experts in their fields and local areas, ensuring you don't miss a thing.</p>
           </div>
           <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition border-t-4 border-green-500">
             <FaLeaf className="text-6xl text-green-500 mx-auto mb-4" />
             <h3 className="text-xl font-bold mb-2">Eco-Friendly</h3>
             <p className="text-gray-600">We care about the planet. All our tours are carbon neutral and support local conservation.</p>
           </div>
           <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition border-t-4 border-green-500">
             <FaHeart className="text-6xl text-green-500 mx-auto mb-4" />
             <h3 className="text-xl font-bold mb-2">Memorable</h3>
             <p className="text-gray-600">We don't just sell tours; we sell memories that will last a lifetime for you and your family.</p>
           </div>
        </div>
      </section>

      {/* TOURS GRID SECTION */}
      <section id="tours" className="max-w-7xl mx-auto p-8 pb-24">
        <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 uppercase tracking-widest">
          Most Popular Tours
        </h2>
        
        {loading && <div className="text-center text-2xl">Loading adventures...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {tours.map((tour) => (
            <div key={tour._id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-64 relative overflow-hidden">
                 {/* Image Zoom Effect */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img 
                    src="https://placehold.co/600x400?text=Nature+Escape" 
                    alt={tour.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute bottom-4 right-4 z-20 bg-green-500 text-white px-4 py-2 text-lg font-bold rounded shadow-lg">
                      ${tour.price}
                  </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 uppercase font-sans tracking-tight">{tour.name}</h3>
                <div className="flex justify-between text-sm text-gray-500 mb-6 font-bold uppercase tracking-wide">
                  <span className="text-green-600">{tour.difficulty}</span>
                  <span>{tour.duration} day tour</span>
                </div>
                <p className="text-gray-600 text-base mb-6 italic border-l-4 border-green-200 pl-4">
                  "{tour.summary}"
                </p>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                   <div className="flex items-center gap-1 text-gray-600">
                      <span className="font-bold text-lg">{tour.ratingsAverage}</span>
                      <span className="text-xs text-gray-400">rating ({tour.ratingsQuantity})</span>
                   </div>
                   
                   <Link 
                     to={`/tours/${tour._id}`} 
                     className="bg-green-100 text-green-600 px-6 py-3 rounded-full font-bold hover:bg-green-600 hover:text-white transition duration-300"
                   >
                      Details
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
           <button className="text-green-600 font-bold underline text-lg hover:text-green-800">View all tours &rarr;</button>
        </div>
      </section>

    </div>
  );
};

export default Home;