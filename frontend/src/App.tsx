import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage.tsx";

const CLIENT_ID_KEY = "twitch_client_id";

function App() {
  const [clientId, setClientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored client ID on mount
    const storedClientId = localStorage.getItem(CLIENT_ID_KEY);
    if (storedClientId) {
      setClientId(storedClientId);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (id: string) => {
    localStorage.setItem(CLIENT_ID_KEY, id);
    setClientId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem(CLIENT_ID_KEY);
    setClientId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="text-zinc-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (!clientId) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-900">
      <header className="flex justify-between items-center px-8 py-4 bg-zinc-800 border-b border-zinc-700">
        <h1 className="text-2xl font-bold text-zinc-100">Twitch Dashboard</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="bg-transparent text-zinc-400 px-4 py-2 border border-zinc-700 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-zinc-700 hover:text-zinc-100"
        >
          Logout
        </button>
      </header>
      <main className="flex-1 p-8">
        <p className="text-zinc-300">
          Welcome! You are logged in with Client ID: {clientId.substring(0, 8)}
          ...
        </p>
      </main>
    </div>
  );
}

export default App;
