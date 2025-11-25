import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PackageDetails = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPkg = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/packages/${id}`);
        setPkg(res.data.data.pkg);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPkg();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[50vh] w-full relative">
        <img src={pkg.image} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-5xl text-white font-bold">{pkg.title}</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-8 -mt-20 bg-white rounded-xl shadow-xl relative z-10">
         <p className="text-lg text-gray-700 leading-relaxed mb-8">{pkg.description}</p>
         <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition">
            Proceed to Payment (${pkg.price})
         </button>
      </div>
    </div>
  );
};

export default PackageDetails;