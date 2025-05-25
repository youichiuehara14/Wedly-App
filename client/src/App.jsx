import { ContextProvider } from './Context';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import Register from './pages/Register';
import VendorPage from './pages/VendorPage';
import TasksPage from './pages/TasksPage';
import AccountPage from './pages/AccountPage';
import OverviewPage from './pages/OverviewPage';
import BoardsPage from './pages/BoardsPage';
import GlobalChatPage from './pages/GlobalChatPage';
import GuestPage from './pages/GuestPage';
import AIPage from './pages/AI-Page';

function App() {
  return (
    <ContextProvider>
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main Application Layout */}
        <Route path="/home" element={<HomePage />}>
          <Route path="overview" element={<OverviewPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="vendor" element={<VendorPage />} />
          <Route path="guest" element={<GuestPage />} />
          <Route path="boards" element={<BoardsPage />} />
          <Route path="messages" element={<GlobalChatPage />} />
          <Route path="ai" element={<AIPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </ContextProvider>
  );
}

export default App;
