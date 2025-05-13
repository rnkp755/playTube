import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import VideoDetail from './pages/VideoDetail/VideoDetail';
import Upload from './pages/Upload/Upload';
import Community from './pages/Community/Community';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Profile from './pages/Profile/Profile';
import ProtectedRoute from './components/Common/ProtectedRoute';
import EditVideo from './pages/Upload/EditVideo';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="video/:videoId" element={<VideoDetail />} />
              <Route element={<ProtectedRoute />}>
                <Route path="upload" element={<Upload />} />
                <Route path="video/edit/:videoId" element={<EditVideo />} />
                <Route path="community" element={<Community />} />
                <Route path="profile/:username" element={<Profile />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;