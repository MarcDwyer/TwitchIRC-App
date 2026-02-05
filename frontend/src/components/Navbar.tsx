import { LogoutBtn } from "./LogoutBtn.tsx";

export function Navbar() {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-zinc-800 border-b border-zinc-700">
      <h1 className="text-2xl font-bold text-zinc-100">Twitch Dashboard</h1>
      <LogoutBtn />
    </header>
  );
}
