import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  SquareKanban,
  Store,
  UserRoundCog,
  Menu,
  AppWindow,
  MessageSquareMore,
  User,
  Sparkles,
} from 'lucide-react';
import StartProjectButton from './StartProjectButton';
import { useContext, useState } from 'react';
import { Context } from '../Context';
import toast from 'react-hot-toast';
import ring from '../assets/icons/ring.png';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    user,
    setUser,
    boardsObjects,
    setActiveBoardObject,
    activeBoardObject,
    fetchTasksPerBoard,
  } = useContext(Context);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const selectedBoard = boardsObjects.find((b) => b._id === e.target.value);
    setActiveBoardObject(selectedBoard);
    if (selectedBoard) {
      fetchTasksPerBoard(selectedBoard._id);
    }
  };

  const handleLoginClick = () => navigate('/login');

  const handleLogout = () => {
    toggleMobileMenu();
    if (window.confirm('Are you sure you want to log out?')) {
      fetch('http://localhost:4000/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      })
        .then((response) => {
          if (response.ok) {
            toast.success('Logged out successfully!');
            setUser(null);
            navigate('/');
          } else {
            console.error('Logout failed', response.statusText);
          }
        })
        .catch((error) => {
          console.error('Error during logout', error);
        });
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div>
      <header className="bg-[#565a47] z-0">
        <nav className="flex flex-col sm:flex-row items-center justify-between p-4 w-[90%] mx-auto">
          <div className="flex items-center gap-4">
            {user && (
              <div className="xl:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="flex items-center cursor-pointer text-white"
                >
                  <Menu strokeWidth={1.5} />
                </button>
              </div>
            )}
            <NavLink
              to={user ? '/home/overview' : '/'}
              className="text-xl font-bold flex items-center gap-1"
              aria-label="Go to Dashboard Home"
            >
              <img src={ring} alt="Wedly Logo" className="w-11" />
              <span style={{ fontFamily: 'Parisienne' }} className="text-4xl text-white font-light">
                Wedly
              </span>
            </NavLink>
          </div>

          {/* Right Side: Actions */}
          <ul className="flex flex-col sm:flex-row items-center sm:gap-4">
            {user ? (
              <>
                <div className="p-4">
                  {boardsObjects?.length > 0 ? (
                    <select
                      id="board-select"
                      value={activeBoardObject?._id || ''}
                      onChange={handleChange}
                      className="border border-[#94949498] bg-[#565a47] duration-300 hover:bg-[#46493a] text-white p-2 rounded w-full cursor-pointer"
                    >
                      <option value="" disabled>
                        Select a Board
                      </option>
                      {boardsObjects.map((board) => (
                        <option key={board._id} value={board._id}>
                          {board.name || 'Untitled Board'}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-500">Loading boards...</p>
                  )}
                </div>
                <li>
                  <StartProjectButton />
                </li>
              </>
            ) : (
              <button
                className="text-gray-600 hover:text-pink-500 transition-colors cursor-pointer text-lg"
                onClick={handleLoginClick}
              >
                Login
              </button>
            )}
          </ul>
        </nav>

        {/* Mobile Hamburger Slide-Out Menu for Logged In Users Only */}
        {user && isMobileMenuOpen && (
          <div className="xl:hidden bg-white shadow-md top-[72px] left-0 mt-8 w-full">
            <ul className="p-4 space-y-5">
              <li className="cursor-pointer font-medium flex gap-4 items-center">
                <LayoutDashboard strokeWidth={1} />
                <NavLink to="/home/overview" onClick={toggleMobileMenu}>
                  Overview
                </NavLink>
              </li>
              <li className="cursor-pointer font-medium flex gap-4 items-center">
                <SquareKanban strokeWidth={1} />
                <NavLink to="/home/tasks" onClick={toggleMobileMenu}>
                  Tasks
                </NavLink>
              </li>
              <li className="cursor-pointer font-medium flex gap-4 items-center">
                <Store strokeWidth={1} />
                <NavLink to="/home/vendor" onClick={toggleMobileMenu}>
                  Vendor
                </NavLink>
              </li>
              <li className="cursor-pointer font-medium flex gap-4 items-center">
                <User strokeWidth={1} />
                <NavLink to="/home/guest" onClick={toggleMobileMenu}>
                  Guest
                </NavLink>
              </li>
              <li className="cursor-pointer font-medium flex gap-4 items-center">
                <AppWindow strokeWidth={1} />
                <NavLink to="/home/boards" onClick={toggleMobileMenu}>
                  Boards
                </NavLink>
              </li>
              <li className="cursor-pointer font-medium flex gap-4 items-center">
                <MessageSquareMore strokeWidth={1} />
                <NavLink to="/home/messages" onClick={toggleMobileMenu}>
                  Messages
                </NavLink>
              </li>
              <li className="cursor-pointer font-medium flex gap-4 items-center">
                <Sparkles strokeWidth={1} />
                <NavLink to="/home/messages" onClick={toggleMobileMenu}>
                  AI Suggestions
                </NavLink>
              </li>
              <hr className="my-6 border-gray-300" />
              <li className="cursor-pointer font-medium flex gap-4 items-center">
                <UserRoundCog strokeWidth={1} />
                <NavLink to="/home/account" onClick={toggleMobileMenu}>
                  Profile
                </NavLink>
              </li>
              <li
                className="cursor-pointer font-medium flex gap-4 items-center"
                onClick={handleLogout}
              >
                <LogOut strokeWidth={1} />
                <span>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;
