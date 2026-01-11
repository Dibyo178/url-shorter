import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import DashboardHome from './Pages/HomePage';
import OtpPage from './Pages/OtpPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<DashboardHome />} />
        

        <Route path="/verify-otp" element={<OtpPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
