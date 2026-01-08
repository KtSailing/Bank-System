import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { DashboardPage } from './DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* デフォルトはログイン画面へ */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;