import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaTag, FaCheckCircle } from 'react-icons/fa';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Log to console to prove we are fetching
        console.log("Fetching packages from:", `${import.meta.env.VITE_BACKEND_URL}/api/packages`);
        
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/packages`);
        
        console.log("Database Response:", res.data); 
        setPackages(res.data.data.packages);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to load packages. Please check if your backend is running.");
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-2xl text-green-600 animate-pulse font-bold">Loading Live Packages from Database...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-xl text-red-500 font-bold">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Header */}
      <div className="bg-gray-900 text-white py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
        <h1 className="text-5xl md:text-6xl font-bold relative z-10 mb-4 animate-fade-in-down tracking-tight">
          Exclusive Packages
        </h1>
        <p className="text-xl text-gray-300 relative z-10 animate-fade-in-up max-w-2xl mx-auto">
          Curated experiences designed for luxury, adventure, and relaxation.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {packages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold text-gray-400">No packages found in Database.</h3>
            <p className="text-gray-500 mt-2">Go to Admin Dashboard to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {packages.map((pkg) => (
              <div 
                key={pkg._id} 
                className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group"
              >
                {/* Image Section */}
                <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    onError={(e) => e.target.src = "https://placehold.co/600x400?text=Package+Image"} // Fallback image
                  />
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <FaCalendarAlt /> {pkg.days} Days
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 lg:w-3/5 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                      {pkg.title}
                    </h2>
                    
                    <div className="flex items-baseline mb-6">
                      <span className="text-3xl font-bold text-green-600">${pkg.price}</span>
                      <span className="text-sm text-gray-400 font-medium ml-2">/ per person</span>
                    </div>
                    
                    <div className="mb-8">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Includes:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {pkg.features.map((feat, i) => (
                          <li key={i} className="flex items-center text-gray-600 text-sm">
                            <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/packages/${pkg._id}`} 
                    className="block w-full text-center bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-green-600 hover:shadow-lg transition-all duration-300"
                  >
                    View Details & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;