import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <h3 className="text-white text-2xl font-bold mb-4">Natours</h3>
          <p className="text-sm leading-relaxed">
            Making your travel dreams a reality with unforgettable experiences and eco-friendly tours around the globe.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-500 transition">About Us</a></li>
            <li><a href="#" className="hover:text-green-500 transition">Careers</a></li>
            <li><a href="#" className="hover:text-green-500 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-green-500 transition">Contact</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-500 transition">Help Center</a></li>
            <li><a href="#" className="hover:text-green-500 transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-green-500 transition">Legal</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-2xl hover:text-green-500 transition"><FaFacebook /></a>
            <a href="#" className="text-2xl hover:text-green-500 transition"><FaTwitter /></a>
            <a href="#" className="text-2xl hover:text-green-500 transition"><FaInstagram /></a>
            <a href="#" className="text-2xl hover:text-green-500 transition"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Natours Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;