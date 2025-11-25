import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
    setUserRole(role);
    setPermissions(perms);
  }, []);

  const hasAccess = (requiredPermission) => {
    if (userRole === 'admin' || userRole === 'hod' || userRole === 'secretary') return true;
    return permissions.includes(requiredPermission);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-4 text-[#663B91] w-full h-[80px] relative bg-white shadow-sm z-50">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="object-cover h-[60px] md:h-[100px] p-2 md:p-5" />
      </div>

      <nav className="hidden md:flex gap-6 text-lg font-semibold items-center">
        {userRole && (
          <>
            {hasAccess('access_admin_dashboard') && (
              <Link to="/dashboard" className="hover:text-white transition-colors duration-300 hover:bg-[#663B91] px-4 py-1 rounded-full">Dashboard</Link>
            )}
            {hasAccess('manage_batches') && (
              <Link to="/batches" className="hover:text-white transition-colors duration-300 hover:bg-[#663B91] px-4 py-1 rounded-full">Batches</Link>
            )}

            {/* TIMETABLE DROPDOWN */}
            {/* Only show if they have *some* timetable access or are managers */}
            {(hasAccess('manage_timetable') || userRole === 'hod' || userRole === 'admin' || userRole === 'secretary') && (
                <div className="relative group">
                    <button className="hover:text-white transition-colors duration-300 hover:bg-[#663B91] px-4 py-1 rounded-full flex items-center gap-1 cursor-default">
                        Timetables ▾
                    </button>
                    <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 hidden group-hover:block min-w-[200px] border border-gray-100 z-50">
                        {/* Link 1: Manage (Add/Edit) */}
                        {hasAccess('manage_timetable') && (
                            <Link to="/edittimetable" className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Manage Slots</Link>
                        )}
                        {/* Link 2: Batch View (Only for managers/admins/permission holders) */}
                        <Link to="/batch-timetable" className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">View by Batch</Link>
                        {/* Link 3: Lecturer Monitor */}
                        <Link to="/lecturer-monitor" className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Lecturer Monitor</Link>
                          <Link to="/hod-allocation" className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Lecture Alocations</Link>


                    </div>
                </div>
            )}

            {userRole === 'lecturer' && (
               <>
               <Link to="/lecturerdb" className="hover:text-white transition-colors duration-300 hover:bg-[#663B91] px-4 py-1 rounded-full">Dashboard</Link>
               <Link to="/viewtimetable" className="hover:text-white transition-colors duration-300 hover:bg-[#663B91] px-4 py-1 rounded-full">My Timetable</Link>
               
               <Link to="/preferences" className="hover:text-white transition-colors duration-300 hover:bg-[#663B91] px-4 py-1 rounded-full">Pref</Link>
                
               </>
            )}
            {hasAccess('manage_curriculum') && (
              <Link to="/curriculum" className="hover:text-white transition-colors duration-300 hover:bg-[#663B91] px-4 py-1 rounded-full">Curriculum</Link>
            )}
            {hasAccess('manage_accounts') && (
              <Link to="/accounts" className="hover:text-white transition-colors duration-300 hover:bg-[#663B91] px-4 py-1 rounded-full">Accounts</Link>
            )}
            <button onClick={handleLogout} className="hover:text-white transition-colors duration-300 hover:bg-[#663B91] px-4 py-1 rounded-full border border-[#663B91]">Logout</button>
          </>
        )}
        {!userRole && (
          <Link to="/login" className="hover:text-white transition-colors duration-300 hover:bg-[#663B91] px-4 py-1 rounded-full">Login</Link>
        )}
      </nav>

      {/* MOBILE MENU */}
      <button className="md:hidden text-[#663B91] focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {isMenuOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col py-4 md:hidden z-50">
          {/* Add Batch Timetable link here only if authorized */}
          {(hasAccess('manage_timetable') || userRole === 'hod' || userRole === 'admin' || userRole === 'secretary') && (
             <Link to="/batch-timetable" onClick={closeMenu} className="px-6 py-3 hover:bg-gray-50 text-[#663B91] font-semibold">Batch Timetable</Link>
          )}
          <button onClick={handleLogout} className="mx-6 mt-4 py-2 rounded-full border border-[#663B91] text-[#663B91] font-bold hover:bg-[#663B91] hover:text-white transition-colors">Logout</button>
        </div>
      )}
    </header>
  );
}