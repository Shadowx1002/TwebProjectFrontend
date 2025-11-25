import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/home';
import TourDetails from './pages/TourDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AllTours from './pages/AllTours';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails'; // <--- New Import
import Reviews from './pages/Reviews';
import AdminDashboard from './pages/AdminDashboard'; // <--- New Import

function App() {
  return (
    <BrowserRouter>
      {/* Configure Toaster here */}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      
      <div className="flex flex-col min-h-screen font-sans text-gray-900">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tours" element={<AllTours />} />
            <Route path="/tours/:id" element={<TourDetails />} />
            
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:id" element={<PackageDetails />} /> 
            
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/admin" element={<AdminDashboard />} /> 
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
