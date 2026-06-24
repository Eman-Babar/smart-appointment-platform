import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatWidget from '../ai-chat/ChatWidget';
import Background from './Background';

export default function Layout({ children }) {
  return (
    <div className="app-bg">
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
      <ChatWidget />
    </div>
  );
}