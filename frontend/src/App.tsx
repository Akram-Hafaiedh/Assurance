import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import ForgotPassword from './pages/forgotPassword';
import { AuthProvider } from './contexts/authContext';
import Users from './pages/users';
import ProtectedRoute from './routing/ProtectedRoute';
import ProjectDetails from './pages/projects/projectDetails';
import ProjectListing from './pages/projects/list';
import CustomerListing from './pages/customers/list';
import ProjectCreate from './pages/projects/create';
import Settings from './pages/settings';
import ErrorBoundary from './ErrorBoundary';
import Vacations from './pages/vacations';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home"
            element={
              <ErrorBoundary>
                <Home />
              </ErrorBoundary>
            }
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<ProtectedRoute element={<Users />} requiredRole="admin" />} />
          {/* <Route path="/customers" element={<ProtectedRoute element={<CustomerListing />} />} /> */}
          <Route path="/projects" element={<ProtectedRoute element={<ProjectListing />} />} />
          <Route path="/customers"
            element={
              <ErrorBoundary>
                <ProtectedRoute element={<CustomerListing />} />
              </ErrorBoundary>
            }
          />
          <Route path="/projects/:projectId" element={<ProtectedRoute element={<ProjectDetails />} />} />
          <Route path="/projects/create" element={<ProtectedRoute element={<ProjectCreate />} />} />
          <Route path="/vacations" element={<ProtectedRoute element={<Vacations />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;