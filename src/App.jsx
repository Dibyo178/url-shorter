import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import DashboardHome from './Pages/HomePage';
import OtpPage from './Pages/OtpPage'; // OTP পেজটি ইম্পোর্ট করুন

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<DashboardHome />} />
        
        {/* এই লাইনটি যুক্ত করুন */}
        <Route path="/verify-otp" element={<OtpPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;