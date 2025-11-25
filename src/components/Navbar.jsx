import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // <--- Import Hook
import toast from 'react-hot-toast'; // <--- Import Toast

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use Global State instead of Local State
  const { isLoggedIn, logout } = useAuth(); 
  
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call global logout function
    navigate("/");
    toast.success("Logged out successfully"); // Toaster notification
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center  text-xl md:text-3xl font-bold tracking-tighter">
              <img src="/logo.png" alt="Kavindu Travels" className="h-12 w-auto mr-2 object-contain" />
              <span className="hidden sm:block md:mt-4 text-[#111828]">Kavindu Travels</span>
              <span className="sm:hidden">Kavindu</span>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
  to="/" 
  className="text-gray-600 hover:text-white transition font-bold hover:bg-[#111828] p-2 rounded-xl"
  style={{ textDecorationColor: '#111828' }}
>
  Home
</Link>

<Link 
  to="/tours" 
  className="text-gray-600 hover:text-white transition font-bold hover:bg-[#111828] p-2 rounded-xl"
  style={{ textDecorationColor: '#111828' }}
>
  All Tours
</Link>

<Link 
  to="/packages" 
  className="text-gray-600 hover:text-white transition font-bold hover:bg-[#111828] p-2 rounded-xl"
  style={{ textDecorationColor: '#111828' }}
>
  Packages
</Link>

<Link 
  to="/reviews" 
  className="text-gray-600 hover:text-white transition font-bold hover:bg-[#111828] p-2 rounded-xl "
  style={{ textDecorationColor: '#111828' }}
>
  Reviews
</Link>


            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center text-gray-700 hover:text-green-600">
                  <FaUserCircle className="text-2xl mr-1" />
                  <span className="text-sm font-semibold">Profile</span>
                </Link>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-600 transition shadow-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium">Log in</Link>
                <Link to="/signup" className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-green-700 transition shadow-md">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-green-600 focus:outline-none p-2">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-green-50 rounded-md">Home</Link>
            <Link to="/tours" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-green-50 rounded-md">All Tours</Link>
            <Link to="/packages" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-green-50 rounded-md">Packages</Link>
            <Link to="/reviews" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-green-50 rounded-md">Reviews</Link>

            <div className="border-t border-gray-100 my-2 pt-2">
              {isLoggedIn ? (
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-red-500 font-bold hover:bg-red-50 rounded-md">Logout</button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-green-50 rounded-md">Log in</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-green-600 font-bold hover:bg-green-50 rounded-md">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;