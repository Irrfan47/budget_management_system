import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import ProfilePage from './components/profile/ProfilePage';
import UserManagement from './components/users/UserManagement';
import UserProgramView from './components/programs/user/UserProgramView';
import QueryPage from './components/query/QueryPage';
import UserListView from './components/programs/finance/UserListView';
import UserProgramsView from './components/programs/finance/UserProgramsView';
import StatusTracking from './components/status/StatusTracking';
import Login from './components/auth/Login';
import { authService } from './services/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!authService.getCurrentUser());

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
  };

  const currentUser = authService.getCurrentUser();
  const userRole = currentUser?.role;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />

        <Route element={isLoggedIn ? <Layout onLogout={handleLogout}><Outlet /></Layout> : <Navigate to="/login" />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={userRole === 'admin' ? <UserManagement /> : <Navigate to="/dashboard" />} />

          {/* User role: direct access to their programs */}
          <Route path="/program" element={userRole === 'user' ? <UserProgramView /> : <Navigate to="/dashboard" />} />
          <Route path="/query" element={userRole === 'user' ? <QueryPage /> : <Navigate to="/dashboard" />} />

          {/* Finance/Admin role: user list and user programs */}
          <Route path="/userlist" element={userRole === 'finance' || userRole === 'admin' ? <UserListView /> : <Navigate to="/dashboard" />} />
          <Route path="/userlist/program" element={userRole === 'finance' || userRole === 'admin' ? <UserProgramsView /> : <Navigate to="/dashboard" />} />

          <Route path="/status" element={<StatusTracking />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
