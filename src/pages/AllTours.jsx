import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const AllTours = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tours`);
        setTours(res.data.data.tours);
        setFilteredTours(res.data.data.tours);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Real-time Search Filter
  useEffect(() => {
    const results = tours.filter(tour =>
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTours(results);
  }, [searchTerm, tours]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with Custom Dark Theme */}
      <div className="bg-[#111828] text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Sri Lanka</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          From the beaches of Mirissa to the peaks of Ella. Find your perfect journey..
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full">
            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tours (e.g., 'Ella', 'Safari', 'Beach')..." 
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111828]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="w-full md:w-auto bg-[#111828] text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition">
            Search
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center text-2xl text-gray-500">Loading beautiful places...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <div key={tour._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col h-full">
                <div className="relative h-56">
                  {/* Using imageCover from DB with fallback */}
                  <img 
                    src={tour.imageCover}
                    onError={(e) => e.target.src = "https://placehold.co/600x400?text=Tour+Image"}
                    alt={tour.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[#111828] font-bold px-3 py-1 rounded-full text-sm">
                    {tour.difficulty}
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <FaMapMarkerAlt className="text-green-600" />
                    {/* Handle potential missing startLocation */}
                    {tour.startLocation?.description || 'Sri Lanka'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{tour.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {tour.summary}
                  </p>
                  
                  <div className="border-t pt-4 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xs text-gray-500 block">Starting from</span>
                      <span className="text-lg font-bold text-green-600">${tour.price}</span>
                    </div>
                    <Link to={`/tours/${tour._id}`} className="text-[#111828] font-bold hover:underline text-sm">
                      View Itinerary &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredTours.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-400">No tours found matching "{searchTerm}"</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTours;