import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlane, FaBoxOpen, FaCar, FaPlusCircle, FaTrash, FaImage, FaMapMarkerAlt } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('tour'); // 'tour', 'package', 'vehicle'
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Main Form State
  const [formData, setFormData] = useState({
    // Tour
    name: '', duration: '', price: '', summary: '', highlights: '', 
    description: '', maxGroupSize: '', difficulty: 'medium', startLocation: '', startDates: '',
    // Package
    title: '', days: '', features: '',
    // Vehicle
    type: '', model: '', capacity: ''
  });

  // Files for Main Cover/Gallery
  const [imageFiles, setImageFiles] = useState([]);

  // --- NEW: TIMELINE STATE ---
  const [timeline, setTimeline] = useState([
    { day: 1, title: '', description: '', stops: [] }
  ]);

  // Handle Basic Inputs
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Main File Selection
  const handleFileChange = (e) => {
    if (e.target.files) setImageFiles(Array.from(e.target.files));
  };

  // --- TIMELINE FUNCTIONS ---

  const addDay = () => {
    setTimeline([...timeline, { day: timeline.length + 1, title: '', description: '', stops: [] }]);
  };

  const removeDay = (index) => {
    const newTimeline = timeline.filter((_, i) => i !== index);
    // Re-index days
    const reIndexed = newTimeline.map((item, i) => ({ ...item, day: i + 1 }));
    setTimeline(reIndexed);
  };

  const updateDay = (index, field, value) => {
    const newTimeline = [...timeline];
    newTimeline[index][field] = value;
    setTimeline(newTimeline);
  };

  const addStop = (dayIndex) => {
    const newTimeline = [...timeline];
    newTimeline[dayIndex].stops.push({ name: '', type: 'Attraction', description: '', image: '' });
    setTimeline(newTimeline);
  };

  const removeStop = (dayIndex, stopIndex) => {
    const newTimeline = [...timeline];
    newTimeline[dayIndex].stops = newTimeline[dayIndex].stops.filter((_, i) => i !== stopIndex);
    setTimeline(newTimeline);
  };

  const updateStop = (dayIndex, stopIndex, field, value) => {
    const newTimeline = [...timeline];
    newTimeline[dayIndex].stops[stopIndex][field] = value;
    setTimeline(newTimeline);
  };

  // --- SPECIFIC UPLOAD FOR TIMELINE STOP IMAGES ---
  const handleStopImageUpload = async (e, dayIndex, stopIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.loading("Uploading stop image...", { id: 'uploadStop' });
      const fileName = `stop-${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      
      const { error } = await supabase.storage.from('img').upload(fileName, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('img').getPublicUrl(fileName);
      
      // Update state with URL immediately
      updateStop(dayIndex, stopIndex, 'image', publicUrl);
      toast.success("Image added!", { id: 'uploadStop' });

    } catch (err) {
      console.error(err);
      toast.error("Upload failed", { id: 'uploadStop' });
    }
  };

  // --- MAIN SUBMIT LOGIC ---
  
  const uploadImagesToSupabase = async (files) => {
    try {
      setUploading(true);
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const { error } = await supabase.storage.from('img').upload(fileName, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('img').getPublicUrl(fileName);
        return publicUrl;
      });
      return await Promise.all(uploadPromises);
    } catch (error) {
      toast.error("Image upload failed!");
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Upload Main Images
      let imageUrls = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImagesToSupabase(imageFiles);
      } else {
        throw new Error("Please upload a main cover image");
      }

      if (activeTab === 'tour') {
        const highlightsArray = formData.highlights.split(',').map(h => h.trim());
        const startDatesArray = formData.startDates.split(',').map(d => d.trim());

        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tours`, {
          name: formData.name,
          duration: Number(formData.duration),
          price: Number(formData.price),
          summary: formData.summary,
          description: formData.description,
          imageCover: imageUrls[0],
          images: imageUrls.slice(1),
          highlights: highlightsArray,
          maxGroupSize: Number(formData.maxGroupSize),
          startLocation: { description: formData.startLocation },
          timeline: timeline // <--- SENDING THE TIMELINE DATA
        });
        toast.success('Tour Created Successfully!');
      } 
      // ... (Package & Vehicle logic remains similar) ...
      else if (activeTab === 'package') {
        const featuresArray = formData.features.split(',').map(f => f.trim());
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/packages`, {
          title: formData.title,
          days: Number(formData.days),
          price: Number(formData.price),
          image: imageUrls[0],
          description: formData.description,
          features: featuresArray
        });
        toast.success('Package Created!');
      } else if (activeTab === 'vehicle') {
        const featuresArray = formData.features.split(',').map(f => f.trim());
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles`, {
          type: formData.type,
          model: formData.model,
          capacity: Number(formData.capacity),
          image: imageUrls[0],
          features: featuresArray
        });
        toast.success('Vehicle Added!');
      }
      
      // Reset Form (Simplified)
      window.location.reload(); // Quick way to reset all complex states
      
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-[#111828] p-8 text-white flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <div className="flex space-x-2 mt-4 md:mt-0">
            {['tour', 'package', 'vehicle'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize px-4 py-2 rounded-full font-bold transition-all ${activeTab === tab ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="p-8 md:p-12 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            
            {/* Main Image Upload */}
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg bg-gray-50 text-center">
               <label className="block font-bold mb-2">Main Cover & Gallery Images</label>
               <input type="file" multiple onChange={handleFileChange} required />
               <p className="text-sm text-gray-500 mt-2">{imageFiles.length} images selected</p>
            </div>

            {activeTab === 'tour' && (
              <>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="name" placeholder="Tour Name" value={formData.name} onChange={handleChange} className="p-3 border rounded" required />
                    <input name="duration" type="number" placeholder="Days" value={formData.duration} onChange={handleChange} className="p-3 border rounded" required />
                    <input name="price" type="number" placeholder="Price ($)" value={formData.price} onChange={handleChange} className="p-3 border rounded" required />
                    <input name="maxGroupSize" type="number" placeholder="Max Group Size" value={formData.maxGroupSize} onChange={handleChange} className="p-3 border rounded" required />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <input name="startLocation" placeholder="Start Location" value={formData.startLocation} onChange={handleChange} className="p-3 border rounded" required />
                 </div>

                   <input name="highlights" placeholder="Highlights (Sigiriya, Kandy, Beach)" value={formData.highlights} onChange={handleChange} className="w-full p-3 border rounded" required />
                 
                 <textarea name="summary" placeholder="Summary (Short)" value={formData.summary} onChange={handleChange} className="w-full p-3 border rounded h-20" required />
                 <textarea name="description" placeholder="Full Description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded h-32" required />

                 {/* --- TIMELINE BUILDER --- */}
                 <div className="mt-8 border-t pt-8">
                   <h2 className="text-2xl font-bold text-gray-800 mb-4">Journey Timeline</h2>
                   {timeline.map((day, dayIndex) => (
                     <div key={dayIndex} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6 relative">
                       <button type="button" onClick={() => removeDay(dayIndex)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                         <FaTrash />
                       </button>
                       <h3 className="font-bold text-lg mb-4 text-green-700">Day {day.day}</h3>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                         <input 
                           placeholder={`Day ${day.day} Title (e.g. Arrival)`} 
                           value={day.title} 
                           onChange={(e) => updateDay(dayIndex, 'title', e.target.value)} 
                           className="p-3 border rounded" 
                         />
                         <input 
                           placeholder="Day Description" 
                           value={day.description} 
                           onChange={(e) => updateDay(dayIndex, 'description', e.target.value)} 
                           className="p-3 border rounded" 
                         />
                       </div>

                       {/* Stops Builder */}
                       <div className="pl-4 border-l-2 border-green-200">
                         <h4 className="font-bold text-gray-600 mb-2">Stops / Attractions</h4>
                         {day.stops.map((stop, stopIndex) => (
                           <div key={stopIndex} className="bg-white p-4 rounded-lg border border-gray-200 mb-3 relative">
                              <button type="button" onClick={() => removeStop(dayIndex, stopIndex)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-sm">
                                <FaTrash />
                              </button>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                                <input 
                                  placeholder="Place Name" 
                                  value={stop.name} 
                                  onChange={(e) => updateStop(dayIndex, stopIndex, 'name', e.target.value)} 
                                  className="p-2 border rounded text-sm" 
                                />
                                <select 
                                  value={stop.type} 
                                  onChange={(e) => updateStop(dayIndex, stopIndex, 'type', e.target.value)} 
                                  className="p-2 border rounded text-sm"
                                >
                                  <option value="Attraction">Attraction</option>
                                  <option value="Hotel">Hotel</option>
                                  <option value="Restaurant">Restaurant</option>
                                  <option value="Activity">Activity</option>
                                </select>
                                
                                {/* STOP IMAGE UPLOAD */}
                                <div className="relative">
                                  {stop.image ? (
                                    <div className="text-green-600 text-xs flex items-center">
                                      <FaImage className="mr-1"/> Image Uploaded
                                    </div>
                                  ) : (
                                    <input 
                                      type="file" 
                                      accept="image/*"
                                      onChange={(e) => handleStopImageUpload(e, dayIndex, stopIndex)}
                                      className="text-xs"
                                    />
                                  )}
                                </div>
                              </div>
                              <input 
                                placeholder="Details about this stop..." 
                                value={stop.description} 
                                onChange={(e) => updateStop(dayIndex, stopIndex, 'description', e.target.value)} 
                                className="w-full p-2 border rounded text-sm" 
                              />
                           </div>
                         ))}
                         <button type="button" onClick={() => addStop(dayIndex)} className="text-sm text-green-600 font-bold flex items-center mt-2 hover:underline">
                           <FaPlusCircle className="mr-1"/> Add Stop
                         </button>
                       </div>
                     </div>
                   ))}
                   <button type="button" onClick={addDay} className="w-full py-3 border-2 border-dashed border-gray-400 text-gray-500 rounded-xl hover:bg-gray-50 hover:border-green-500 hover:text-green-600 transition flex items-center justify-center font-bold">
                     <FaPlusCircle className="mr-2"/> Add Day {timeline.length + 1}
                   </button>
                 </div>
              </>
            )}

            {/* PACKAGE & VEHICLE FORMS (Simplified to save space, logic is same as previous version) */}
            {activeTab === 'package' && (
              <>
                 <input name="title" placeholder="Package Title" value={formData.title} onChange={handleChange} className="w-full p-3 border rounded" required />
                 <input name="days" type="number" placeholder="Days" value={formData.days} onChange={handleChange} className="w-full p-3 border rounded" required />
                 <input name="price" type="number" placeholder="Price ($)" value={formData.price} onChange={handleChange} className="w-full p-3 border rounded" required />
                 <input name="features" placeholder="Features (comma separated)" value={formData.features} onChange={handleChange} className="w-full p-3 border rounded" required />
                 <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded h-32" required />
              </>
            )}

            {activeTab === 'vehicle' && (
              <>
                 <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} className="w-full p-3 border rounded" required />
                 <input name="type" placeholder="Type" value={formData.type} onChange={handleChange} className="w-full p-3 border rounded" required />
                 <input name="capacity" type="number" placeholder="Capacity" value={formData.capacity} onChange={handleChange} className="w-full p-3 border rounded" required />
                 <input name="features" placeholder="Features" value={formData.features} onChange={handleChange} className="w-full p-3 border rounded" required />
              </>
            )}

            <button type="submit" disabled={loading || uploading} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition shadow-lg">
              {uploading ? 'Uploading Images...' : 'Create'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;