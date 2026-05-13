import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UnifiedLogin from './UnifiedLogin';
import CitizenDashboard from './CitizenDashboard';
import AdminDashboard from './AdminDashboard'; // <-- 1. ADD THIS IMPORT

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UnifiedLogin />} />
        <Route path="/dashboard" element={<CitizenDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} /> {/* <-- 2. ADD THIS ROUTE */}
        
        {/* If they type a random URL, send them back to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;