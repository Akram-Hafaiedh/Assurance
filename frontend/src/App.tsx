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
import ProjectCreate from './pages/projects/create';


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
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<ProtectedRoute element={<Users />} requiredRole="admin" />} />
          <Route path="/projects" element={<ProtectedRoute element={<ProjectListing />} />} />
          <Route path="/projects/:projectId" element={<ProtectedRoute element={<ProjectDetails />} />} />
          <Route path="/projects/create" element={<ProtectedRoute element={<ProjectCreate />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;