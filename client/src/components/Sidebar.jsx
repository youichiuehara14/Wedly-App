import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  SquareKanban,
  UserRoundCog,
  AppWindow,
  MessageSquareMore,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  UserRound,
  User,
  Sparkles,
} from 'lucide-react';
import { useContext, useState } from 'react';
import { Context } from '../Context';
import { toast } from 'react-hot-toast';
import BASE_URL from '../config';

const SidebarItem = ({ to, icon: Icon, label, collapsed }) => (
  <li className="cursor-pointer hover:text-orange-400 font-medium">
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center ${collapsed ? 'justify-center' : 'gap-4'} ${
          isActive ? 'text-orange-400 font-semibold' : ''
        }`
      }
      title={collapsed ? label : ''}
    >
      <Icon strokeWidth={1} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  </li>
);

const Sidebar = () => {
  const { user, setUser } = useContext(Context);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (!confirmLogout) return;

    try {
      const response = await fetch(`${BASE_URL}/api/user/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        toast.success('Logged out successfully!');
        setUser(null);
        navigate('/');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const profileLetter = user?.firstName?.charAt(0).toUpperCase() || '?';

  return (
    <div
      className={`bg-[#565a47] hidden xl:flex flex-col justify-between h-full ${
        collapsed ? 'w-20' : 'w-60'
      } transition-all duration-300 border-r border-[#17171721]`}
    >
      {/* Toggle + Avatar */}
      <div>
        <div className="flex justify-end p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 hover:text-orange-400 transition cursor-pointer"
          >
            {collapsed ? <ChevronsRight /> : <ChevronsLeft />}
          </button>
        </div>

        <div className="flex flex-col items-center mb-4">
          <div
            className={`w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md ${
              collapsed ? 'text-xl w-12 h-12' : ''
            }`}
          >
            {profileLetter}
          </div>
          {!collapsed && (
            <span className="mt-2 text-sm font-semibold text-white">{user?.firstName}</span>
          )}
        </div>
      </div>

      {/* Top Menu */}
      <div className={`px-${collapsed ? '4' : '10'} py-5`}>
        <ul className="space-y-5 text-white">
          <SidebarItem
            to="/home/overview"
            icon={LayoutDashboard}
            label="Overview"
            collapsed={collapsed}
          />
          <SidebarItem to="/home/tasks" icon={SquareKanban} label="Tasks" collapsed={collapsed} />
          <SidebarItem to="/home/vendor" icon={Store} label="Vendor" collapsed={collapsed} />
          <SidebarItem to="/home/guest" icon={User} label="Guest" collapsed={collapsed} />
          <SidebarItem to="/home/boards" icon={AppWindow} label="Boards" collapsed={collapsed} />
          <SidebarItem
            to="/home/messages"
            icon={MessageSquareMore}
            label="Messages"
            collapsed={collapsed}
          />

          <SidebarItem to="/home/ai" icon={Sparkles} label="AI Suggestions" collapsed={collapsed} />
        </ul>
      </div>

      {/* Bottom Menu */}
      <div className={`mt-auto p-${collapsed ? '4' : '6'}`}>
        {!collapsed && <hr className="mb-6 border-gray-300" />}
        <ul className="space-y-5 text-white">
          <SidebarItem
            to="/home/account"
            icon={UserRoundCog}
            label="Profile"
            collapsed={collapsed}
          />
          <li
            className={`cursor-pointer hover:text-orange-400 font-medium flex items-center ${
              collapsed ? 'justify-center' : 'gap-4'
            }`}
            onClick={handleLogout}
            title={collapsed ? 'Logout' : ''}
          >
            <LogOut strokeWidth={1} />
            {!collapsed && <span>Logout</span>}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
