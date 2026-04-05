import { Routes, Route } from 'react-router-dom';
import TopAppBar from './components/TopAppBar';
import BottomNav from './components/BottomNav';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SnackRadarPage from './pages/SnackRadarPage';
import RoutePage from './pages/RoutePage';

export default function App() {
  return (
    <div className="min-h-screen bg-surface text-on-surface pb-28">
      <TopAppBar />
      <main className="max-w-2xl mx-auto">
        <Routes>
          <Route path="/" element={<RoutePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/snacks" element={<SnackRadarPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
