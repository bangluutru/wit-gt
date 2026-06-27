import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';

// Layout
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Roadmap from './pages/Roadmap';
import Curriculum from './pages/Curriculum';
import LessonReader from './pages/LessonReader';
import Dictionary from './pages/Dictionary';
import Team from './pages/Team';
import Settings from './pages/Settings';
import AdminImport from './pages/AdminImport';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/curriculum" element={<Curriculum />} />
                <Route path="/lessons/:id" element={<LessonReader />} />
                <Route path="/dictionary" element={<Dictionary />} />
                <Route path="/team" element={<Team />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin/import" element={<AdminImport />} />
              </Route>
            </Route>
          </Routes>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
