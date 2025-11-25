import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaClock, FaUserFriends, FaMapMarkerAlt, FaStar, FaCar, FaUtensils, FaBed, FaCamera } from 'react-icons/fa';

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tours/${id}`);
        setTour(res.data.data.tour);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center text-[#111828] text-2xl font-bold">Loading your adventure...</div>;
  if (!tour) return <div className="h-screen flex items-center justify-center">Tour not found</div>;

  // Helper for icons based on stop type
  const getStopIcon = (type) => {
    switch (type) {
      case 'Hotel': return <FaBed />;
      case 'Restaurant': return <FaUtensils />;
      case 'Attraction': return <FaCamera />;
      default: return <FaMapMarkerAlt />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10 }}
          src={tour.imageCover} 
          alt={tour.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111828] via-transparent to-transparent opacity-90"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl"
          >
            {tour.name}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-6 text-white text-lg font-medium"
          >
             <span className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-full"><FaClock /> {tour.duration} Days</span>
             <span className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full"><FaMapMarkerAlt /> {tour.startLocation.description}</span>
             <span className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full"><FaUserFriends /> Max {tour.maxGroupSize}</span>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* --- LEFT COLUMN: ITINERARY --- */}
        <div className="lg:col-span-2">
          
          {/* Highlights Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-green-500 mb-12"
          >
            <h2 className="text-2xl font-bold text-[#111828] mb-6 flex items-center gap-2">
              <FaStar className="text-yellow-400" /> What You Will See
            </h2>
            <div className="flex flex-wrap gap-3">
              {tour.highlights && tour.highlights.length > 0 ? (
                tour.highlights.map((h, i) => (
                  <span key={i} className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-semibold border border-green-100">
                    {h}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">Highlights loaded dynamically based on tour.</p>
              )}
            </div>
            <p className="mt-6 text-gray-600 leading-relaxed text-lg">{tour.description}</p>
          </motion.div>

          {/* THE JOURNEY TIMELINE */}
          <h2 className="text-3xl font-bold text-[#111828] mb-10 pl-4 border-l-8 border-[#111828]">The Journey</h2>
          
          <div className="relative border-l-4 border-gray-200 ml-4 md:ml-8 space-y-16">
            {(tour.timeline && tour.timeline.length > 0 ? tour.timeline : [1,2,3]).map((day, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative pl-8 md:pl-12"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[14px] top-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                
                {/* Day Header */}
                <h3 className="text-2xl font-bold text-[#111828] mb-2">Day {index + 1}: {day.title || `Adventure Day ${index + 1}`}</h3>
                <p className="text-gray-500 mb-6 italic">{day.description || "Detailed exploration of the area."}</p>

                {/* Stops within the Day */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mock stops if data missing, just for display */}
                  {(day.stops || [{name: "Grand Hotel", type: "Hotel", image: "https://placehold.co/400x300"}, {name: "Local Spice Garden", type: "Attraction", image: "https://placehold.co/400x300"}]).map((stop, i) => (
                    <div key={i} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
                      <div className="h-48 overflow-hidden relative">
                         <img src={stop.image} alt={stop.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500"/>
                         <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                            {getStopIcon(stop.type)} {stop.type}
                         </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-lg text-gray-800">{stop.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{stop.description || "Experience the best of local culture and comfort."}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* --- RIGHT COLUMN: VEHICLE & BOOKING --- */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            
            {/* Vehicle Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#111828] text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FaCar className="text-9xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaCar className="text-green-500"/> Your Ride</h3>
              
              {tour.vehicle ? (
                <>
                  <img src={tour.vehicle.image} alt={tour.vehicle.model} className="w-full h-40 object-cover rounded-lg mb-4"/>
                  <h4 className="text-lg font-bold">{tour.vehicle.model}</h4>
                  <p className="text-gray-400 text-sm mb-4">{tour.vehicle.type}</p>
                  <ul className="text-sm space-y-2">
                    {tour.vehicle.features.map((f, i) => <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> {f}</li>)}
                  </ul>
                </>
              ) : (
                <div className="text-center py-4">
                   <p className="text-gray-400">Standard Luxury Transport</p>
                   <p className="text-xs text-gray-500">AC / Wifi / Reclining Seats</p>
                </div>
              )}
            </motion.div>

            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-8 border-green-500">
               <div className="flex justify-between items-end mb-6">
                 <div>
                    <p className="text-gray-500 text-sm">Total Price</p>
                    <h3 className="text-4xl font-bold text-[#111828]">${tour.price}</h3>
                 </div>
                 <div className="text-right">
                    <div className="flex text-yellow-400 text-sm mb-1">
                       {[...Array(5)].map((_,i) => <FaStar key={i} />)}
                    </div>
                    <span className="text-gray-400 text-xs">{tour.ratingsQuantity} reviews</span>
                 </div>
               </div>

               <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 hover:shadow-lg transition transform active:scale-95 mb-4">
                 Book Now
               </button>
               <button className="w-full bg-white border-2 border-[#111828] text-[#111828] py-3 rounded-xl font-bold hover:bg-gray-100 transition">
                 Download PDF
               </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default TourDetails;